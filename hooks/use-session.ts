'use client'

import { useState, useEffect } from 'react'

export interface SessionData {
    id: string
    email: string
    nom?: string
    telephone?: string
    adresse?: string
    ville?: string
    isAdmin: boolean
}

export function useSession() {
    const [session, setSession] = useState<SessionData | null>(() => {
        if (typeof window !== 'undefined') {
            try {
                const cached = localStorage.getItem('nonstop-admin-session')
                if (cached) {
                    return JSON.parse(cached)
                }
            } catch {
                // Ignore parsing error
            }
        }
        return null
    })
    const [loading, setLoading] = useState(true)

    const checkSession = async () => {
        try {
            const response = await fetch('/api/session')
            if (response.ok) {
                const result = await response.json()
                if (result.success && result.session) {
                    setSession(result.session)
                    try {
                        localStorage.setItem('nonstop-admin-session', JSON.stringify(result.session))
                    } catch {}
                    return
                }
            }
            
            // Si la requête échoue explicitement avec 401 Non authentifié
            if (response.status === 401) {
                setSession(null)
                try {
                    localStorage.removeItem('nonstop-admin-session')
                } catch {}
            }
        } catch (error) {
            console.warn('Failed to check session:', error)
            // En cas d'erreur réseau ponctuelle, garder la session existante pour ne pas déconnecter
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkSession()
    }, [])

    const logout = async () => {
        try {
            await fetch('/api/session', {
                method: 'DELETE',
            })
            setSession(null)
            try {
                localStorage.removeItem('nonstop-admin-session')
            } catch {}
            window.location.href = '/auth/login'
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return { session, loading, logout, refresh: checkSession }
}
