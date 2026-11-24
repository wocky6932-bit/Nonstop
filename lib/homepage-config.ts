export type SiteHomepageConfig = {
  // 1. Ordre et activation des sections
  sectionsOrder: string[] // ex: ['drop', 'products', 'lookbook', 'collection']
  
  // 2. Section Hero (haut de page)
  hero: {
    enabled: boolean
    title?: string
    subtitle?: string
    buttonText: string
    buttonLink: string
    image: string
  }

  // 3. Section Nos Produits
  productsSection: {
    enabled: boolean
    title: string
    subtitle: string
    priorityProductIds: string[]
  }

  // 4. Section Collection Éditoriale (style Torom Paris avec bouton Mannequin)
  collectionSection: {
    enabled: boolean
    title: string
    bannerImage: string
    buttonText: string
    enableMannequinToggle: boolean
    selectedProductIds: string[] // IDs des produits à afficher dans cette collection
  }

  // 5. Section Lookbook
  lookbookSection: {
    enabled: boolean
    title: string
  }
}

export const DEFAULT_HOMEPAGE_CONFIG: SiteHomepageConfig = {
  sectionsOrder: ['drop', 'products', 'lookbook', 'collection'],
  hero: {
    enabled: true,
    title: '',
    subtitle: '',
    buttonText: 'DÉCOUVRIR LA COLLECTION',
    buttonLink: '/shop',
    image: '/images/ChatGPT_Image_23_aout_2026_04_21_30.png'
  },
  productsSection: {
    enabled: true,
    title: 'NOS PRODUITS',
    subtitle: 'Découvrez tous nos articles',
    priorityProductIds: [
      '1792120820288',
      '1791674451992',
      '1786383165433',
      '1785721613619',
      '1782610673338'
    ]
  },
  collectionSection: {
    enabled: true,
    title: 'TARTAN',
    bannerImage: '/images/collection-essentiels-banner.jpg',
    buttonText: 'DÉCOUVRIR',
    enableMannequinToggle: true,
    selectedProductIds: ['1793314904004', '1792639100833', '1792616909279']
  },
  lookbookSection: {
    enabled: true,
    title: 'ACHETER LE LOOK'
  }
}

export function normalizeHomepageConfig(config: any): SiteHomepageConfig {
  if (!config || typeof config !== 'object') {
    return DEFAULT_HOMEPAGE_CONFIG
  }

  return {
    sectionsOrder: Array.isArray(config.sectionsOrder) && config.sectionsOrder.length > 0
      ? config.sectionsOrder
      : DEFAULT_HOMEPAGE_CONFIG.sectionsOrder,
    hero: {
      enabled: config.hero?.enabled !== false,
      title: config.hero?.title || '',
      subtitle: config.hero?.subtitle || '',
      buttonText: config.hero?.buttonText || DEFAULT_HOMEPAGE_CONFIG.hero.buttonText,
      buttonLink: config.hero?.buttonLink || DEFAULT_HOMEPAGE_CONFIG.hero.buttonLink,
      image: config.hero?.image || DEFAULT_HOMEPAGE_CONFIG.hero.image
    },
    productsSection: {
      enabled: config.productsSection?.enabled !== false,
      title: config.productsSection?.title || DEFAULT_HOMEPAGE_CONFIG.productsSection.title,
      subtitle: config.productsSection?.subtitle || DEFAULT_HOMEPAGE_CONFIG.productsSection.subtitle,
      priorityProductIds: Array.isArray(config.productsSection?.priorityProductIds)
        ? config.productsSection.priorityProductIds
        : DEFAULT_HOMEPAGE_CONFIG.productsSection.priorityProductIds
    },
    collectionSection: {
      enabled: config.collectionSection?.enabled !== false,
      title: config.collectionSection?.title || DEFAULT_HOMEPAGE_CONFIG.collectionSection.title,
      bannerImage: config.collectionSection?.bannerImage || DEFAULT_HOMEPAGE_CONFIG.collectionSection.bannerImage,
      buttonText: config.collectionSection?.buttonText || DEFAULT_HOMEPAGE_CONFIG.collectionSection.buttonText,
      enableMannequinToggle: config.collectionSection?.enableMannequinToggle !== false,
      selectedProductIds: Array.isArray(config.collectionSection?.selectedProductIds) && config.collectionSection.selectedProductIds.length > 0
        ? config.collectionSection.selectedProductIds
        : DEFAULT_HOMEPAGE_CONFIG.collectionSection.selectedProductIds
    },
    lookbookSection: {
      enabled: config.lookbookSection?.enabled !== false,
      title: config.lookbookSection?.title || DEFAULT_HOMEPAGE_CONFIG.lookbookSection.title
    }
  }
}
