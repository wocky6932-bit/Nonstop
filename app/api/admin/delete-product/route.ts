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

    // Vérifier si le produit a des éléments de commande dans MySQL
    const orderItems = await query('SELECT id FROM order_items WHERE product_id = ? LIMIT 1', [productId]) as any[]

    if (orderItems && orderItems.length > 0) {
      // Le produit a des éléments dans des commandes, on ne peut pas le supprimer
      // On le marque comme sold_out à la place
      console.log('🛑 Product has order items, marking as sold_out')
      await updateProduct(productId, { sold_out: true })

      return NextResponse.json({
        success: true,
        action: 'marked_sold_out',
        message: 'Produit marqué comme indisponible (présence dans des commandes)',
        details: {
          orderItemsCount: orderItems.length,
          reason: 'Product has associated order items'
        }
      })
    }

    // Aucun élément de commande trouvé, on peut supprimer le produit
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