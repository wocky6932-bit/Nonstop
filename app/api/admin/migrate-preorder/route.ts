import { NextResponse } from 'next/server'
import { query } from '@/lib/mysql'

export async function GET() {
  try {
    // Ajouter la colonne is_preorder
    await query(`
      ALTER TABLE products 
      ADD COLUMN is_preorder TINYINT(1) NOT NULL DEFAULT 0
    `)
    return NextResponse.json({ success: true, message: 'Colonne is_preorder ajoutée avec succès' })
  } catch (error: any) {
    // Si la colonne existe déjà, pas d'erreur
    if (error.code === 'ER_DUP_FIELDNAME') {
      return NextResponse.json({ success: true, message: 'Colonne déjà existante' })
    }
    console.error('Migration error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
