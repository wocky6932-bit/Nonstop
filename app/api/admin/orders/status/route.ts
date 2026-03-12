import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/mysql'

export async function PUT(request: NextRequest) {
    try {
        const { orderId, status } = await request.json()

        if (!orderId || !status) {
            return NextResponse.json(
                { error: 'Order ID and status are required' },
                { status: 400 }
            )
        }

        const result = await updateOrderStatus(orderId, status)

        if (!result.success) {
            throw new Error(result.error)
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('PUT order status error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to update order status' },
            { status: 500 }
        )
    }
}
