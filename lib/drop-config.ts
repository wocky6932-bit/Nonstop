export type DropProduct = {
  id: string
  name: string
  subtitle?: string
  description?: string
  image: string
  images?: string[]
  price: number
  originalPrice?: number
  currency: string
  sizes: string[]
  statusText?: string // ex: "Coming soon", "Sold out", "Précommander"
  badge?: string // ex: "DROP 1", "NEW"
  is_preorder?: boolean
}

export type DropConfig = {
  enabled: boolean
  tagline: string // ex: "DROP 1 · COMING SOON"
  title: string // ex: "DROP EXCLUSIF"
  targetDate: string // Format ISO string ou "YYYY-MM-DDTHH:mm:ss"
  dateLabel: string // ex: "08/12/26 19:00 GMT"
  categories: string[] // ex: ["ALL", "DROP 1"]
  activeCategory?: string
  products: DropProduct[]
  buttonText: string // ex: "PRÉCOMMANDER" ou "Bientôt disponible"
  allowPreorder: boolean // si vrai, l'utilisateur peut choisir sa taille et ajouter au panier
}

export const DEFAULT_DROP_CONFIG: DropConfig = {
  enabled: true,
  tagline: 'DROP 1 · COMING SOON',
  title: 'COLLECTION NONSTOP',
  targetDate: '2026-12-08T19:00:00Z',
  dateLabel: '08/12/26 19:00 GMT',
  categories: ['ALL', 'DROP 1'],
  activeCategory: 'ALL',
  buttonText: 'PRÉCOMMANDER',
  allowPreorder: true,
  products: [
    {
      id: 'drop-longsleeve-black',
      name: 'LONG SLEEVES NS NOIR',
      subtitle: 'Édition Collector • Noir Profond',
      description: 'Long sleeves signature NONSTOP en coton lourd avec motifs graphiques blancs sur les manches et logo poitrine brodé.',
      image: '/images/drop-longsleeve-black.jpg',
      images: ['/images/drop-longsleeve-black.jpg'],
      price: 11000,
      currency: 'CFA',
      sizes: ['S', 'M', 'L', 'XL'],
      statusText: 'Coming soon',
      badge: 'DROP 1',
      is_preorder: true
    },
    {
      id: 'drop-longsleeve-navy',
      name: 'LONG SLEEVES NS BLEU MARINE',
      subtitle: 'Édition Collector • Navy Blue',
      description: 'Long sleeves signature NONSTOP en coton lourd avec détails floraux cyan/bleu clair sur les manches et logo poitrine contrasté.',
      image: '/images/drop-longsleeve-navy.jpg',
      images: ['/images/drop-longsleeve-navy.jpg'],
      price: 11000,
      currency: 'CFA',
      sizes: ['S', 'M', 'L', 'XL'],
      statusText: 'Coming soon',
      badge: 'DROP 1',
      is_preorder: true
    }
  ]
}

export function normalizeDropConfig(config: any): DropConfig {
  if (!config || typeof config !== 'object') {
    return DEFAULT_DROP_CONFIG
  }

  const products = Array.isArray(config.products) && config.products.length > 0
    ? config.products.map((p: any, idx: number) => ({
        id: p.id || `drop-prod-${idx}`,
        name: p.name || 'Produit Drop',
        subtitle: p.subtitle || '',
        description: p.description || '',
        image: p.image || '/placeholder.jpg',
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || '/placeholder.jpg'],
        price: Number(p.price) || 11000,
        originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
        currency: p.currency || 'CFA',
        sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL'],
        statusText: p.statusText || 'Coming soon',
        badge: p.badge || 'DROP 1',
        is_preorder: p.is_preorder !== false
      }))
    : DEFAULT_DROP_CONFIG.products

  return {
    enabled: config.enabled !== false,
    tagline: config.tagline || DEFAULT_DROP_CONFIG.tagline,
    title: config.title || DEFAULT_DROP_CONFIG.title,
    targetDate: config.targetDate || DEFAULT_DROP_CONFIG.targetDate,
    dateLabel: config.dateLabel || DEFAULT_DROP_CONFIG.dateLabel,
    categories: Array.isArray(config.categories) && config.categories.length > 0 ? config.categories : DEFAULT_DROP_CONFIG.categories,
    activeCategory: config.activeCategory || 'ALL',
    buttonText: config.buttonText || DEFAULT_DROP_CONFIG.buttonText,
    allowPreorder: config.allowPreorder !== false,
    products
  }
}
