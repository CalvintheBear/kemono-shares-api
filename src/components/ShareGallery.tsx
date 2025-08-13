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
  width: number;
  height: number;
  alt?: string;
}

export default function ShareGallery() {
  const [images, setImages] = useState<MasonryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const pathname = usePathname();
  
  const isEnglish = pathname?.startsWith('/en/') || pathname === '/en';

  const lastRequestRef = useRef<number>(0);
  const inFlightRef = useRef<boolean>(false);

  const ITEMS_PER_PAGE = 20;

  // Transform share items to masonry images
  const transformToMasonryImages = (items: ShareItem[]): MasonryImage[] => {
    return items.map(item => ({
      id: item.id,
      url: item.generatedUrl,
      width: 800,
      height: 600,
      alt: isEnglish ? `${item.style} Anime Conversion` : `${item.style} アニメ変換`,
    }));
  };

  // Fetch share items from API
  const fetchShareItems = useCallback(async (offset: number = 0, append: boolean = false) => {
    // Debounce to prevent rapid requests
    const now = Date.now();
    if (now - lastRequestRef.current < 1000) {
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
      console.log('Fetching share items, offset:', offset, 'append:', append);
      
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const apiUrl = `${origin}/api/share/list?limit=${ITEMS_PER_PAGE}&offset=${offset}&sort=createdAt&order=desc`;
      const response = await fetch(apiUrl, {
        headers: {
          'Cache-Control': 'no-cache'
        }
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

        setHasMore(result.data.hasMore || false);
        setCurrentOffset(offset + newImages.length);
        
        // Prevent infinite loop if no new items
        if (newImages.length === 0) {
          setHasMore(false);
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
  }, [ITEMS_PER_PAGE, isEnglish]);

  // Initial load
  useEffect(() => {
    // 当语言（路径）变化时重置并重新加载
    setImages([]);
    setHasMore(true);
    setCurrentOffset(0);
    fetchShareItems(0, false);
  }, [isEnglish]);

  // Load more handler for infinite scroll
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading || isFetching) return;
    console.log('Loading more items, offset:', currentOffset);
    await fetchShareItems(currentOffset, true);
  }, [hasMore, loading, isFetching, currentOffset, fetchShareItems]);



  // Handle image click - use query param fallback to be compatible with static export
  const handleImageClick = (image: MasonryImage) => {
    const id = encodeURIComponent(image.id)
    const target = isEnglish ? `/en/share?id=${id}` : `/share?id=${id}`
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
        <MasonryGallery
          images={images}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loading={loading || isFetching}
          onImageClick={handleImageClick}
        />
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