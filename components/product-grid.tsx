"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useCart, Product } from '@/lib/cart-context'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { useCurrency } from '@/lib/currency-context'
import { ImageCarousel } from '@/components/image-carousel'
import { getValidImageUrl } from '@/lib/image-utils'
import { normalizeProductData } from '@/lib/product-utils'

export function ProductGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { convertPrice, formatPrice } = useCurrency()

  const handleAddToCart = (product: Product) => {
    // S'assurer que l'image est correctement normalisée
    const normalizedProduct = normalizeProductData(product)
    addToCart(normalizedProduct)
    toast({
      title: 'Ajouté au panier',
      description: `${product.name} a été ajouté à votre panier`,
    })
  }

  return (
    <section className="container mx-auto px-4 py-16">
      {/* En-tête de section */}
      <div className="text-center mb-16">
        <div className="inline-block mb-4">
          <div className="h-px w-16 bg-black mx-auto mb-2"></div>
          <span className="text-sm font-medium tracking-[0.2em] text-gray-600 uppercase">
            Collection
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-wider mb-6 font-light">
          COLLECTION À LA UNE
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Découvrez notre sélection exclusive de produits premium, soigneusement choisis pour leur qualité exceptionnelle et leur style unique.
        </p>
      </div>

      {/* Grille de produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="group relative bg-white rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Badge sold out */}
            {product.sold_out && (
              <div className="absolute top-4 left-4 z-20 bg-gray-900 text-white text-xs px-3 py-1 tracking-wider font-medium rounded-full">
                ÉPUISÉ
              </div>
            )}

            {/* Image du produit */}
            <div className="group relative">
              {/* Check if product has multiple images (images field) */}
              {(product.images && product.images.length > 1) ? (
                <ImageCarousel
                  images={product.images}
                  alt={product.name}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                  <Image
                    src={getValidImageUrl(product.image)}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    quality={85}
                  />
                  
                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                </div>
              )}
              

            </div>
            
            {/* Informations produit */}
            <div className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-3 tracking-wide group-hover:text-gray-700 transition-colors duration-200">
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-gray-900 mb-4">
                  {formatPrice(convertPrice(product.price, product.currency))}
                </p>
                
                {/* Bouton principal */}
                {!product.sold_out ? (
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium tracking-wide py-3"
                  >
                    AJOUTER AU PANIER
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 cursor-not-allowed font-medium tracking-wide py-3"
                  >
                    PRODUIT ÉPUISÉ
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section voir tout */}
      <div className="text-center mt-16">
        <div className="inline-block">
          <div className="h-px w-16 bg-gray-300 mx-auto mb-6"></div>
          <Link href="/shop">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-transparent border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wider font-medium px-12 py-6 text-sm"
            >
              <span className="relative z-10">VOIR TOUTE LA COLLECTION</span>
              <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Button>
          </Link>
          <div className="h-px w-16 bg-gray-300 mx-auto mt-6"></div>
        </div>
      </div>
    </section>
  )
}
