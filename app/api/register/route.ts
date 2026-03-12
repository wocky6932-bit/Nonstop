import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth-server'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password, nom, telephone, adresse, ville } = await request.json()
    
    // Création utilisateur via MySQL
    const result = await createUser({
      email,
      password,
      nom,
      telephone,
      adresse,
      ville
    })
    
    if (result.success) {
      // Récupérer l'utilisateur créé pour la session
      const userData = {
        id: result.userId,
        email,
        password, // Ajouter le mot de passe pour la session
        nom,
        telephone,
        adresse,
        ville,
        created_at: new Date().toISOString()
      }
      
      // Créer la session automatiquement après inscription
      await createSession(userData)
      
      return NextResponse.json({ 
        success: true, 
        user: {
          id: userData.id,
          email: userData.email,
          nom: userData.nom,
          telephone: userData.telephone,
          adresse: userData.adresse,
          ville: userData.ville
        },
        isAdmin: email === 'adminnonstop@gmail.com'
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Register API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur serveur' 
    }, { status: 500 })
  }
}
