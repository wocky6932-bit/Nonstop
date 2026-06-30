import { NextRequest, NextResponse } from 'next/server'
import { getLookbooks, createLookbook } from '@/lib/mysql'

export async function GET() {
  try {
    const lookbooks = await getLookbooks()
    return NextResponse.json(lookbooks)
  } catch (error: any) {
    console.error('API GET lookbooks error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, image_url, pins } = body

    if (!title || !image_url) {
      return NextResponse.json({ error: 'Le titre et l\'image sont requis' }, { status: 400 })
    }

    const id = Date.now().toString()
    
    const result = await createLookbook({
      id,
      title,
      image_url,
      pins: pins || [],
      is_active: true
    })

    if (!result.success) {
      throw new Error(result.error)
    }

    return NextResponse.json({ success: true, id })
  } catch (error: any) {
    console.error('API POST lookbook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
