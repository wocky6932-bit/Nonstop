"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from "@/hooks/use-session"
import Link from "next/link"
import { ArrowLeft, Eye, RefreshCw, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { UpdateOrderStatusButton } from "@/components/admin/update-order-status-button"

interface Order {
  id: string
  client_name: string
  client_email: string
  client_phone: string
  total: number
  status: string
  created_at: string
  item_count: number
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!sessionLoading) {
      if (!session || !session.isAdmin) {
        router.push("/auth/login")
      } else {
        fetchOrders()
      }
    }
  }, [session, sessionLoading, router])

  if (sessionLoading || (loading && session)) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin border-b-2 border-black mx-auto" />
          <p className="mt-4 text-gray-600">Chargement des commandes...</p>
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
          <Button onClick={fetchOrders} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl tracking-wide mb-8">Gestion des Commandes</h1>

          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Articles
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders?.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono">
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.client_name || 'Anonyme'}</div>
                        <div className="text-xs text-gray-500">{order.client_phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {order.total.toLocaleString()} XOF
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.item_count} article{order.item_count > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="outline" size="sm" title="Voir les détails">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="default" 
                            size="sm" 
                            title="Envoyer le reçu sur WhatsApp"
                            className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-1 min-w-max"
                            onClick={() => {
                              // Formater le numéro de téléphone (enlever espaces et ajouter l'indicatif si manquant)
                              let phone = order.client_phone.replace(/\s+/g, '')
                              if (!phone.startsWith('+')) {
                                // Assuming Senegal by default if no code is provided, but safe to just leave it as is if it's 9 digits
                                if (phone.length === 9) phone = '221' + phone
                              } else {
                                phone = phone.substring(1) // enlever le + pour l'API WhatsApp
                              }
                              
                              const message = `Bonjour *${order.client_name || 'Client'}*,\n\nNous avons bien reçu votre commande *#${order.id.slice(-6).toUpperCase()}* d'un montant de *${order.total.toLocaleString()} CFA* sur la boutique Nonstop.\n\nNous préparons votre livraison !\nMerci de votre confiance. 🛒`
                              
                              window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank')
                            }}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </Button>
                          <UpdateOrderStatusButton
                            orderId={order.id}
                            currentStatus={order.status}
                            onStatusUpdated={fetchOrders}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {orders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucune commande trouvée.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const labels = {
    pending: "En attente",
    processing: "En cours",
    delivered: "Livrée",
    cancelled: "Annulée",
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}

