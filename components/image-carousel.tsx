"use client"

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getValidImageUrl } from '@/lib/image-utils'

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // S'assurer que images est bien un tableau et valider chaque URL
  const safeImages = Array.isArray(images) ? images : 
                    (typeof images === 'string' ? [images] : [])

  // Filtrer les URLs invalides
  const validImages = safeImages.filter(img => {
    if (!img || typeof img !== 'string') return false
    const trimmed = img.trim()
    if (!trimmed) return false
    // Vérifier si c'est une URL relative ou absolue valide
    return trimmed.startsWith('/') || trimmed.startsWith('http') || trimmed.startsWith('data:')
  })

  if (validImages.length === 0) {
    return (
      <div className={`w-full h-64 bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500">Aucune image</span>
      </div>
    )
  }

  const goToPrevious = () => {
    console.log('Go to previous clicked! Current:', currentIndex)
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + validImages.length) % validImages.length
      console.log('Previous index:', newIndex)
      return newIndex
    })
  }

  const goToNext = () => {
    console.log('Go to next clicked! Current:', currentIndex)
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % validImages.length
      console.log('Next index:', newIndex)
      return newIndex
    })
  }

  if (validImages.length === 0) {
    return (
      <div className={`relative aspect-[3/4] bg-gray-50 ${className}`}>
        <Image
          src="/placeholder.svg"
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div className={`relative aspect-[3/4] bg-gray-50 overflow-hidden ${className}`}>
      <Image
        src={getValidImageUrl(validImages[currentIndex])}
        alt={`${alt} - Image ${currentIndex + 1}`}
        fill
        className="object-cover transition-all duration-500"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        loading="lazy"
        quality={85}
      />
      
      {/* Boutons de navigation - style normal */}
      {validImages.length > 1 && (
        <>
          <div
            onClick={goToPrevious}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 z-30 shadow-lg cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 text-gray-800" />
          </div>
          
          <div
            onClick={goToNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 z-30 shadow-lg cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 text-gray-800" />
          </div>
        </>
      )}
      
      {/* Indicateurs améliorés */}
      {validImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentIndex(index)
              }}
              className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                index === currentIndex 
                  ? 'bg-white border-gray-800 shadow-lg scale-110' 
                  : 'bg-white/70 border-gray-400 hover:bg-white hover:border-gray-600'
              }`}
              aria-label={`Aller à l'image ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
      
      {/* Compteur d'images */}
      {validImages.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-20">
          {currentIndex + 1} / {validImages.length}
        </div>
      )}
    </div>
  )
}