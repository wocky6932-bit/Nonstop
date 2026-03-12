"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from "@/hooks/use-session"
import Link from "next/link"
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { UpdateOrderStatusButton } from "@/components/admin/update-order-status-button"
import { getValidImageUrl } from "@/lib/image-utils"

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/orders?id=${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else if (response.status === 404) {
        router.push('/admin/orders')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!sessionLoading) {
      if (!session || !session.isAdmin) {
        router.push("/auth/login")
      } else if (!order) { // Ne fetch que si order est null
        fetchOrder()
      }
    }
  }, [session, sessionLoading, router, id, order])

  if (sessionLoading || (loading && session)) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin border-b-2 border-black mx-auto" />
          <p className="mt-4 text-gray-600">Chargement de la commande...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.isAdmin || !order) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux commandes
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl tracking-wide mb-2">
                Commande #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600">
                {new Date(order.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <UpdateOrderStatusButton
              orderId={order.id}
              currentStatus={order.status}
              onStatusUpdated={fetchOrder}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-medium mb-4">Informations Client</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-600">Nom</dt>
                  <dd className="font-medium">{order.client_name || 'Non renseigné'}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Téléphone</dt>
                  <dd className="font-medium">{order.client_phone || 'Non renseigné'}</dd>
                </div>
                {order.client_email && (
                  <div>
                    <dt className="text-gray-600">Email</dt>
                    <dd className="font-medium">{order.client_email}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-600">Adresse de livraison</dt>
                  <dd className="font-medium">
                    {order.client_address || 'Non renseignée'}
                    {order.client_city ? `, ${order.client_city}` : ''}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-medium mb-4">Résumé de la commande</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <dt className="text-gray-600">Statut</dt>
                  <dd>
                    <UpdateOrderStatusButton
                      orderId={order.id}
                      currentStatus={order.status}
                      onStatusUpdated={fetchOrder}
                    />
                  </dd>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <dt className="font-medium">Total</dt>
                  <dd className="font-bold text-lg">
                    {order.total.toLocaleString()} XOF
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-medium">Articles commandés</h2>
            </div>
            <div className="divide-y">
              {order.items?.map((item: any) => (
                <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={getValidImageUrl(item.product_image)}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div>
                      <h3 className="font-medium">{item.product_name}</h3>
                      <p className="text-sm text-gray-600">
                        Quantité: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {(item.product_price * item.quantity).toLocaleString()} XOF
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.product_price.toLocaleString()} XOF × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
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

