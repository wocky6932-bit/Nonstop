'use client'

import React from 'react'
import Image from 'next/image'
import { HangerIcon } from './hanger-icon'
import { Product } from '@/lib/cart-context'
import { getValidImageUrl } from '@/lib/image-utils'
import { useCurrency } from '@/lib/currency-context'

interface ClothingRackItemProps {
  product: Product
  isSelected: boolean
  isHovered: boolean
  index: number
  onSelect: (product: Product) => void
  onHover: (id: string | null) => void
}

export function ClothingRackItem({
  product,
  isSelected,
  isHovered,
  index,
  onSelect,
  onHover,
}: ClothingRackItemProps) {
  const { convertPrice, formatPrice } = useCurrency()
  const displayPrice = convertPrice(product.price, product.currency)
  const formattedPrice = formatPrice(displayPrice)

  // Récupérer l'image frontale valide
  const frontImageUrl = getValidImageUrl(product.image, '/placeholder.jpg')

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => onHover(product.id)}
      onMouseLeave={() => onHover(null)}
      tabIndex={0}
      role="button"
      aria-label={`Inspecter ${product.name}`}
      className={`relative flex-shrink-0 flex flex-col items-center cursor-pointer select-none outline-none group transition-all duration-300 ${
        isSelected
          ? 'scale-105 z-30'
          : isHovered
          ? 'scale-102 z-20 opacity-100'
          : 'scale-95 z-10 opacity-90 hover:opacity-100'
      }`}
      style={{
        width: '270px',
        margin: '0 10px',
        transformOrigin: 'top center',
      }}
    >
      {/* 1. Crochet et cintre suspendu à la barre métallique */}
      <div className="relative z-10 -mb-5 transition-transform duration-300 group-hover:-rotate-1 group-active:rotate-1">
        <HangerIcon className="w-48 h-18 text-neutral-800" />
      </div>

      {/* 2. Carte vêtement suspendu (effet carte showroom sur fond clair) */}
      <div
        className={`relative w-full aspect-[3/4] max-h-[370px] rounded-sm overflow-hidden bg-white/95 backdrop-blur-xs border transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.06)] ${
          isSelected
            ? 'border-neutral-900 shadow-[0_16px_36px_rgba(0,0,0,0.16)] ring-2 ring-neutral-900/30'
            : 'border-neutral-300/70 group-hover:border-neutral-700 group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]'
        }`}
      >
        {/* Badges statut (SOLD OUT / PRÉCOMMANDE) */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 pointer-events-none">
          {product.sold_out && (
            <span className="bg-black/90 text-white text-[9px] px-2 py-0.5 tracking-wider font-bold uppercase rounded-xs shadow-xs">
              SOLD OUT
            </span>
          )}
          {product.is_preorder && !product.sold_out && (
            <span className="bg-blue-600/95 text-white text-[9px] px-2 py-0.5 tracking-wider font-bold uppercase rounded-xs shadow-xs">
              PRÉCOMMANDE
            </span>
          )}
        </div>

        {/* Indicateur de clic interactif */}
        <div className="absolute top-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-neutral-900/85 text-lime-300 text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs">
            Inspecter
          </span>
        </div>

        {/* Photo réelle du vêtement centré */}
        <div className="relative w-full h-full p-4 flex items-center justify-center">
          <Image
            src={frontImageUrl}
            alt={product.name}
            fill
            sizes="270px"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            priority={index < 4}
          />
        </div>

        {/* Étiquette volante streetwear en bas du vêtement (Style boutique moderne) */}
        <div className="absolute bottom-2.5 inset-x-2.5 bg-neutral-950/90 text-white py-2 px-3 rounded-xs backdrop-blur-sm transition-all duration-200 flex items-center justify-between border border-white/10 shadow-sm">
          <div className="min-w-0 pr-2">
            <p className="text-[11px] font-black tracking-wider uppercase truncate">
              {product.name}
            </p>
            {product.sizes && product.sizes.length > 0 && (
              <p className="text-[9px] text-neutral-400 tracking-tight font-mono">
                {product.sizes.slice(0, 4).join(' • ')}
              </p>
            )}
          </div>
          <p className="text-xs font-mono font-bold text-lime-400 whitespace-nowrap">
            {formattedPrice}
          </p>
        </div>
      </div>

      {/* 3. Ombre portée réaliste au sol (ellipse douce) */}
      <div
        className={`w-4/5 h-3.5 rounded-[100%] bg-neutral-900/15 blur-xs mt-3.5 transition-all duration-300 ${
          isSelected ? 'scale-110 opacity-35' : 'scale-95 opacity-20'
        }`}
      />
    </div>
  )
}
