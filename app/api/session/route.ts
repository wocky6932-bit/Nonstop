import { NextRequest, NextResponse } from 'next/server'
import { getSession, clearSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        error: 'Non authentifié' 
      }, { status: 401 })
    }
    
    return NextResponse.json({ 
      success: true, 
      session 
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur serveur' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await clearSession()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Déconnexion réussie' 
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur lors de la déconnexion' 
    }, { status: 500 })
  }
}
