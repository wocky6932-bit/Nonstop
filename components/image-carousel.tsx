"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { getValidImageUrl } from '@/lib/image-utils'

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
  autoPlayInterval?: number // en ms, ex: 3500ms
}

export function ImageCarousel({
  images,
  alt,
  className = "",
  autoPlayInterval = 3200
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const MIN_SWIPE_DISTANCE = 35

  // Valider les images
  const validImages = (Array.isArray(images) ? images : typeof images === 'string' ? [images] : [])
    .filter((img) => img && typeof img === 'string' && img.trim() &&
      (img.trim().startsWith('/') || img.trim().startsWith('http') || img.trim().startsWith('data:')))

  const total = validImages.length

  const goNext = () => {
    if (total <= 1) return
    setCurrentIndex((i) => (i + 1) % total)
  }

  const goPrev = () => {
    if (total <= 1) return
    setCurrentIndex((i) => (i - 1 + total) % total)
  }

  // Défilement automatique continu lorsqu'il y a plusieurs images
  useEffect(() => {
    if (total <= 1 || isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total)
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [total, isPaused, autoPlayInterval])

  // Gestion des glissements (Swipe) gauche et droite sur mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current
      if (Math.abs(distance) >= MIN_SWIPE_DISTANCE) {
        if (distance > 0) {
          // Swipe vers la gauche → image suivante
          goNext()
        } else {
          // Swipe vers la droite → image précédente
          goPrev()
        }
      }
    }
    touchStartX.current = null
    touchEndX.current = null
    // Reprendre le défilement automatique après un petit délai
    setTimeout(() => setIsPaused(false), 2000)
  }

  if (total === 0) {
    return (
      <div className={`relative aspect-[3/4] bg-gray-100 ${className}`}>
        <Image src="/placeholder.jpg" alt={alt} fill className="object-cover" />
      </div>
    )
  }

  if (total === 1) {
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
      className={`relative aspect-[3/4] bg-gray-50 overflow-hidden select-none ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Rendu des images avec transition douce */}
      {validImages.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={getValidImageUrl(img)}
            alt={`${alt} - vue ${idx + 1}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 50vw, 33vw"
            loading={idx === 0 ? 'eager' : 'lazy'}
            quality={85}
          />
        </div>
      ))}

      {/* Flèches discrètes gauche/droite visibles au hover sur desktop pour naviguer facilement */}
      <button
        type="button"
        aria-label="Image précédente"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goPrev()
        }}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-black items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-all text-xs"
      >
        ‹
      </button>

      <button
        type="button"
        aria-label="Image suivante"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goNext()
        }}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-black items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-all text-xs"
      >
        ›
      </button>

      {/* Indicateurs de pagination discrets (petits points blancs en bas) */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-none">
        {validImages.map((_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-3 h-1 bg-white shadow-xs'
                : 'w-1 h-1 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
