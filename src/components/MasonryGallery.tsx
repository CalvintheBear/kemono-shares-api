'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

interface MasonryImage {
  id: string;
  url: string;
  width: number;
  height: number;
  blurDataUrl?: string;
  alt?: string;
}

interface MasonryGalleryProps {
  images: MasonryImage[];
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  loading?: boolean;
}

interface ColumnData {
  items: MasonryImage[];
  height: number;
}

const BREAKPOINTS = {
  sm: 640,
  md: 768,
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
}: MasonryGalleryProps) {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: '100px',
  });

  // Calculate column count based on container width
  const columnCount = useMemo(() => {
    if (typeof window === 'undefined') return 3;
    
    const width = containerRef.current?.clientWidth || window.innerWidth;
    
    if (width >= BREAKPOINTS['2xl']) return 6;
    if (width >= BREAKPOINTS.xl) return 5;
    if (width >= BREAKPOINTS.lg) return 4;
    if (width >= BREAKPOINTS.md) return 3;
    if (width >= BREAKPOINTS.sm) return 2;
    return 1;
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

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasMore && !isLoading && !loading) {
      setIsLoading(true);
      onLoadMore().finally(() => setIsLoading(false));
    }
  }, [inView, hasMore, isLoading, loading, onLoadMore]);

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
              />
            ))}
          </div>
        ))}
      </div>

      {/* Loading indicator for infinite scroll */}
      {(isLoading || loading) && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
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
}

function MasonryImageCard({ image, columnWidth }: MasonryImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [actualHeight, setActualHeight] = useState(0);

  // Calculate initial height based on aspect ratio
  const aspectRatio = image.width && image.height ? image.height / image.width : 1;
  const initialHeight = Math.round(columnWidth * aspectRatio);

  useEffect(() => {
    if (!image.url) return;

    const img = new window.Image();
    img.onload = () => {
      setIsLoaded(true);
      // Use actual image dimensions if available
      const actualRatio = img.naturalWidth && img.naturalHeight 
        ? img.naturalHeight / img.naturalWidth 
        : aspectRatio;
      setActualHeight(Math.round(columnWidth * actualRatio));
    };
    img.onerror = () => {
      setIsError(true);
      setActualHeight(initialHeight);
    };
    img.src = image.url;
  }, [image.url, columnWidth, aspectRatio, initialHeight]);

  const displayHeight = actualHeight > 0 ? actualHeight : initialHeight;

  return (
    <div
      className="relative rounded-lg overflow-hidden bg-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer group"
      style={{
        width: `${columnWidth}px`,
        height: `${displayHeight}px`,
      }}
    >
      {/* Loading placeholder */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-500 text-sm">Failed to load</span>
        </div>
      )}

      {/* Image */}
      <Image
        src={image.url}
        alt={image.alt || 'Gallery image'}
        fill
        sizes={`${columnWidth}px`}
        className={`object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoadingComplete={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-sm font-medium truncate">{image.alt || 'Image'}</p>
        </div>
      </div>
    </div>
  );
}