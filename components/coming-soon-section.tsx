'use client'

import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, X } from 'lucide-react'
import { getValidImageUrl } from '@/lib/image-utils'
import { useCart } from '@/lib/cart-context'
import { formatPreorderPrice } from '@/lib/coming-soon-config'

export type ComingSoonConfig = {
  enabled: boolean
  title: string
  subtitle: string
  description: string
  ctaText: string
  image: string
  heroLabel: string
  heroSecondary: string
  visibleOnHome: boolean
  whatsappNumber: string
  launchDate: string
  preorderProducts: Array<{
    id: string
    name: string
    description: string
    image: string
    images?: string[]
    sizes: string[]
    is_preorder: boolean
    price?: number
    currency?: string
  }>
}

const defaultConfig: ComingSoonConfig = {
  enabled: true,
  title: 'COMING SOON',
  subtitle: 'TEE 01 / 02',
  description: 'Deux coloris. Une seule identité. La prochaine collection NONSTOP arrive bientôt.',
  ctaText: 'PRÉCOMMANDER',
  image: '/coming-soon-cover.jpeg',
  heroLabel: 'NONSTOP',
  heroSecondary: 'TEE 01 / 02',
  visibleOnHome: true,
  whatsappNumber: '',
  launchDate: '',
  preorderProducts: [
    {
      id: 'tee-01-white',
      name: 'TEE 01 — WHITE',
      description: 'T-shirt blanc avec logo bleu et noir',
      image: '/tee-01-white.jpeg',
      is_preorder: true,
      sizes: ['S', 'M', 'L', 'XL'],
      price: 0,
      currency: 'XOF'
    },
    {
      id: 'tee-02-black',
      name: 'TEE 02 — BLACK',
      description: 'T-shirt noir avec logo bleu et blanc',
      image: '/tee-02-black.jpeg',
      is_preorder: true,
      sizes: ['S', 'M', 'L', 'XL'],
      price: 0,
      currency: 'XOF'
    }
  ]
}

