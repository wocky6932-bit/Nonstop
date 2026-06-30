import { NextRequest, NextResponse } from 'next/server'
import { updateLookbook, deleteLookbook } from '@/lib/mysql'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    const result = await updateLookbook(id, body)
    if (!result.success) {
      throw new Error(result.error)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API PUT lookbook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const result = await deleteLookbook(id)
    if (!result.success) {
      throw new Error(result.error)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API DELETE lookbook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
