'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import MasonryGallery from './MasonryGallery';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface ShareItem {
  id: string;
  title: string;
  style: string;
  timestamp: string;
  generatedUrl: string;
  originalUrl: string;
  width: number;
  height: number;
  generationType: 'text2img' | 'img2img' | 'template';
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
  const [activeFilter, setActiveFilter] = useState<'all' | 'text2img' | 'img2img' | 'template'>('all');
  const lastRequestRef = useRef<number>(0);

  const ITEMS_PER_PAGE = 20;

  // Transform share items to masonry images
  const transformToMasonryImages = (items: ShareItem[]): MasonryImage[] => {
    return items.map(item => ({
      id: item.id,
      url: item.generatedUrl,
      width: 800,
      height: 600,
      alt: `${item.style} アニメ変換`,
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

    if (loading || isFetching) return;

    try {
      setIsFetching(true);
      console.log('Fetching share items, offset:', offset, 'append:', append, 'filter:', activeFilter);
      
      const filterParam = activeFilter !== 'all' ? `&filter=${activeFilter}` : '';
      const response = await fetch(
        `/api/share/list?limit=${ITEMS_PER_PAGE}&offset=${offset}&sort=createdAt&order=desc${filterParam}`
      );

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
      setIsFetching(false);
      setLoading(false);
    }
  }, [loading, isFetching, ITEMS_PER_PAGE, activeFilter]);

  // Initial load
  useEffect(() => {
    fetchShareItems(0, false);
  }, [fetchShareItems]);

  // Load more handler for infinite scroll
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading || isFetching) return;
    console.log('Loading more items, offset:', currentOffset);
    await fetchShareItems(currentOffset, true);
  }, [hasMore, loading, isFetching, currentOffset, fetchShareItems]);

  // Handle filter change
  const handleFilterChange = (filter: 'all' | 'text2img' | 'img2img' | 'template') => {
    if (filter === activeFilter) return;
    
    setActiveFilter(filter);
    setImages([]);
    setCurrentOffset(0);
    setHasMore(true);
    setLoading(true);
    
    // Reset and fetch new data
    setTimeout(() => {
      fetchShareItems(0, false);
    }, 100);
  };

  // Handle image click
  const handleImageClick = (image: MasonryImage) => {
    window.open(`/share/${image.id}`, '_blank');
  };

  return (
    <div className="w-full">
      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部作品
          </button>
          <button
            onClick={() => handleFilterChange('text2img')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === 'text2img'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ✨ 文生图
          </button>
          <button
            onClick={() => handleFilterChange('img2img')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === 'img2img'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🎨 图生图
          </button>
          <button
            onClick={() => handleFilterChange('template')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === 'template'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📋 模板生成
          </button>
        </div>
      </div>

      {/* Gallery */}
      {(loading || isFetching) && images.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">ギャラリーを読み込み中...</p>
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
  return (
    <div className="text-center py-20">
      <div className="text-8xl mb-6">🎨</div>
      <h3 className="text-2xl font-bold text-gray-700 mb-4">
        ギャラリーはまだ空です
      </h3>
      <p className="text-gray-600 mb-8">
        あなたが最初の作品を作ってみませんか？
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.location.href = '/workspace'}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <SparklesIcon className="w-5 h-5" />
          今すぐ始める
        </button>
        <button
          onClick={onRefresh}
          className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300"
        >
          更新
        </button>
      </div>
    </div>
  );
}