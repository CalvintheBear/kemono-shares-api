'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

interface MasonryImage {
  id: string;
  url: string;
  width?: number;
  height?: number;
  blurDataUrl?: string;
  alt?: string;
}

interface MasonryGalleryProps {
  images: MasonryImage[];
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  onImageClick?: (image: MasonryImage) => void;
}

interface ColumnData {
  items: MasonryImage[];
  height: number;
}

const BREAKPOINTS = {
  sm: 480,
  md: 640,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const GUTTER_SIZE = 16;

export default function MasonryGallery({
  images,
  onLoadMore,
  hasMore,
  loading = false,
  onImageClick,
}: MasonryGalleryProps) {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
    rootMargin: '1500px', // 更大触发范围，防止识别不到
  });
  const autoLoadAttemptsRef = useRef(0);

  // Calculate column count based on container width
  const columnCount = useMemo(() => {
    if (typeof window === 'undefined') return 3;

    const width = containerRef.current?.clientWidth || window.innerWidth;

    // PC：5-6 列；移动端：3 列
    if (width >= BREAKPOINTS['2xl']) return 6; // ≥1536px
    if (width >= BREAKPOINTS.xl) return 5;     // ≥1280px
    if (width >= BREAKPOINTS.lg) return 5;     // ≥1024px
    // ≤1024 一律 3 列
    return 3;
  }, [containerRef]);

  // Distribute images across columns using Pinterest's algorithm
  const distributeImages = useCallback((images: MasonryImage[], columnCount: number) => {
    if (columnCount === 0 || !containerRef.current) return [];
    
    const newColumns: ColumnData[] = Array.from({ length: columnCount }, () => ({
      items: [],
      height: 0,
    }));

    const containerWidth = containerRef.current.clientWidth;
    const columnWidth = Math.floor((containerWidth - (columnCount - 1) * GUTTER_SIZE) / columnCount);

    images.forEach((image) => {
      // Find shortest column
      const shortestColumn = newColumns.reduce((shortest, current) => {
        return current.height < shortest.height ? current : shortest;
      });

      // Calculate scaled height maintaining aspect ratio
      const aspectRatio = image.width && image.height ? image.height / image.width : 1;
      const scaledHeight = Math.round(columnWidth * aspectRatio);

      shortestColumn.items.push(image);
      shortestColumn.height += scaledHeight + GUTTER_SIZE;
    });

    return newColumns;
  }, []);

  // Recalculate columns when images or column count changes
  useEffect(() => {
    if (images.length > 0 && containerRef.current) {
      const newColumns = distributeImages(images, columnCount);
      setColumns(newColumns);
    }
  }, [images, columnCount, distributeImages]);

  // Handle infinite scroll with proper debouncing
  useEffect(() => {
    if (inView && hasMore && !isLoading && !loading) {
      setIsLoading(true);
      onLoadMore().finally(() => setIsLoading(false));
    }
  }, [inView, hasMore, isLoading, loading, onLoadMore]);

  // 当内容高度不足以填满视口时，自动追加加载，最多尝试6次，避免一次性加载过多
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current) return;
    if (!hasMore || isLoading || loading) return;

    const height = containerRef.current.getBoundingClientRect().height;
    const viewport = window.innerHeight || 800;
    if (height < viewport * 0.9 && autoLoadAttemptsRef.current < 6) {
      autoLoadAttemptsRef.current += 1;
      setIsLoading(true);
      onLoadMore().finally(() => setIsLoading(false));
    }
  }, [columns, hasMore, isLoading, loading, onLoadMore]);

  // 兜底：滚动到底部附近时也触发加载（节流）
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!hasMore) return;
    let ticking = false;

    const handle = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const viewport = window.innerHeight || 800;
        const docHeight = document.documentElement.scrollHeight || 0;
        const distanceToBottom = docHeight - (scrollY + viewport);
        if (distanceToBottom < 1200 && !isLoading && !loading) {
          setIsLoading(true);
          onLoadMore().finally(() => setIsLoading(false));
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    handle(); // 初次检查
    return () => {
      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [hasMore, isLoading, loading, onLoadMore]);

  // Handle window resize with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (containerRef.current && images.length > 0) {
          const newColumns = distributeImages(images, columnCount);
          setColumns(newColumns);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [images, columnCount, distributeImages]);

  // Initial load
  useEffect(() => {
    if (containerRef.current && images.length > 0) {
      const newColumns = distributeImages(images, columnCount);
      setColumns(newColumns);
    }
  }, [images, columnCount, distributeImages]);

  if (images.length === 0) {
    return null;
  }

  const columnWidth = containerRef.current 
    ? Math.floor((containerRef.current.clientWidth - (columnCount - 1) * GUTTER_SIZE) / columnCount)
    : 300;

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex gap-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex-1 flex flex-col gap-4">
            {column.items.map((image) => (
              <MasonryImageCard
                key={image.id}
                image={image}
                columnWidth={columnWidth}
                onClick={onImageClick}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Loading indicator for infinite scroll */}
      {(isLoading || loading) && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        </div>
      )}

      {/* Intersection observer target */}
      {hasMore && <div ref={loadMoreRef} className="h-20" />}
    </div>
  );
}

interface MasonryImageCardProps {
  image: MasonryImage;
  columnWidth: number;
  onClick?: (image: MasonryImage) => void;
}

function MasonryImageCard({ image, columnWidth, onClick }: MasonryImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [actualHeight, setActualHeight] = useState(0);
  const { ref: inViewRef, inView } = useInView({ rootMargin: '400px', triggerOnce: true });

  // 使用传入的宽高比计算占位高度，图片加载完成后根据真实尺寸纠正
  const aspectRatio = image.width && image.height ? image.height / image.width : 1;
  const initialHeight = Math.round(columnWidth * aspectRatio);
  const displayHeight = actualHeight > 0 ? actualHeight : initialHeight;

  return (
    <div
      className="image-container relative overflow-hidden cursor-pointer"
      style={{
        width: `${columnWidth}px`,
        height: `${displayHeight}px`,
        // 降低首屏渲染与离屏开销
        contentVisibility: 'auto' as any,
        containIntrinsicSize: `${displayHeight}px ${columnWidth}px` as any,
      }}
      ref={inViewRef}
      onClick={() => onClick?.(image)}
    >
      {/* Loading placeholder */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-border animate-pulse" />
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <span className="text-text-muted text-sm">Failed to load</span>
        </div>
      )}

      {/* Image */}
      {inView && (
        <Image
          src={`/api/img?u=${encodeURIComponent(image.url)}&w=${columnWidth}&q=70&fm=webp`}
          alt={image.alt || 'Gallery image'}
          fill
          sizes={`${columnWidth}px`}
          className={`object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          // 显式惰性加载与快速解码
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          // 轻量模糊占位，避免白屏
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNyIgdmlld0JveD0iMCAwIDEwIDciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjciIGZpbGw9IiNlZWUiLz48L3N2Zz4="
          onLoadingComplete={(img) => {
            setIsLoaded(true);
            const naturalRatio = img.naturalWidth && img.naturalHeight
              ? img.naturalHeight / img.naturalWidth
              : aspectRatio;
            setActualHeight(Math.round(columnWidth * naturalRatio));
          }}
          onError={() => setIsError(true)}
        />
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-sm font-medium truncate">{image.alt || 'Image'}</p>
        </div>
      </div>
    </div>
  );
}