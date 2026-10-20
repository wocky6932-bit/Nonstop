export type ComingSoonPreorderProduct = {
  id: string
  name: string
  description: string
  image: string
  images: string[]
  sizes: string[]
  is_preorder: boolean
  price: number
  currency: string
}

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
  preorderProducts: ComingSoonPreorderProduct[]
}

const DEFAULT_PREORDER_PRODUCT = {
  id: 'preorder-product',
  name: 'Produit',
  description: 'Description du produit',
  image: '/precommande.jpeg',
  sizes: ['S', 'M', 'L', 'XL'],
  is_preorder: true,
  price: 0,
  currency: 'XOF'
}

export function normalizeComingSoonProduct(product: any = {}): ComingSoonPreorderProduct {
  const safePrice = Number(product.price)
  const price = Number.isFinite(safePrice) ? safePrice : 0
  const currency = typeof product.currency === 'string' && product.currency.trim() ? product.currency.toUpperCase() : 'XOF'

  const rawImages = Array.isArray(product.images) ? product.images.filter(Boolean) : []
  const fallbackImage = typeof product.image === 'string' && product.image.trim() ? product.image : rawImages[0] || '/precommande.jpeg'
  const images = rawImages.length > 0 ? rawImages : (fallbackImage ? [fallbackImage] : ['/precommande.jpeg'])

  return {
    id: product.id || DEFAULT_PREORDER_PRODUCT.id,
    name: product.name || DEFAULT_PREORDER_PRODUCT.name,
    description: product.description || DEFAULT_PREORDER_PRODUCT.description,
    image: images[0] || '/precommande.jpeg',
    images,
    sizes: Array.isArray(product.sizes) ? product.sizes : DEFAULT_PREORDER_PRODUCT.sizes,
    is_preorder: product.is_preorder !== false,
    price,
    currency
  }
}

export function normalizeComingSoonConfig(config: any = {}): ComingSoonConfig {
  const safeConfig = config && typeof config === 'object' ? config : {}
  const defaultProducts = [
    normalizeComingSoonProduct({
      id: 'tee-01-white',
      name: 'TEE 01 — WHITE',
      description: 'T-shirt blanc avec logo bleu et noir',
      image: '/tee-01-white.jpeg',
      images: ['/tee-01-white.jpeg'],
      is_preorder: true,
      sizes: ['S', 'M', 'L', 'XL'],
      price: 0,
      currency: 'XOF'
    }),
    normalizeComingSoonProduct({
      id: 'tee-02-black',
      name: 'TEE 02 — BLACK',
      description: 'T-shirt noir avec logo bleu et blanc',
      image: '/tee-02-black.jpeg',
      images: ['/tee-02-black.jpeg'],
      is_preorder: true,
      sizes: ['S', 'M', 'L', 'XL'],
      price: 0,
      currency: 'XOF'
    })
  ]

  const preorderProducts = Array.isArray(safeConfig.preorderProducts) && safeConfig.preorderProducts.length > 0
    ? safeConfig.preorderProducts.map(normalizeComingSoonProduct)
    : defaultProducts

  return {
    enabled: safeConfig.enabled !== false,
    title: safeConfig.title || 'COMING SOON',
    subtitle: safeConfig.subtitle || 'TEE 01 / 02 — NOUVELLE COLLECTION',
    description: safeConfig.description || 'Deux coloris. Une seule identité. La prochaine collection NONSTOP arrive bientôt.',
    ctaText: safeConfig.ctaText || 'PRÉCOMMANDER',
    image: safeConfig.image || '/coming-soon-cover.jpeg',
    heroLabel: safeConfig.heroLabel || 'NONSTOP',
    heroSecondary: safeConfig.heroSecondary || 'TEE 01 / 02',
    visibleOnHome: safeConfig.visibleOnHome !== false,
    whatsappNumber: safeConfig.whatsappNumber || '',
    launchDate: safeConfig.launchDate || '',
    preorderProducts
  }
}

export function formatPreorderPrice(price: number | string | undefined, currency?: string): string {
  const numericPrice = Number(price)

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return 'Prix à confirmer'
  }

  const safeCurrency = (currency || 'XOF').toUpperCase()

  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: 0
    }).format(numericPrice)
  } catch {
    return `${numericPrice.toLocaleString('fr-FR')} ${safeCurrency}`
  }
}
