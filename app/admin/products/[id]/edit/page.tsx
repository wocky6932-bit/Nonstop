"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from "@/hooks/use-session"
import Link from "next/link"
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { ProductForm } from "@/components/admin/product-form"

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/products?id=${id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          router.push('/admin/products')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!sessionLoading) {
      if (!session || !session.isAdmin) {
        router.push("/auth/login")
      } else {
        fetchProduct()
      }
    }
  }, [id, session, sessionLoading, router])

  if (sessionLoading || (loading && session)) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin border-b-2 border-black mx-auto" />
          <p className="mt-4 text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.isAdmin || !product) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-sm hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux produits
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl tracking-wide mb-8">Modifier le Produit</h1>
          <div className="bg-white p-8 rounded-lg border">
            <ProductForm product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}

