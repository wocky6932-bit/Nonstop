import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/mysql'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formData, cart, totalPrice } = body

    console.log('[API Orders] Received order request (MySQL):', { formData, cart, totalPrice })

    // Utiliser 'guest' si l'ID utilisateur est invalide
    const userId = (formData.userId && formData.userId !== '0') ? formData.userId : 'guest'

    // Sauvegarder dans MySQL
    const result = await createOrder({
      userId: userId,
      items: cart.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total: Math.round(totalPrice),
      notes: formData.notes
    })

    if (!result.success) {
      console.error('[API Orders] MySQL Error:', result.error)
      throw new Error(result.error)
    }

    console.log('[API Orders] Order saved to MySQL:', result.orderId)

    return NextResponse.json({
      success: true,
      orderId: result.orderId
    })

  } catch (error: any) {
    console.error('[API Orders] Server error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erreur serveur lors de la création de la commande'
    }, { status: 500 })
  }
}
