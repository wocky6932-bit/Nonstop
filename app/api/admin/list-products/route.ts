import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/mysql'

export async function GET(request: NextRequest) {
  try {
    // Récupérer tous les produits depuis MySQL
    const products = await getProducts()

    return NextResponse.json({
      message: 'Products fetched successfully',
      products: products || []
    })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}