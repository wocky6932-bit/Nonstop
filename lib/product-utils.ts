import { Product } from './cart-context'

/**
 * Normalise un produit pour assurer la cohérence des données d'image
 * avant l'ajout au panier
 */
export function normalizeProductForCart(product: any): Product {
  // Assurer que nous utilisons la bonne image
  // Priorité: première image du tableau images, puis product.image, puis placeholder
  let productImage = "/placeholder.svg"

  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    productImage = product.images[0]
  } else if (product.image) {
    productImage = product.image
  }

  // Créer un objet produit conforme à l'interface Product
  const normalizedProduct: Product = {
    id: product.id,
    name: product.name,
    price: product.price,
    currency: product.currency || 'XOF',
    image: productImage,
    images: product.images || [],
    sold_out: product.sold_out || false,
    sizes: product.sizes && Array.isArray(product.sizes) ? product.sizes : [],
    selectedSize: product.selectedSize,
    is_preorder: product.is_preorder === 1 || product.is_preorder === true
  }

  return normalizedProduct
}

/**
 * Version améliorée de la fonction ci-dessus qui gère aussi les différents formats de données
 */
export function normalizeProductData(product: any): Product {
  // Gérer différents formats de données image
  let productImage = "/placeholder.svg"
  let productImages: string[] = []

  // Extraire les images du tableau images (peut être une chaîne JSON venant de MySQL, simple ou double-encodée)
  let rawImages = product.images
  if (typeof rawImages === 'string' && rawImages.trim() !== '') {
    // Recursively parse until we get a real array or give up
    let current: any = rawImages
    for (let i = 0; i < 3; i++) {
      if (Array.isArray(current)) break
      if (typeof current !== 'string') break
      try { current = JSON.parse(current) } catch { break }
    }
    rawImages = Array.isArray(current) ? current : []
  }

  // Priorité 1: tableau images avec au moins une image
  if (Array.isArray(rawImages) && rawImages.length > 0) {
    productImages = rawImages
    productImage = rawImages[0]
  }
  // Priorité 2: champ image direct
  else if (product.image) {
    productImage = product.image
    productImages = [product.image]
  }
  // Priorité 3: image_url (format alternatif)
  else if (product.image_url) {
    productImage = product.image_url
    productImages = [product.image_url]
  }
  // Priorité 4: thumbnail
  else if (product.thumbnail) {
    productImage = product.thumbnail
    productImages = [product.thumbnail]
  }

  // Gérer la propriété sizes
  let productSizes: string[] = []
  let rawSizes = product.sizes
  if (typeof rawSizes === 'string' && rawSizes.trim() !== '') {
    // Parse the JSON string
    let currentSize: any = rawSizes
    for (let i = 0; i < 3; i++) {
      if (Array.isArray(currentSize)) break
      if (typeof currentSize !== 'string') break
      try { currentSize = JSON.parse(currentSize) } catch { break }
    }
    productSizes = Array.isArray(currentSize) ? currentSize : []
  } else if (Array.isArray(rawSizes)) {
    productSizes = rawSizes
  }

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    currency: product.currency || 'XOF',
    image: productImage,
    images: productImages,
    sizes: productSizes,
    sold_out: product.sold_out === 1 || product.sold_out === true,
    is_preorder: product.is_preorder === 1 || product.is_preorder === true
  }
}