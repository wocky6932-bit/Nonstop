"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Pin {
  id: string
  x: number
  y: number
  productId: string
  productName: string
  productPrice: number
}

interface Lookbook {
  id: string
  title: string
  image_url: string
  pins: Pin[]
}

export function ShoppableLookbook({ lookbook }: { lookbook: Lookbook }) {
  const [activePin, setActivePin] = useState<string | null>(null)

  if (!lookbook || !lookbook.image_url) return null

  return (
    <div className="relative w-full overflow-hidden bg-black group">
      {/* Container de l'image (pleine largeur) */}
      <div className="relative w-full aspect-[4/5] md:aspect-[21/9]">
        <Image
          src={lookbook.image_url}
          alt={lookbook.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
      </div>

      {/* Titre superposé */}
      <div className="absolute top-6 left-6 md:top-12 md:left-12 pointer-events-none">
        <h2 className="text-white text-2xl md:text-4xl font-bold uppercase tracking-widest drop-shadow-lg">
          {lookbook.title}
        </h2>
      </div>

      {/* Pins interactifs */}
      {lookbook.pins?.map((pin) => (
        <div
          key={pin.id}
          className="absolute z-10"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          onMouseEnter={() => setActivePin(pin.id)}
          onMouseLeave={() => setActivePin(null)}
        >
          {/* Le bouton + */}
          <button 
            className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-lg cursor-pointer animate-pulse"
            aria-label="Voir le produit"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
          </button>

          {/* Tooltip du produit */}
          <div 
            className={`absolute z-20 w-48 bg-white shadow-2xl transition-all duration-300 pointer-events-auto
              ${activePin === pin.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
              /* Positionnement intelligent: on le met en bas à droite par défaut, sauf s'il est trop près du bord */
              ${pin.x > 80 ? 'right-0' : 'left-4'} 
              ${pin.y > 80 ? 'bottom-full mb-4' : 'top-4 mt-2'}
            `}
          >
            <div className="p-3">
              <h3 className="font-bold text-xs uppercase tracking-widest mb-1 truncate text-black">{pin.productName}</h3>
              <p className="text-xs text-gray-500 mb-3">{pin.productPrice} XOF</p>
              
              <Link href={`/shop/${pin.productId}`} className="block">
                <button className="w-full bg-black text-white text-[10px] uppercase tracking-widest py-2 hover:bg-gray-800 transition-colors">
                  Voir l'article
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
