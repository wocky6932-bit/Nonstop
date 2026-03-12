"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from "@/hooks/use-session"
import Link from "next/link"
import { ArrowLeft, Phone, Mail, User, FileText, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Client {
  id: string
  nom: string
  numero: string
  telephone: string
  email: string
  created_at: string
}

export default function AdminClientsPage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data || [])
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!sessionLoading) {
      if (!session || !session.isAdmin) {
        router.push("/auth/login")
      } else {
        fetchClients()
      }
    }
  }, [session, sessionLoading, router])

  const handlePhoneClick = (telephone: string) => {
    window.open(`tel:${telephone}`, '_self')
  }

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_self')
  }

  if (sessionLoading || (loading && session)) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin border-b-2 border-black mx-auto" />
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl tracking-wide mb-8">Gestion des Clients</h1>

          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Téléphone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Numéro Référence
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Inscription
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {client.nom || 'Non renseigné'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {client.email || 'Non renseigné'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {client.telephone || 'Non renseigné'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {client.numero || 'Non renseigné'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(client.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {client.telephone && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePhoneClick(client.telephone)}
                              title={`Appeler ${client.telephone}`}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          )}
                          {client.email && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEmailClick(client.email)}
                              title={`Email ${client.email}`}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {clients.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client inscrit</h3>
                  <p className="text-gray-600">
                    Les clients apparaîtront ici dès qu'ils s'inscrivent sur le site.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}