'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import MasonryGallery from './MasonryGallery';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';


interface ShareItem {
  id: string;
  title: string;
  style: string;
  timestamp: string;
  generatedUrl: string;
  originalUrl: string;
  width: number;
  height: number;
}

interface MasonryImage {
  id: string;
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export default function ShareGallery() {
  const [images, setImages] = useState<MasonryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [scanCursor, setScanCursor] = useState<number | null>(null);
  const followUpRef = useRef<number>(0);
  const fetchRef = useRef<any>(null);
  const pathname = usePathname();
  
  const isEnglish = pathname?.startsWith('/en/') || pathname === '/en';

  const lastRequestRef = useRef<number>(0);
  const inFlightRef = useRef<boolean>(false);

  const ITEMS_PER_PAGE = 18;

  // Transform share items to masonry images
  const transformToMasonryImages = (items: ShareItem[]): MasonryImage[] => {
    return items.map(item => ({
      id: item.id,
      url: item.generatedUrl,
      // 优先使用后端尺寸；若缺失，不强制占比，加载完成后再以自然尺寸纠正
      width: item.width || undefined,
      height: item.height || undefined,
      alt: isEnglish ? `${item.style} Anime Conversion` : `${item.style} アニメ変換`,
    }));
  };

  // 自动追踪游标：存在下一游标且当前页未填满则继续强制拉取，直到凑满一页或游标失效
  const autoChaseCursor = useCallback((offsetBase: number, recentlyAdded: number) => {
    if (scanCursor === null || scanCursor === undefined) return;
    if (inFlightRef.current) return;
    const targetTotal = offsetBase + ITEMS_PER_PAGE;
    const currentTotal = images.length + recentlyAdded;
    if (currentTotal >= targetTotal) return;
    if (followUpRef.current >= 30) return;
    followUpRef.current += 1;
    setTimeout(() => {
      if (typeof fetchRef.current === 'function') {
        fetchRef.current(offsetBase + recentlyAdded, true, true);
      }
    }, 180);
  }, [scanCursor, ITEMS_PER_PAGE, images.length]);

  // Fetch share items from API
  const fetchShareItems = useCallback(async (offset: number = 0, append: boolean = false, force: boolean = false) => {
    // Debounce to prevent rapid requests
    const now = Date.now();
    const debounceMs = scanCursor !== null ? 150 : 1000;
    if (!force && now - lastRequestRef.current < debounceMs) {
      console.log('Request too fast, skipping...');
      return;
    }
    lastRequestRef.current = now;

    if (inFlightRef.current) {
      return;
    }

    try {
      inFlightRef.current = true;
      setIsFetching(true);
      if (!append && offset === 0) setLoading(true);
      // 新一轮加载重置跟进次数
      if (!append || offset === 0) followUpRef.current = 0;
      console.log('Fetching share items, offset:', offset, 'append:', append);
      
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const url = new URL(`${origin}/api/share/list`);
      url.searchParams.set('limit', String(ITEMS_PER_PAGE));
      url.searchParams.set('offset', String(offset));
      url.searchParams.set('sort', 'createdAt');
      url.searchParams.set('order', 'desc');
      // 渐进扫描：如果后端返回了cursor，则携带cursor继续扫描；带上时间预算tb以尽快返回一批
      if (scanCursor !== null && scanCursor !== undefined) {
        url.searchParams.set('cursor', String(scanCursor));
        url.searchParams.set('tb', '700');
      }
      const apiUrl = url.toString();
      const response = await fetch(apiUrl, {
        // 允许浏览器/边缘缓存按照响应头策略工作
        cache: 'default'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API response:', result);
      
      if (result.success && result.data?.items) {
        const newImages = transformToMasonryImages(result.data.items);
        console.log('Transformed images:', newImages.length, 'items', 'hasMore:', result.data.hasMore);
        
        if (append) {
          setImages(prev => [...prev, ...newImages]);
        } else {
          setImages(newImages);
        }

        // 若后端提供cursor，优先依据cursor判断是否还有更多（即使hasMore为false）
        const nextCursor = typeof result.data.cursor === 'number' ? result.data.cursor : (result.data.cursor ? Number(result.data.cursor) : null);
        if (nextCursor !== null && !Number.isNaN(nextCursor)) {
          setScanCursor(nextCursor);
          autoChaseCursor(offset, newImages.length);
        } else {
          setScanCursor(null);
        }
        setHasMore(Boolean(result.data.hasMore || nextCursor !== null));
        if (append) {
          setCurrentOffset(prev => prev + newImages.length);
        } else {
          setCurrentOffset(newImages.length);
        }
        
        // 仅在没有cursor且后端声明无更多时才判定结束
        if (newImages.length === 0) {
          const noMore = !result.data?.hasMore && (result.data?.cursor === undefined || result.data?.cursor === null)
          if (noMore) setHasMore(false)
        }
      } else {
        console.log('No items found or invalid response format:', result);
        if (!append) setImages([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to fetch share items:', error);
      if (!append) setImages([]);
      setHasMore(false);
    } finally {
      inFlightRef.current = false;
      setIsFetching(false);
      setLoading(false);
    }
  }, [ITEMS_PER_PAGE, isEnglish, scanCursor, autoChaseCursor]);

  // 保持 fetchShareItems 的最新引用，供 autoChaseCursor 使用
  useEffect(() => {
    fetchRef.current = fetchShareItems;
  }, [fetchShareItems]);

  // Initial load
  useEffect(() => {
    // 当语言（路径）变化时重置并重新加载
    setImages([]);
    setHasMore(true);
    setCurrentOffset(0);
    setScanCursor(null);
    fetchShareItems(0, false);
  }, [isEnglish]);

  // Load more handler for infinite scroll
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading || isFetching) return;
    console.log('Loading more items, offset:', currentOffset);
    await fetchShareItems(currentOffset, true);
  }, [hasMore, loading, isFetching, currentOffset, fetchShareItems]);



  // Handle image click - prefer path-style detail route; static export仍由 _redirects 兜底
  const handleImageClick = (image: MasonryImage) => {
    const id = encodeURIComponent(image.id)
    const target = isEnglish ? `/en/share/${id}` : `/share/${id}`
    window.location.href = target
  };

  return (
    <div className="w-full">
      {/* Gallery */}
      {(loading || isFetching) && images.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
            <p className="text-text-muted">ギャラリーを読み込み中...</p>
          </div>
        </div>
      ) : images.length > 0 ? (
        <>
          <MasonryGallery
            images={images}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loading || isFetching}
            onImageClick={handleImageClick}
          />
          {hasMore && !loading && !isFetching && (
            <div className="flex justify-center py-4">
              <button className="btn-outline px-6 py-2" onClick={handleLoadMore}>
                {isEnglish ? 'Load more' : 'さらに読み込む'}
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyGallery onRefresh={() => fetchShareItems(0, false)} />
      )}
    </div>
  );
}

function EmptyGallery({ onRefresh }: { onRefresh: () => void }) {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith('/en/') || pathname === '/en';
  
  return (
    <div className="text-center py-20">
      <div className="text-8xl mb-6">🎨</div>
      <h3 className="text-2xl font-bold text-text mb-4">
        {isEnglish ? 'Gallery is empty' : 'ギャラリーはまだ空です'}
      </h3>
      <p className="text-text-muted mb-8">
        {isEnglish ? 'Be the first to create a masterpiece!' : 'あなたが最初の作品を作ってみませんか？'}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.location.href = isEnglish ? '/en/workspace' : '/workspace'}
          className="btn-primary px-8 py-3 flex items-center gap-2"
        >
          <SparklesIcon className="w-5 h-5" />
          {isEnglish ? 'Get Started Now' : '今すぐ始める'}
        </button>
        <button
          onClick={onRefresh}
          className="btn-outline px-8 py-3"
        >
          {isEnglish ? 'Refresh' : '更新'}
        </button>
      </div>
    </div>
  );
}