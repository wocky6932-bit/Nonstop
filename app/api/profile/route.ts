import { NextRequest, NextResponse } from 'next/server'
import { updateUser } from '@/lib/mysql'
import { getSession, createSession } from '@/lib/session'

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession()

        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Non authentifié'
            }, { status: 401 })
        }

        const updates = await request.json()
        const result = await updateUser(session.id, updates)

        if (result.success) {
            // Mettre à jour la session avec les nouvelles données
            const updatedUser = { ...session, ...updates }
            await createSession(updatedUser)

            return NextResponse.json({
                success: true,
                user: updatedUser
            })
        } else {
            return NextResponse.json({
                success: false,
                error: result.error
            }, { status: 400 })
        }
    } catch (error) {
        console.error('Update profile error:', error)
        return NextResponse.json({
            success: false,
            error: 'Erreur serveur'
        }, { status: 500 })
    }
}
