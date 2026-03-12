import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders, getOrderById } from '@/lib/mysql'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (id) {
            const order = await getOrderById(id)
            if (!order) {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 })
            }
            return NextResponse.json(order)
        }

        const orders = await getAllOrders()
        return NextResponse.json(orders || [])
    } catch (error: any) {
        console.error('GET orders error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}
