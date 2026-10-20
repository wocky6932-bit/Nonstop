'use client'

import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
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
    <section className="w-full pt-4 pb-2">
      <div className="mx-auto max-w-3xl text-center mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-neutral-500 mb-2">
          NOUVELLE COLLECTION
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black">
          {mergedConfig.title || 'COMING SOON'}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-600 tracking-wide max-w-lg mx-auto">
          {mergedConfig.description || 'Deux t-shirts. Une seule identité. Précommandes ouvertes.'}
        </p>
      </div>

      {preorderProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                className="group flex flex-col justify-between border border-neutral-100 bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300"
              >
                {/* Image container avec badge Précommande en haut à gauche */}
                <div>
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-50 mb-4">
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="bg-black text-white text-[9px] font-semibold uppercase tracking-[0.2em] px-2 py-1">
                        PRÉCOMMANDE
                      </span>
                    </div>

                    <img
                      src={productImage}
                      alt={product.name}
                      className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Infos produit */}
                  <div className="space-y-1 mb-4">
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-black">
                      {product.name}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-600 tracking-wider">
                      {formatPreorderPrice(product?.price || 7000, product?.currency || 'XOF')}
                    </p>
                  </div>

                  {/* Sélecteur de tailles */}
                  <div className="mb-4">
                    <div className="flex gap-1.5 sm:gap-2">
                      {availableSizes.map((size: string) => {
                        const isSelected = currentSelected === size
                        return (
                          <button
                            key={`${product.id}-size-${size}`}
                            type="button"
                            onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: size }))}
                            className={`flex-1 py-1.5 border text-xs font-semibold tracking-wider transition-all duration-200 ${
                              isSelected
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black border-neutral-200 hover:border-black'
                            }`}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Bouton Précommander */}
                <Button
                  type="button"
                  onClick={() => handlePreorderCheckout(product)}
                  className={`w-full py-4 text-[10px] font-semibold uppercase tracking-[0.25em] transition-all duration-300 ${
                    addedProductId === product.id
                      ? 'bg-neutral-800 text-white'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  {addedProductId === product.id
                    ? `AJOUTÉ (${currentSelected}) ✓`
                    : 'PRÉCOMMANDER →'}
                </Button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
