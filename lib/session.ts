import { cookies } from 'next/headers'
import { User } from './auth-server'

// Clé de session sécurisée
const SESSION_COOKIE_NAME = 'nonstop-session'

export async function createSession(user: User) {
  const cookieStore = await cookies()

  // Créer un cookie de session sécurisé
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify({
    id: user.id,
    email: user.email,
    nom: user.nom,
    telephone: user.telephone,
    adresse: user.adresse,
    ville: user.ville,
    isAdmin: user.email.toLowerCase() === 'omarlae125678@icloud.com'
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/'
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function updateSession(updates: Partial<User>) {
  const currentSession = await getSession()
  if (!currentSession) {
    return null
  }

  const cookieStore = await cookies()
  const updatedSession = { ...currentSession, ...updates }

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(updatedSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })

  return updatedSession
}
