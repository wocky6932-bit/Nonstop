import { query } from './mysql'

// Schema is fixed in MySQL now, no need for dynamic detection
export interface ProductData {
  name: string
  price: number
  currency: string
  image: string
  sold_out: boolean
  images?: string[]
  category?: string
  description?: string
}

export async function getAvailableColumns(): Promise<Set<string>> {
  // In MySQL, we know our schema
  return new Set(['name', 'price', 'currency', 'image', 'sold_out', 'images', 'category', 'description'])
}

export async function prepareProductData(data: ProductData): Promise<ProductData> {
  const availableColumns = await getAvailableColumns()
  const result: ProductData = {
    name: data.name,
    price: data.price,
    currency: data.currency,
    image: data.image,
    sold_out: data.sold_out,
  }

  // Ajouter les colonnes disponibles seulement
  if (availableColumns.has('images') && data.images && data.images.length > 0) {
    result.images = data.images
  }

  if (availableColumns.has('category') && data.category && data.category.trim() !== '') {
    result.category = data.category
  }

  if (availableColumns.has('description') && data.description) {
    result.description = data.description
  }

  return result
}

export async function prepareUpdateData(data: Partial<ProductData>): Promise<Partial<ProductData>> {
  const availableColumns = await getAvailableColumns()
  const result: Partial<ProductData> = {}

  // Ajouter seulement les champs de base qui sont définis
  if (data.name !== undefined) result.name = data.name
  if (data.price !== undefined) result.price = data.price
  if (data.currency !== undefined) result.currency = data.currency
  if (data.image !== undefined) result.image = data.image
  if (data.sold_out !== undefined) result.sold_out = data.sold_out

  // Ajouter les colonnes avancées seulement si elles existent et sont définies
  if (availableColumns.has('images') && data.images !== undefined) {
    result.images = data.images
  }

  if (availableColumns.has('category') && data.category !== undefined && data.category.trim() !== '') {
    result.category = data.category
  }

  if (availableColumns.has('description') && data.description !== undefined) {
    result.description = data.description
  }

  return result
}