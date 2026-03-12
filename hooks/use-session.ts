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
    const [session, setSession] = useState<SessionData | null>(null)
    const [loading, setLoading] = useState(true)

    const checkSession = async () => {
        try {
            const response = await fetch('/api/session')
            const result = await response.json()
            
            if (result.success && result.session) {
                setSession(result.session)
            } else {
                setSession(null)
            }
        } catch (error) {
            console.warn('Failed to check session:', error)
            setSession(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkSession()

        // Désactivé l'intervalle pour éviter les appels en boucle
        // const interval = setInterval(checkSession, 5000)
        // return () => clearInterval(interval)
    }, [])

    const logout = async () => {
        try {
            await fetch('/api/session', {
                method: 'DELETE',
            })
            setSession(null)
            window.location.href = '/auth/login'
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return { session, loading, logout, refresh: checkSession }
}
