import { NextRequest } from 'next/server'

const SESSION_COOKIE_NAME = 'nonstop-session'

export interface SessionData {
    id: string
    email: string
    nom?: string
    telephone?: string
    adresse?: string
    ville?: string
    isAdmin: boolean
}

export function getMiddlewareSession(request: NextRequest): SessionData | null {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)

    if (!sessionCookie?.value) {
        return null
    }

    try {
        const data = JSON.parse(decodeURIComponent(sessionCookie.value))
        return data as SessionData
    } catch (error) {
        console.warn('Failed to parse session cookie in middleware:', error)
        return null
    }
}
