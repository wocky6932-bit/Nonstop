import { NextRequest, NextResponse } from 'next/server'
import { getClients } from '@/lib/mysql'

export async function GET(request: NextRequest) {
    try {
        const clients = await getClients()
        return NextResponse.json(clients || [])
    } catch (error: any) {
        console.error('GET clients error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch clients' },
            { status: 500 }
        )
    }
}
