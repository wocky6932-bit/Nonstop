"use client"

import { useRouter } from 'next/navigation'
import { useSession } from "@/hooks/use-session"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, ShoppingBag, Users, LogOut, Home } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AdminPage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()

  const handleSignOut = async () => {
    try {
      await fetch('/api/session', { method: 'DELETE' })
      window.location.href = "/auth/login"
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    if (!sessionLoading && (!session || !session.isAdmin)) {
      router.push("/auth/login")
    }
  }, [session, sessionLoading, router])

  if (sessionLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  if (!session || !session.isAdmin) {
    return null // Will redirect via useEffect
  }


  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-wide">NONSTOP ADMIN</h1>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl mb-8 tracking-wide">Tableau de bord</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/admin/products">
              <div className="bg-white p-8 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-black text-white rounded-lg">
                    <Package className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium">Produits</h3>
                </div>
                <p className="text-gray-600">
                  Gérer les produits: ajouter, modifier ou supprimer
                </p>
              </div>
            </Link>

            <Link href="/admin/orders">
              <div className="bg-white p-8 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-black text-white rounded-lg">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium">Commandes</h3>
                </div>
                <p className="text-gray-600">
                  Voir et gérer toutes les commandes clients
                </p>
              </div>
            </Link>

            <Link href="/admin/clients">
              <div className="bg-white p-8 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-black text-white rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium">Clients</h3>
                </div>
                <p className="text-gray-600">
                  Voir et gérer tous les clients inscrits
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
