import { NextResponse } from 'next/server'
import { query } from '@/lib/mysql'

export async function GET() {
  try {
    await query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS variant_options JSON
    `)

    await query(`
      ALTER TABLE order_items
      ADD COLUMN IF NOT EXISTS selected_variant VARCHAR(100)
    `)

    return NextResponse.json({
      success: true,
      message: 'Colonnes variant_options et selected_variant ajoutées avec succès',
    })
  } catch (error: any) {
    console.error('Migration variants error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
