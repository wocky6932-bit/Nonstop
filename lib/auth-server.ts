// Système d'authentification 100% serveur (MySQL)
import { authenticateUser as mysqlAuth, createUser as mysqlCreateUser } from './mysql'

export interface User {
  id: string
  email: string
  password: string
  nom?: string
  telephone?: string
  adresse?: string
  ville?: string
  created_at: string
}

export async function authenticateUser(email: string, password: string) {
  try {
    // Authentification via MySQL uniquement
    const result = await mysqlAuth(email, password)

    if (result.success) {
      return {
        success: true,
        user: result.user,
        isAdmin: email.toLowerCase() === 'omarlae125678@icloud.com'
      }
    } else {
      return {
        success: false,
        error: result.error
      }
    }
  } catch (error) {
    console.error('Auth error:', error)
    return {
      success: false,
      error: 'Erreur serveur'
    }
  }
}

export async function createUser(userData: {
  email: string
  password: string
  nom?: string
  telephone?: string
  adresse?: string
  ville?: string
}) {
  try {
    // Création via MySQL uniquement
    const result = await mysqlCreateUser(userData)
    return result
  } catch (error) {
    console.error('Create user error:', error)
    return {
      success: false,
      error: 'Erreur lors de la création du compte'
    }
  }
}
