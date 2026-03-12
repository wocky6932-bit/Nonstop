import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getProductById } from '@/lib/mysql'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const limit = searchParams.get('limit')
        const category = searchParams.get('category')

        if (id) {
            const product = await getProductById(id)
            if (!product) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 })
            }
            return NextResponse.json(product)
        }

        let products = await getProducts() as any[]

        // Pour la boutique publique, on ne montre généralement que les produits non épuisés
        // ou on laisse le client filtrer si on veut montrer "Épuisé"

        if (category) {
            products = products.filter(p => p.category === category)
        }

        if (limit) {
            products = products.slice(0, parseInt(limit))
        }

        return NextResponse.json(products || [])
    } catch (error: any) {
        console.error('GET products error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}
