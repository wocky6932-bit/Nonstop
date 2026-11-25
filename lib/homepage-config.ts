export type EditorialCollection = {
  id: string
  enabled: boolean
  title: string
  bannerImage: string
  mediaType?: 'image' | 'video'
  videoUrl?: string
  buttonText: string
  enableMannequinToggle: boolean
  selectedProductIds: string[]
}

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
    mediaType?: 'image' | 'video'
    videoUrl?: string
  }

  // 3. Section Nos Produits
  productsSection: {
    enabled: boolean
    title: string
    subtitle: string
    priorityProductIds: string[]
  }

  // 4. Section Collection Éditoriale unique (legacy fallback)
  collectionSection: EditorialCollection

  // 5. Multiples Collections Éditoriales style Torom Paris
  editorialCollections?: EditorialCollection[]

  // 6. Section Lookbook
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
    id: 'collection-tartan',
    enabled: true,
    title: 'TARTAN',
    bannerImage: '/images/collection-essentiels-banner.jpg',
    buttonText: 'DÉCOUVRIR',
    enableMannequinToggle: true,
    selectedProductIds: ['1793314904004', '1792639100833', '1792616909279']
  },
  editorialCollections: [
    {
      id: 'collection-tartan',
      enabled: true,
      title: 'TARTAN',
      bannerImage: '/images/collection-essentiels-banner.jpg',
      buttonText: 'DÉCOUVRIR',
      enableMannequinToggle: true,
      selectedProductIds: ['1793314904004', '1792639100833', '1792616909279']
    }
  ],
  lookbookSection: {
    enabled: true,
    title: 'ACHETER LE LOOK'
  }
}

export function normalizeHomepageConfig(config: any): SiteHomepageConfig {
  if (!config || typeof config !== 'object') {
    return DEFAULT_HOMEPAGE_CONFIG
  }

  // Normalisation de collectionSection legacy
  const legacyCollection: EditorialCollection = {
    id: config.collectionSection?.id || 'collection-default',
    enabled: config.collectionSection?.enabled !== false,
    title: config.collectionSection?.title || DEFAULT_HOMEPAGE_CONFIG.collectionSection.title,
    bannerImage: config.collectionSection?.bannerImage || DEFAULT_HOMEPAGE_CONFIG.collectionSection.bannerImage,
    mediaType: config.collectionSection?.mediaType || (config.collectionSection?.bannerImage?.includes('video') ? 'video' : 'image'),
    videoUrl: config.collectionSection?.videoUrl || '',
    buttonText: config.collectionSection?.buttonText || DEFAULT_HOMEPAGE_CONFIG.collectionSection.buttonText,
    enableMannequinToggle: config.collectionSection?.enableMannequinToggle !== false,
    selectedProductIds: Array.isArray(config.collectionSection?.selectedProductIds) && config.collectionSection.selectedProductIds.length > 0
      ? config.collectionSection.selectedProductIds
      : DEFAULT_HOMEPAGE_CONFIG.collectionSection.selectedProductIds
  }

  // Multi-collections : si editorialCollections est fourni, on le normalise, sinon on initialise avec legacy
  let editorialCollections: EditorialCollection[] = []
  if (Array.isArray(config.editorialCollections) && config.editorialCollections.length > 0) {
    editorialCollections = config.editorialCollections.map((col: any, idx: number) => ({
      id: col.id || `collection-${idx}-${Date.now()}`,
      enabled: col.enabled !== false,
      title: col.title || 'COLLECTION',
      bannerImage: col.bannerImage || '/images/collection-essentiels-banner.jpg',
      mediaType: col.mediaType || (col.bannerImage?.includes('video') || col.bannerImage?.endsWith('.mp4') ? 'video' : 'image'),
      videoUrl: col.videoUrl || '',
      buttonText: col.buttonText || 'DÉCOUVRIR',
      enableMannequinToggle: col.enableMannequinToggle !== false,
      selectedProductIds: Array.isArray(col.selectedProductIds) ? col.selectedProductIds : []
    }))
  } else {
    editorialCollections = [legacyCollection]
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
      image: config.hero?.image || DEFAULT_HOMEPAGE_CONFIG.hero.image,
      mediaType: config.hero?.mediaType || (config.hero?.image?.includes('video') || config.hero?.image?.endsWith('.mp4') ? 'video' : 'image'),
      videoUrl: config.hero?.videoUrl || ''
    },
    productsSection: {
      enabled: config.productsSection?.enabled !== false,
      title: config.productsSection?.title || DEFAULT_HOMEPAGE_CONFIG.productsSection.title,
      subtitle: config.productsSection?.subtitle || DEFAULT_HOMEPAGE_CONFIG.productsSection.subtitle,
      priorityProductIds: Array.isArray(config.productsSection?.priorityProductIds)
        ? config.productsSection.priorityProductIds
        : DEFAULT_HOMEPAGE_CONFIG.productsSection.priorityProductIds
    },
    collectionSection: legacyCollection,
    editorialCollections,
    lookbookSection: {
      enabled: config.lookbookSection?.enabled !== false,
      title: config.lookbookSection?.title || DEFAULT_HOMEPAGE_CONFIG.lookbookSection.title
    }
  }
}
