import { NextRequest, NextResponse } from 'next/server'
import { getProductById, updateProduct, deleteProduct, query } from '@/lib/mysql'

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // On supprime directement le produit sans bloquer s'il a des commandes
    // car les commandes sauvegardent déjà le nom, le prix et l'image du produit.
    console.log('🗑️ Deleting product completely:', productId)
    const result = await deleteProduct(productId)

    if (!result.success) {
      throw new Error(result.error)
    }

    return NextResponse.json({
      success: true,
      action: 'deleted',
      message: 'Produit supprimé avec succès',
      details: {
        productId: productId,
        action: 'complete_deletion'
      }
    })

  } catch (error: any) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}