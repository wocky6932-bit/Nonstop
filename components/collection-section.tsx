'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useCart, Product } from '@/lib/cart-context'
import { useCurrency } from '@/lib/currency-context'
import { useToast } from '@/hooks/use-toast'
import { getValidImageUrl } from '@/lib/image-utils'
import { normalizeProductData } from '@/lib/product-utils'

interface CollectionSectionProps {
  title?: string
  bannerImage?: string
  products: Product[]
  targetProductIds?: string[]
}

export function CollectionSection({
  title = 'TARTAN',
  bannerImage = '/images/collection-essentiels-banner.jpg',
  products,
  targetProductIds = ['1793314904004', '1792639100833', '1792616909279'],
}: CollectionSectionProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { convertPrice, formatPrice } = useCurrency()

  // Indice carrousel individuel pour chaque carte produit
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({})

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    const normalized = normalizeProductData(product)
    addToCart(normalized)
    toast({
      title: 'Ajouté au panier',
      description: `${product.name} a été ajouté à votre panier`,
    })
  }

  const handleNextImage = (e: React.MouseEvent, productId: string, total: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (total <= 1) return
    setActiveImageIndices((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % total,
    }))
  }

  const handlePrevImage = (e: React.MouseEvent, productId: string, total: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (total <= 1) return
    setActiveImageIndices((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + total) % total,
    }))
  }

  const handleScrollToProducts = () => {
    const el = document.getElementById('collection-products-anchor')
    if (el) {
      const headerOffset = 60 // compense le header sticky s'il y a
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // Filtrer uniquement les t-shirts tartan demandés par l'utilisateur
  const collectionProducts = products.filter((p) => {
    if (targetProductIds.length > 0) {
      return targetProductIds.includes(p.id) || p.name.toLowerCase().includes('tartan')
    }
    return !p.is_preorder
  })

  return (
    <section className="w-full bg-white">
      {/* ── 1. BANNIÈRE ÉDITORIALE PLEIN CADRE EDGE-TO-EDGE STYLE TOROM ────────────────── */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] md:aspect-[16/9] overflow-hidden bg-black flex flex-col justify-between">
        {/* Photo de campagne */}
        <Image
          src={bannerImage}
          alt={title}
          fill
          className="object-cover object-center"
          priority
          quality={95}
        />

        {/* Overlay pour contraster élégamment */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/70" />

        {/* Titre positionné au-dessus du logo t-shirt */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-10 sm:pt-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-light uppercase tracking-[0.28em] text-white drop-shadow-md">
            {title}
          </h2>
        </div>

        {/* Bouton DÉCOUVRIR positionné en bas, dégageant ainsi le logo NONSTOP sur le t-shirt */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pb-12 sm:pb-16">
          <button
            onClick={handleScrollToProducts}
            className="bg-white text-black text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] px-8 sm:px-10 py-3 sm:py-3.5 hover:bg-neutral-100 transition-colors shadow-lg"
          >
            DÉCOUVRIR
          </button>
        </div>

        {/* Rappel du titre en bas à gauche de la photo */}
        <div className="absolute bottom-3 left-6 sm:bottom-6 sm:left-10 z-10">
          <span className="text-white/80 text-[10px] sm:text-xs uppercase tracking-[0.25em] font-light">
            {title}
          </span>
        </div>
      </div>

      {/* ── 2. CATALOGUE DE LA COLLECTION ───────────── */}
      <div id="collection-products-anchor" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12">
        {/* En-tête de section */}
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-[0.2em] text-black">
            {title}
          </h3>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {collectionProducts.map((product) => {
            // Liste d'images normalisées
            const productImages: string[] = (
              product.images && product.images.length > 0
                ? product.images
                : [product.image]
            ).filter(Boolean)

            const displayedIndex = activeImageIndices[product.id] || 0
            const activeImg = productImages[displayedIndex] || productImages[0] || product.image

            return (
              <div key={product.id} className="min-w-0 group flex flex-col justify-between">
                <Link href={`/shop/${product.id}`} className="block">
                  {/* Conteneur Image fond blanc pur style Torom */}
                  <div className="relative aspect-[3/4] bg-[#fdfdfd] overflow-hidden mb-3 border border-neutral-100/80">
                    <Image
                      src={getValidImageUrl(activeImg)}
                      alt={product.name}
                      fill
                      className="object-cover scale-110 sm:scale-115 transition-transform duration-500 group-hover:scale-120"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />

                    {/* Zone cliquable gauche / droite pour le carrousel */}
                    {productImages.length > 1 && (
                      <>
                        <div
                          className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                          onClick={(e) => handlePrevImage(e, product.id, productImages.length)}
                        />
                        <div
                          className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                          onClick={(e) => handleNextImage(e, product.id, productImages.length)}
                        />
                      </>
                    )}

                    {/* Indicateurs carrousel discrets style Torom (points minuscules) */}
                    {productImages.length > 1 && (
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-none">
                        {productImages.map((_, i) => (
                          <span
                            key={i}
                            className={`w-1 h-1 rounded-full transition-all ${
                              i === displayedIndex ? 'bg-neutral-800 scale-125' : 'bg-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Bouton d'ajout rapide "+" style Torom en bas à droite */}
                    {!product.sold_out && (
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        aria-label={`Ajouter ${product.name} au panier`}
                        className="absolute bottom-2.5 right-2.5 z-20 w-6 h-6 sm:w-7 sm:h-7 bg-white/95 border border-neutral-300 hover:border-black flex items-center justify-center text-neutral-800 hover:bg-black hover:text-white transition-colors duration-200"
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={1.5} />
                      </button>
                    )}

                    {/* Badge SOLD OUT discret */}
                    {product.sold_out && (
                      <div className="absolute top-2 left-2 z-20 bg-black text-white text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-light">
                        SOLD OUT
                      </div>
                    )}
                  </div>

                  {/* Infos produit sobres style Torom */}
                  <div className="pt-0.5">
                    <p className="text-[10px] sm:text-[11px] uppercase font-normal tracking-[0.14em] text-neutral-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] sm:text-[11px] font-medium text-neutral-900">
                        {formatPrice(convertPrice(product.price, product.currency))}
                      </span>
                      {product.original_price && Number(product.original_price) > product.price && (
                        <span className="text-[9px] sm:text-[10px] text-neutral-400 line-through">
                          {formatPrice(convertPrice(Number(product.original_price), product.currency))}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
