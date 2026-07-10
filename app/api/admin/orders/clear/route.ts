import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'
import { getSession } from '@/lib/session'

export async function DELETE(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin
    const session = await getSession()
    if (!session || !session.isAdmin) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    // Supprimer d'abord les articles de commande (clé étrangère)
    await query('DELETE FROM order_items')
    // Supprimer toutes les commandes
    await query('DELETE FROM orders')

    return NextResponse.json({ success: true, message: 'Toutes les commandes ont été supprimées.' })
  } catch (error: any) {
    console.error('[API Admin Orders DELETE] Error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}
