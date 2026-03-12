import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth-server'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Authentification 100% MySQL
    const result = await authenticateUser(email, password)
    
    if (result.success && result.user) {
      // Créer la session serveur
      await createSession(result.user)
      
      return NextResponse.json({ 
        success: true, 
        user: {
          id: result.user.id,
          email: result.user.email,
          nom: result.user.nom,
          telephone: result.user.telephone,
          adresse: result.user.adresse,
          ville: result.user.ville
        },
        isAdmin: result.isAdmin
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur serveur' 
    }, { status: 500 })
  }
}
