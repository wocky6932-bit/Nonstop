'use client'

import { useMemo, useRef } from 'react'
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
  const mergedConfig = { ...defaultConfig, ...(config || {}) }
  const preorderProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : []
    const configuredProducts = Array.isArray(mergedConfig.preorderProducts) && mergedConfig.preorderProducts.length > 0
      ? mergedConfig.preorderProducts
      : defaultConfig.preorderProducts

    const filtered = list.filter((product: any) => product.is_preorder === true || product.is_preorder === 1 || product.is_preorder === '1')
    return filtered.length >= 2 ? filtered.slice(0, 2) : configuredProducts
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

    const safeProduct = {
      ...product,
      price: Number(product?.price) || 0,
      currency: product?.currency || 'XOF',
      image: productImages[0] || product?.image || defaultConfig.image,
      images: productImages,
      selectedSize: product?.sizes?.[0] || 'M',
      is_preorder: true,
      sold_out: false,
    }

    addToCart(safeProduct, 1)
  }

  if (!mergedConfig.enabled || !mergedConfig.visibleOnHome) return null

  const heroImage = getValidImageUrl(mergedConfig.image, defaultConfig.image)

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#090909] text-white">
        <div className="relative mx-auto max-w-[1440px]">
          <div className="relative aspect-[16/13] w-full overflow-hidden bg-[#131313] sm:aspect-[16/11] md:aspect-[16/10]">
            <img
              src={heroImage}
              alt={mergedConfig.title || 'Coming Soon'}
              className="h-full w-full object-cover object-center opacity-95 grayscale-[0.15]"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[#050505]/20" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-[10px] font-medium uppercase tracking-[0.35em] text-white/80 md:px-8 md:pb-6">
              <span>{mergedConfig.heroLabel}</span>
              <span>{mergedConfig.heroSecondary}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-8 text-center md:py-12">
          <h2 className="text-5xl font-black uppercase tracking-[-0.08em] text-white sm:text-6xl md:text-[7rem]">
            {mergedConfig.title}
          </h2>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-white/70 md:w-20" />
            <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/80 md:text-xs">
              {mergedConfig.subtitle}
            </p>
            <span className="h-px w-12 bg-white/70 md:w-20" />
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
            {mergedConfig.description}
          </p>

          <div className="mt-7 flex justify-center">
            <Button
              type="button"
              onClick={handlePreorderCta}
              className="border border-white/80 bg-transparent px-8 py-5 text-[10px] font-medium uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black"
            >
              {mergedConfig.ctaText}
            </Button>
          </div>
        </div>
      </section>

      {preorderProducts.length > 0 && (
        <section ref={preorderSectionRef} className="mx-auto max-w-6xl bg-white px-4 py-8 md:px-6 md:py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {preorderProducts.map((product: any) => {
              const productImages = Array.isArray(product.images) && product.images.length > 0
                ? product.images
                : product.image
                  ? [product.image]
                  : []
              const productImage = getValidImageUrl(productImages[0] || product.image || '', '/precommande.jpeg')
              return (
                <article key={product.id} className="bg-transparent p-0 text-black">
                  <div className="relative mx-auto aspect-[4/5] w-full max-w-[540px] overflow-hidden bg-transparent">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="h-full w-full object-contain bg-transparent"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {productImages.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {productImages.map((image: string, imageIndex: number) => (
                        <div key={`${product.id}-image-${imageIndex}`} className="h-16 w-16 shrink-0 overflow-hidden rounded border border-black/10 bg-neutral-100">
                          <img
                            src={getValidImageUrl(image, '/precommande.jpeg')}
                            alt={`${product.name} ${imageIndex + 1}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-start justify-between gap-4 text-black">
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight md:text-xl">{product.name}</h3>
                      <p className="mt-2 text-sm text-black/70">{product.description || 'T-shirt NONSTOP en édition limitée.'}</p>
                    </div>
                    <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.25em] text-black/60">
                      {formatPreorderPrice(product?.price, product?.currency)}
                    </span>
                  </div>

                  <div className="mt-5">
                    <Button
                      type="button"
                      onClick={() => handlePreorderCheckout(product)}
                      className="w-full border border-black bg-white px-5 py-4 text-[10px] font-medium uppercase tracking-[0.3em] text-black hover:bg-black hover:text-white"
                    >
                      PRÉCOMMANDER
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

    </>
  )
}
