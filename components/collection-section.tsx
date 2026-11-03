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

  // Contrôles de vue (comme sur Torom Paris)
  // viewMode: 'grid' (2 colonnes) | 'single' (1 colonne large)
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid')
  // isMannequin: false (vue packshot / première image) | true (vue portée / deuxième image si disponible)
  const [isMannequin, setIsMannequin] = useState<boolean>(false)

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
      el.scrollIntoView({ behavior: 'smooth' })
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
    <section className="w-full my-12">
      {/* ── 1. BANNIÈRE ÉDITORIALE PLEIN CADRE STYLE TOROM ────────────────── */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] md:aspect-[16/9] overflow-hidden bg-black flex flex-col justify-between">
        {/* Photo de campagne */}
        <Image
          src={bannerImage}
          alt={title}
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />

        {/* Overlay sombre subtil pour faire claquer le titre et le bouton */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        {/* Espace supérieur */}
        <div className="relative z-10 p-6 sm:p-10" />

        {/* Titre & Bouton au centre */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-[0.25em] text-white drop-shadow-md mb-6">
            {title}
          </h2>

          <button
            onClick={handleScrollToProducts}
            className="bg-white text-black text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] px-8 sm:px-10 py-3 sm:py-3.5 hover:bg-neutral-200 transition-colors shadow-md"
          >
            DÉCOUVRIR
          </button>
        </div>

        {/* Rappel du titre en bas à gauche de la photo */}
        <div className="relative z-10 p-6 sm:p-10">
          <span className="text-white/80 text-[11px] sm:text-xs uppercase tracking-[0.25em] font-medium">
            {title}
          </span>
        </div>
      </div>

      {/* ── 2. CATALOGUE DE LA COLLECTION (ANCRE DE DÉFILEMENT) ───────────── */}
      <div id="collection-products-anchor" className="pt-8 sm:pt-12">
        {/* En-tête de section */}
        <div className="mb-4">
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-black">
            {title}
          </h3>
        </div>

        {/* Barre de contrôles style Torom : VUE + MANNEQUIN */}
        <div className="flex items-center justify-between py-3 border-b border-neutral-200 text-xs tracking-[0.18em] uppercase text-neutral-600 mb-6">
          {/* Bascule de grille VUE */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-neutral-500">VUE</span>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'single' : 'grid')}
              aria-label="Changer l'affichage de la grille"
              className="flex items-center gap-0.5 p-1 hover:text-black transition-colors"
            >
              {viewMode === 'grid' ? (
                // Icône 2 colonnes
                <div className="flex gap-0.5">
                  <span className="w-2.5 h-3 bg-neutral-900" />
                  <span className="w-2.5 h-3 bg-neutral-900" />
                </div>
              ) : (
                // Icône 1 colonne pleine
                <span className="w-5 h-3 bg-neutral-900" />
              )}
            </button>
          </div>

          {/* Bascule MANNEQUIN (Porté vs Packshot) */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-neutral-500">MANNEQUIN</span>
            <button
              onClick={() => setIsMannequin(!isMannequin)}
              aria-label="Basculer affichage mannequin"
              className={`w-7 h-3.5 border border-neutral-400 p-0.5 transition-colors flex items-center ${
                isMannequin ? 'bg-black border-black' : 'bg-transparent'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 transition-transform ${
                  isMannequin ? 'bg-white translate-x-3' : 'bg-neutral-400 translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Grille de produits */}
        <div
          className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2'
          }`}
        >
          {collectionProducts.map((product) => {
            // Liste d'images normalisées
            const productImages: string[] = (
              product.images && product.images.length > 0
                ? product.images
                : [product.image]
            ).filter(Boolean)

            // Si le mode "MANNEQUIN" est activé, on préfère afficher la 2ème image si disponible
            let displayedIndex = activeImageIndices[product.id] || 0
            if (isMannequin && productImages.length > 1 && displayedIndex === 0) {
              displayedIndex = 1
            } else if (!isMannequin && displayedIndex === 1 && productImages.length > 1) {
              displayedIndex = 0
            }

            const activeImg = productImages[displayedIndex] || productImages[0] || product.image

            return (
              <div key={product.id} className="min-w-0 group flex flex-col justify-between">
                <Link href={`/shop/${product.id}`} className="block">
                  {/* Conteneur Image épurée avec fond neutre / blanc */}
                  <div className="relative aspect-[3/4] bg-[#fafafa] overflow-hidden mb-3">
                    <Image
                      src={getValidImageUrl(activeImg)}
                      alt={product.name}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
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

                    {/* Indicateurs carrousel discrets (petits points gris/noirs) */}
                    {productImages.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 pointer-events-none">
                        {productImages.map((_, i) => (
                          <span
                            key={i}
                            className={`w-1 h-1 rounded-full transition-all ${
                              i === displayedIndex ? 'bg-neutral-900 w-1.5' : 'bg-neutral-300'
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
                        className="absolute bottom-2.5 right-2.5 z-20 w-7 h-7 bg-white/95 border border-neutral-300 hover:border-black flex items-center justify-center text-neutral-900 hover:bg-black hover:text-white transition-colors duration-200 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    )}

                    {/* Badges discrets si sold out ou promo */}
                    {product.sold_out && (
                      <div className="absolute top-2 left-2 z-20 bg-black/80 text-white text-[9px] px-2 py-0.5 uppercase tracking-wider font-medium">
                        SOLD OUT
                      </div>
                    )}
                    {product.original_price &&
                      Number(product.original_price) > product.price &&
                      !product.sold_out && (
                        <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold">
                          PROMO
                        </div>
                      )}
                  </div>

                  {/* Infos produit sobres */}
                  <div className="pt-1">
                    <p className="text-[11px] sm:text-xs uppercase font-medium tracking-[0.14em] text-neutral-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] sm:text-xs font-semibold text-neutral-900">
                        {formatPrice(convertPrice(product.price, product.currency))}
                      </span>
                      {product.original_price && Number(product.original_price) > product.price && (
                        <span className="text-[10px] text-neutral-400 line-through">
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