export function ComingSoonSection({ config, products }: { config?: Partial<ComingSoonConfig>; products?: any[] }) {
  const { addToCart } = useCart()
  const preorderSectionRef = useRef<HTMLElement | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [addedProductId, setAddedProductId] = useState<string | null>(null)
  const mergedConfig = { ...defaultConfig, ...(config || {}) }
  const preorderProducts = useMemo(() => {
    // Si l'administrateur a configuré des produits dans Coming Soon, on affiche TOUS ces produits
    if (Array.isArray(mergedConfig.preorderProducts) && mergedConfig.preorderProducts.length > 0) {
      return mergedConfig.preorderProducts
    }

    // Sinon, repli sur les produits marqués en précommande dans la boutique
    const list = Array.isArray(products) ? products : []
    const filtered = list.filter((product: any) => product.is_preorder === true || product.is_preorder === 1 || product.is_preorder === '1')
    return filtered.length > 0 ? filtered : defaultConfig.preorderProducts
  }, [products, mergedConfig])

  const handlePreorderCta = () => {
    preorderSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handlePreorderCheckout = (product: any) => {
    if (!product) return

    const productImages = Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : []

    const availableSizes = Array.isArray(product?.sizes) && product.sizes.length > 0
      ? product.sizes
      : ['S', 'M', 'L', 'XL']

    const chosenSize = selectedSizes[product.id] || availableSizes[0] || 'M'

    const safeProduct = {
      ...product,
      price: Number(product?.price) || 0,
      currency: product?.currency || 'XOF',
      image: productImages[0] || product?.image || defaultConfig.image,
      images: productImages,
      selectedSize: chosenSize,
      is_preorder: true,
      sold_out: false,
    }

    addToCart(safeProduct, 1)
    setAddedProductId(product.id)
    setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current))
    }, 2000)
  }

  if (!mergedConfig.enabled || !mergedConfig.visibleOnHome) return null

  return (
    <section className="w-full relative py-6 px-3 sm:px-6 rounded-2xl bg-gradient-to-b from-neutral-50/90 via-neutral-50/40 to-white border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* En-tête de la section avec badge lumineux */}
      <div className="mx-auto max-w-3xl text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[9px] font-bold uppercase tracking-[0.3em] mb-3 shadow-sm">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Édition Limitée • Précommandes</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black drop-shadow-sm">
          {mergedConfig.title || 'COMING SOON'}
        </h2>
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="h-0.5 w-10 bg-black" />
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-neutral-800">
            {mergedConfig.subtitle || 'TEE 01 / 02 — NOUVELLE COLLECTION'}
          </p>
          <span className="h-0.5 w-10 bg-black" />
        </div>
        <p className="mt-2 text-xs sm:text-sm text-neutral-600 tracking-wide max-w-lg mx-auto">
          {mergedConfig.description || 'Deux t-shirts. Une seule identité. Réservez votre pièce avant rupture.'}
        </p>
      </div>

      {preorderProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {preorderProducts.map((product: any) => {
            const productImages = Array.isArray(product.images) && product.images.length > 0
              ? product.images
              : product.image
                ? [product.image]
                : []
            const productImage = getValidImageUrl(productImages[0] || product.image || '', '/precommande.jpeg')
            const availableSizes = Array.isArray(product.sizes) && product.sizes.length > 0
              ? product.sizes
              : ['S', 'M', 'L', 'XL']
            const currentSelected = selectedSizes[product.id] || availableSizes[0] || 'M'

            return (
              <article
                key={product.id}
                className="group relative flex flex-col justify-between rounded-xl border-2 border-black/80 bg-white p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-5px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Ruban haut exclusif */}
                <div className="absolute -top-3.5 left-4 z-20">
                  <span className="bg-black text-white text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded shadow-md border border-neutral-700">
                    PRÉCOMMANDE OFFICIELLE
                  </span>
                </div>

                <div>
                  {/* Visuel produit agrandi avec fond contrasté */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100/70 mb-5 flex items-center justify-center p-3">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="h-full w-full object-contain filter drop-shadow-md group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Infos produit avec typo impactante */}
                  <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-neutral-100">
                    <div>
                      <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500 tracking-wide mt-0.5">
                        {product.description || 'Édition collector • Tissu premium'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base sm:text-lg font-black text-black tracking-tight">
                        {formatPreorderPrice(product?.price || 7000, product?.currency || 'XOF')}
                      </p>
                    </div>
                  </div>

                  {/* Sélecteur de tailles très visible */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-700">
                        Choisir la taille
                      </span>
                      <span className="text-[10px] text-neutral-400 font-medium">Coupe Regular Fit</span>
                    </div>
                    <div className="flex gap-2">
                      {availableSizes.map((size: string) => {
                        const isSelected = currentSelected === size
                        return (
                          <button
                            key={`${product.id}-size-${size}`}
                            type="button"
                            onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: size }))}
                            className={`flex-1 py-2.5 rounded text-xs font-black tracking-widest transition-all duration-200 ${
                              isSelected
                                ? 'bg-black text-white shadow-md scale-102 ring-2 ring-black ring-offset-1'
                                : 'bg-neutral-100 text-black border border-neutral-200 hover:bg-neutral-200'
                            }`}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Bouton d'action proéminent avec animation hover */}
                <Button
                  type="button"
                  onClick={() => handlePreorderCheckout(product)}
                  className={`w-full py-6 rounded-lg text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 shadow-md ${
                    addedProductId === product.id
                      ? 'bg-neutral-900 text-white'
                      : 'bg-black text-white hover:bg-neutral-800 hover:shadow-lg active:scale-[0.99]'
                  }`}
                >
                  {addedProductId === product.id
                    ? `✓ RÉSERVÉ EN TAILLE ${currentSelected}`
                    : `PRÉCOMMANDER EN TAILLE ${currentSelected} →`}
                </Button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
