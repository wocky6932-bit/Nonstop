"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { getValidImageUrl } from '@/lib/image-utils'

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const MIN_SWIPE_DISTANCE = 40

  // Valider les images
  const validImages = (Array.isArray(images) ? images : typeof images === 'string' ? [images] : [])
    .filter((img) => img && typeof img === 'string' && img.trim() &&
      (img.trim().startsWith('/') || img.trim().startsWith('http') || img.trim().startsWith('data:')))

  const goNext = () => setCurrentIndex((i) => (i + 1) % validImages.length)
  const goPrev = () => setCurrentIndex((i) => (i - 1 + validImages.length) % validImages.length)

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const distance = touchStartX.current - touchEndX.current
    if (Math.abs(distance) < MIN_SWIPE_DISTANCE) return
    if (distance > 0) {
      // Swipe gauche → image suivante
      e.preventDefault()
      e.stopPropagation()
      goNext()
    } else {
      // Swipe droite → image précédente
      e.preventDefault()
      e.stopPropagation()
      goPrev()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  if (validImages.length === 0) {
    return (
      <div className={`relative aspect-[3/4] bg-gray-100 ${className}`}>
        <Image src="/placeholder.jpg" alt={alt} fill className="object-cover" />
      </div>
    )
  }

  if (validImages.length === 1) {
    return (
      <div className={`relative aspect-[3/4] bg-gray-50 overflow-hidden ${className}`}>
        <Image
          src={getValidImageUrl(validImages[0])}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          quality={85}
        />
      </div>
    )
  }

  return (
    <div
      className={`relative aspect-[3/4] bg-gray-50 overflow-hidden ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Image */}
      <Image
        src={getValidImageUrl(validImages[currentIndex])}
        alt={`${alt} ${currentIndex + 1}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 1024px) 50vw, 33vw"
        loading="lazy"
        quality={85}
      />



      {/* Zone de click gauche / droite — pour desktop */}
      <div
        className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goPrev()
        }}
      />
      <div
        className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goNext()
        }}
      />

      {/* Indicateurs — petits points en bas */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 pointer-events-none">
        {validImages.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-1.5 bg-white' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}