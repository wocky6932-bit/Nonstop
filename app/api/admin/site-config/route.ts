import { NextRequest, NextResponse } from 'next/server'
import { getSiteConfig, setSiteConfig } from '@/lib/mysql'

const DEFAULT_COMING_SOON = {
  enabled: true,
  title: 'COMING SOON',
  subtitle: 'TEE 01 / 02 — NOUVELLE COLLECTION',
  description: 'Deux coloris. Une seule identité. La prochaine collection NONSTOP arrive bientôt.',
  ctaText: 'PRÉCOMMANDER',
  image: '/coming-soon-cover.jpeg',
  heroLabel: 'NONSTOP',
  heroSecondary: 'TEE 01 / 02',
  visibleOnHome: true,
  whatsappNumber: '',
  launchDate: '',
  preorderProducts: [
    {
      id: 'tee-01-white',
      name: 'TEE 01 — WHITE',
      description: 'T-shirt blanc avec logo bleu et noir',
      image: '/tee-01-white.jpeg',
      images: ['/tee-01-white.jpeg'],
      is_preorder: true,
      sizes: ['S', 'M', 'L', 'XL'],
      price: 0,
      currency: 'XOF'
    },
    {
      id: 'tee-02-black',
      name: 'TEE 02 — BLACK',
      description: 'T-shirt noir avec logo bleu et blanc',
      image: '/tee-02-black.jpeg',
      images: ['/tee-02-black.jpeg'],
      is_preorder: true,
      sizes: ['S', 'M', 'L', 'XL'],
      price: 0,
      currency: 'XOF'
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key') || 'coming_soon'

    if (key === 'coming_soon') {
      const config = await getSiteConfig('coming_soon', DEFAULT_COMING_SOON)
      return NextResponse.json(config)
    }

    const config = await getSiteConfig(key, '')
    return NextResponse.json(config)
  } catch (error: any) {
    console.error('GET site config error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch site config' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const key = body.key || 'coming_soon'
    const value = body.value ?? {}

    await setSiteConfig(key, value)
    const saved = await getSiteConfig(key, value)

    return NextResponse.json(saved)
  } catch (error: any) {
    console.error('PUT site config error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save site config' },
      { status: 500 }
    )
  }
}
