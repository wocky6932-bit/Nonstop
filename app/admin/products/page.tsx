"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from "@/hooks/use-session"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil, RefreshCw } from 'lucide-react'
import { DeleteProductButton } from "@/components/admin/delete-product-button"
import { getValidImageUrl } from "@/lib/image-utils"

interface Product {
  id: string
  name: string
  price: number
  currency: string
  image?: string
  images?: string[]
  sold_out: boolean
  created_at: string
}

// Helper pour parser les images depuis MySQL
const parseProductImages = (product: any): string[] => {
  if (!product.images) return []
  if (typeof product.images === 'string') {
    try {
      const parsed = JSON.parse(product.images)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return Array.isArray(product.images) ? product.images : []
}

export default function AdminProductsPage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    console.log('🔄 Refreshing products list from MySQL...')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        console.log('📦 Products loaded:', data?.length || 0)

        // On affiche tous les produits en admin, même ceux épuisés
        setProducts(data || [])
      } else {
        console.error('❌ Failed to fetch products:', response.statusText)
      }
    } catch (error) {
      console.error('❌ Error loading products:', error)
    } finally {
      setLoading(false)
      console.log('✅ Products refresh completed')
    }
  }

  useEffect(() => {
    if (!sessionLoading && session) {
      fetchProducts()
    }
  }, [session, sessionLoading])

  if (sessionLoading || (loading && session)) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Accès refusé. Veuillez vous connecter en tant qu'administrateur.</p>
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
          <Button
            onClick={fetchProducts}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl tracking-wide">Gestion des Produits</h1>
              <p className="text-sm text-gray-600 mt-1">
                {products.length} produit{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Link href="/admin/products/new">
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Produit
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Nom
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Prix
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products?.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img
                          src={getValidImageUrl(
                            (() => {
                              const images = parseProductImages(product)
                              return images.length > 0 ? images[0] : product.image
                            })()
                          )}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm">{product.name}</td>
                      <td className="px-6 py-4 text-sm">
                        {product.price.toLocaleString()} {product.currency}
                      </td>
                      <td className="px-6 py-4">
                        {product.sold_out ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Épuisé
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Disponible
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteProductButton
                            productId={product.id}
                            onProductDeleted={fetchProducts}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
