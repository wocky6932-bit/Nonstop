import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '@/lib/mysql'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get specific product
      const product = await getProductById(id)

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(product)
    } else {
      // Get all products
      const products = await getProducts()
      return NextResponse.json(products || [])
    }
  } catch (error: any) {
    console.error('GET products error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, price, currency, image, images, description, category, sizes, is_preorder } = body

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    const result = await createProduct({
      name,
      price: parseFloat(price),
      currency: currency || 'XOF',
      image: image || '',
      images: images || [],
      description: description || '',
      category: category || 'general',
      sizes: sizes || [],
      is_preorder: is_preorder || false
    })

    if (!result.success) {
      throw new Error(result.error)
    }

    return NextResponse.json(result.product, { status: 201 })
  } catch (error: any) {
    console.error('POST products error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const result = await updateProduct(id, body)

    if (!result.success) {
      throw new Error(result.error)
    }

    const updatedProduct = await getProductById(id)
    return NextResponse.json(updatedProduct)
  } catch (error: any) {
    console.error('PUT products error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const result = await deleteProduct(id)

    if (!result.success) {
      throw new Error(result.error)
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error: any) {
    console.error('DELETE products error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}