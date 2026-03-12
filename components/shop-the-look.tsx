"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { normalizeProductData } from '@/lib/product-utils'

interface LookProduct {
  id: string
  name: string
  price: number
  currency?: string
  image: string
  handle: string
}

interface Look {
  id: string
  name: string
  image: string
  products: LookProduct[]
  hotSpots: { top: number; left: number; productIndex: number }[]
}

export function ShopTheLook() {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [looks, setLooks] = useState<Look[]>([])
  const [activeLook, setActiveLook] = useState(0)
  const [activeProduct, setActiveProduct] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Données statiques pour les looks (vous pouvez les remplacer par des données de votre base)
  const staticLooks: Look[] = [
    {
      id: 'look-1',
      name: 'Look Urban',
      image: '/images/look-urban.jpg',
      products: [
        {
          id: '1',
          name: 'Hoodie Noir Premium',
          price: 25000,
          currency: 'XOF',
          image: '/images/WhatsApp Image 2025-11-17 at 17.07.19.jpeg',
          handle: 'hoodie-noir-premium'
        },
        {
          id: '2',
          name: 'Bonnet Nonstop',
          price: 8000,
          currency: 'XOF',
          image: '/images/WhatsApp Image 2025-11-17 at 17.07.19 (2).jpeg',
          handle: 'bonnet-nonstop'
        }
      ],
      hotSpots: [
        { top: 30, left: 45, productIndex: 0 },
        { top: 57, left: 44, productIndex: 1 }
      ]
    },
    {
      id: 'look-2',
      name: 'Look Décontracté',
      image: '/images/look-casual.jpg',
      products: [
        {
          id: '3',
          name: 'T-Shirt NS Logo',
          price: 15000,
          currency: 'XOF',
          image: '/images/img-6725.jpeg',
          handle: 'tshirt-ns-logo'
        },
        {
          id: '4',
          name: 'Pantalon Sport',
          price: 22000,
          currency: 'XOF',
          image: '/images/img-6726.jpeg',
          handle: 'pantalon-sport'
        }
      ],
      hotSpots: [
        { top: 35, left: 47, productIndex: 0 },
        { top: 61, left: 44, productIndex: 1 }
      ]
    },
    {
      id: 'look-3',
      name: 'Look Complet',
      image: '/images/look-complete.jpg',
      products: [
        {
          id: '5',
          name: 'Collection Complète NS',
          price: 50000,
          currency: 'XOF',
          image: '/images/img-6727.jpeg',
          handle: 'collection-complete'
        }
      ],
      hotSpots: [
        { top: 40, left: 50, productIndex: 0 }
      ]
    }
  ]

  useEffect(() => {
    setLooks(staticLooks)
    setIsLoading(false)
  }, [])

  const handleAddToCart = (product: LookProduct) => {
    // Créer un objet produit normalisé pour le panier
    const normalizedProduct = normalizeProductData({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      currency: product.currency || 'XOF',
      sold_out: false
    })

    addToCart(normalizedProduct)
    toast({
      title: 'Ajouté au panier',
      description: `${product.name} a été ajouté à votre panier`,
    })
  }

  const handleHotSpotClick = (productIndex: number) => {
    setActiveProduct(productIndex)
    setShowModal(true)
  }

  const nextProduct = () => {
    setActiveProduct((prev) => (prev + 1) % looks[activeLook]?.products.length)
  }

  const prevProduct = () => {
    setActiveProduct((prev) => (prev - 1 + looks[activeLook]?.products.length) % looks[activeLook]?.products.length)
  }

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl tracking-wider mb-4 font-light">Shop the look</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </section>
    )
  }

  if (!looks.length) return null

  return (
    <>
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl tracking-wider mb-4 font-light">Shop the look</h2>
          <p className="text-gray-600">
            Découvrez nos looks complets et shoppingisez chaque pièce
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {looks.map((look, lookIndex) => (
            <div key={look.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] bg-gray-100 mb-6 overflow-hidden rounded-lg">
                <Image
                  src={look.image}
                  alt={look.name}
                  fill
                  className="object-cover transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />

                {/* Hot Spots */}
                {look.hotSpots.map((spot, spotIndex) => (
                  <button
                    key={spotIndex}
                    onClick={() => handleHotSpotClick(spot.productIndex)}
                    className="absolute w-4 h-4 bg-white border-2 border-black rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 hover:bg-gray-100 transition-colors"
                    style={{ top: `${spot.top}%`, left: `${spot.left}%` }}
                    aria-label={`Voir le produit ${spot.productIndex + 1}`}
                  >
                    <span className="sr-only">Voir le produit {spot.productIndex + 1}</span>
                  </button>
                ))}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">{look.name}</h3>
                <Button
                  onClick={() => setShowModal(true)}
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  Voir le look
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">Shop the FIT</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {looks[activeLook] && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Product Display */}
                  <div className="space-y-4">
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={looks[activeLook].products[activeProduct]?.image}
                        alt={looks[activeLook].products[activeProduct]?.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>

                    <div className="text-center">
                      <h4 className="text-lg font-semibold mb-2">
                        {looks[activeLook].products[activeProduct]?.name}
                      </h4>
                      <p className="text-lg font-bold mb-4">
                        {looks[activeLook].products[activeProduct]?.price?.toLocaleString()} {looks[activeLook].products[activeProduct]?.currency}
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button
                          onClick={() => handleAddToCart(looks[activeLook].products[activeProduct])}
                          className="bg-black text-white hover:bg-gray-800"
                        >
                          Ajouter au panier
                        </Button>
                        <Link href={`/product/${looks[activeLook].products[activeProduct]?.handle}`}>
                          <Button variant="outline">
                            Voir le produit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Product Navigation */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">
                        Produits du look ({activeProduct + 1}/{looks[activeLook].products.length})
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={prevProduct}
                          className="p-2 border rounded-full hover:bg-gray-100"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={nextProduct}
                          className="p-2 border rounded-full hover:bg-gray-100"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {looks[activeLook].products.map((product, index) => (
                        <button
                          key={product.id}
                          onClick={() => setActiveProduct(index)}
                          className={`text-left p-3 border rounded-lg transition-colors ${index === activeProduct ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="aspect-square bg-gray-100 rounded mb-2 overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="100px"
                            />
                          </div>
                          <h5 className="font-medium text-sm mb-1">{product.name}</h5>
                          <p className="text-xs text-gray-600">
                            {product.price.toLocaleString()} {product.currency}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}