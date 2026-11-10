'use client'

import { useState, useEffect, useMemo } from 'react'
import { DropConfig, DropProduct, DEFAULT_DROP_CONFIG, normalizeDropConfig } from '@/lib/drop-config'
import { getValidImageUrl } from '@/lib/image-utils'
import { useCart } from '@/lib/cart-context'
import { Sparkles, ShoppingBag, Check } from 'lucide-react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate).getTime()
  const now = new Date().getTime()
  const diff = target - now

  if (isNaN(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds, isExpired: false }
}

export function DropSection({ config }: { config?: Partial<DropConfig> }) {
  const { addToCart } = useCart()
  const currentConfig = useMemo(() => normalizeDropConfig(config), [config])

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false })
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [addedProductId, setAddedProductId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calculateTimeLeft(currentConfig.targetDate))
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(currentConfig.targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [currentConfig.targetDate])

  if (!currentConfig.enabled) {
    return null
  }

  const handleAddToCart = (product: DropProduct) => {
    const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL']
    const chosenSize = selectedSizes[product.id] || availableSizes[0] || 'M'

    const safeProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency || 'CFA',
      image: product.image,
      images: product.images || [product.image],
      selectedSize: chosenSize,
      is_preorder: true,
      sold_out: false
    }

    addToCart(safeProduct, 1)
    setAddedProductId(product.id)
    setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current))
    }, 2200)
  }

  const filteredProducts = currentConfig.products.filter((product) => {
    if (selectedCategory === 'ALL') return true
    return product.badge?.toLowerCase() === selectedCategory.toLowerCase()
  })

  return (
    <section className="w-full bg-white text-black py-12 md:py-16 border-t border-b border-neutral-100">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Navigation Drop Filter (ALL / DROP 1 / ...) style Blank Street */}
        {currentConfig.categories && currentConfig.categories.length > 1 && (
          <div className="flex items-center justify-center gap-6 sm:gap-10 mb-8 sm:mb-12">
            {currentConfig.categories.map((cat) => {
              const isActive = selectedCategory.toUpperCase() === cat.toUpperCase()
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs sm:text-sm uppercase tracking-[0.25em] font-bold transition-all duration-200 pb-1 ${
                    isActive
                      ? 'text-black border-b-2 border-black'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        )}

        {/* Header : Tagline & Date */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.35em] text-neutral-500 mb-2">
            {currentConfig.tagline || 'DROP 1 · COMING SOON'}
          </p>
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-neutral-800">
            {currentConfig.dateLabel || '08/12/26 19:00 GMT'}
          </p>
        </div>

        {/* Compteur interactif Blank Street (Jours / Heures / Minutes / Secondes) */}
        <div className="grid grid-cols-4 gap-2 sm:gap-6 max-w-lg mx-auto mb-14 sm:mb-20 text-center">
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-black tabular-nums">
              {mounted ? String(timeLeft.days).padStart(2, '0') : '00'}
            </span>
            <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.25em] text-neutral-400 mt-1 sm:mt-2 font-medium">
              DAYS
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-black tabular-nums">
              {mounted ? String(timeLeft.hours).padStart(2, '0') : '00'}
            </span>
            <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.25em] text-neutral-400 mt-1 sm:mt-2 font-medium">
              HOURS
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-black tabular-nums">
              {mounted ? String(timeLeft.minutes).padStart(2, '0') : '00'}
            </span>
            <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.25em] text-neutral-400 mt-1 sm:mt-2 font-medium">
              MINUTES
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-black tabular-nums">
              {mounted ? String(timeLeft.seconds).padStart(2, '0') : '00'}
            </span>
            <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.25em] text-neutral-400 mt-1 sm:mt-2 font-medium">
              SECONDS
            </span>
          </div>
        </div>

        {/* Grille des 2 Produits du Drop (Style épuré Blank Street) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto">
          {filteredProducts.map((product) => {
            const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL']
            const activeSize = selectedSizes[product.id] || availableSizes[0] || 'M'
            const isAdded = addedProductId === product.id

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between bg-white text-center"
              >
                {/* Image du produit avec fond propre et zoom subtil */}
                <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden bg-neutral-50/70 rounded-md mb-4 flex items-center justify-center p-4">
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
                      {product.badge}
                    </span>
                  )}
                  <img
                    src={getValidImageUrl(product.image, '/placeholder.jpg')}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Nom du produit en majuscules style Blank Street */}
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-black mb-1">
                  {product.name}
                </h3>

                {product.subtitle && (
                  <p className="text-[11px] text-neutral-400 tracking-wider mb-2">
                    {product.subtitle}
                  </p>
                )}

                {/* Prix du produit */}
                <div className="mb-3">
                  <span className="text-sm sm:text-base font-semibold text-black tracking-wide">
                    {product.price.toLocaleString('fr-FR')} {product.currency || 'CFA'}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-neutral-400 line-through ml-2">
                      {product.originalPrice.toLocaleString('fr-FR')} {product.currency || 'CFA'}
                    </span>
                  )}
                </div>

                {/* Statut sous le prix (Coming soon ou Précommande) */}
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-medium mb-4">
                  {product.statusText || 'Coming soon'}
                </p>

                {/* Sélecteur de taille & Bouton de précommande */}
                {currentConfig.allowPreorder && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-center gap-1.5">
                      {availableSizes.map((size) => {
                        const isSelected = activeSize === size
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: size }))}
                            className={`w-9 h-8 rounded text-xs font-bold tracking-wider transition-all duration-150 ${
                              isSelected
                                ? 'bg-black text-white'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                            }`}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className={`w-full py-3 px-4 rounded text-xs font-bold uppercase tracking-[0.25em] transition-all duration-200 flex items-center justify-center gap-2 ${
                        isAdded
                          ? 'bg-neutral-900 text-white'
                          : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.98]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          AJOUTÉ EN TAILLE {activeSize}
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          {currentConfig.buttonText || 'PRÉCOMMANDER'} ({activeSize})
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
