'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

interface HomeMasonryImage {
	id: string
	url: string
	alt?: string
	width?: number
	height?: number
}

interface HomeMasonryProps {
	images: HomeMasonryImage[]
	onImageClick?: (img: HomeMasonryImage) => void
}

const GUTTER = 16

export default function HomeMasonry({ images, onImageClick }: HomeMasonryProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [columnCount, setColumnCount] = useState(4)
	const [columnWidth, setColumnWidth] = useState(240)
	const [columns, setColumns] = useState<Record<number, HomeMasonryImage[]>>({})

	useEffect(() => {
		const calc = () => {
			const maxWidth = 1000
			const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
			const targetWidth = Math.min(maxWidth, winWidth - 32)
			const cols = winWidth >= 1280 ? 6 : winWidth >= 1024 ? 4 : 3
			const colW = Math.floor((targetWidth - (cols - 1) * GUTTER) / cols)
			setColumnCount(cols)
			setColumnWidth(colW)
		}

		calc()
		window.addEventListener('resize', calc)
		return () => window.removeEventListener('resize', calc)
	}, [])

	useEffect(() => {
		const next: Record<number, HomeMasonryImage[]> = {}
		for (let i = 0; i < columnCount; i++) next[i] = []
		const heights = new Array<number>(columnCount).fill(0)
		images.forEach(img => {
			const ratio = img.width && img.height ? img.height / img.width : 4 / 3
			const h = Math.round(columnWidth * ratio)
			let target = 0
			for (let i = 1; i < columnCount; i++) if (heights[i] < heights[target]) target = i
			next[target].push({ ...img, width: columnWidth, height: h })
			heights[target] += h + GUTTER
		})
		setColumns(next)
	}, [images, columnCount, columnWidth])

	const containerStyle = useMemo(() => {
		const width = columnCount * columnWidth + (columnCount - 1) * GUTTER
		return { width: `${width}px` }
	}, [columnCount, columnWidth])

	if (!images || images.length === 0) return null

	return (
		<div className="w-full flex justify-center">
			<div ref={containerRef} style={containerStyle} className="flex gap-4">
				{Array.from({ length: columnCount }).map((_, col) => (
					<div key={col} className="flex-1 flex flex-col gap-4">
						{(columns[col] || []).map(image => (
							<div
								key={image.id}
								style={{ width: `${columnWidth}px`, height: `${image.height}px` }}
								className="relative overflow-hidden rounded-xl bg-white shadow cursor-pointer"
								onClick={() => onImageClick?.(image)}
							>
								<Image
									src={image.url}
									alt={image.alt || 'AI生成画像'}
									fill
									sizes={`${columnWidth}px`}
									className="object-cover"
									unoptimized
								/>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	)
}


