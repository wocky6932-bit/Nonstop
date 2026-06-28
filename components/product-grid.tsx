"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useCart, Product } from '@/lib/cart-context'
import { useToast } from '@/hooks/use-toast'
import { useCurrency } from '@/lib/currency-context'
import { ImageCarousel } from '@/components/image-carousel'
import { getValidImageUrl } from '@/lib/image-utils'
import { normalizeProductData } from '@/lib/product-utils'

export function ProductGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { convertPrice, formatPrice } = useCurrency()

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    const normalizedProduct = normalizeProductData(product)
    addToCart(normalizedProduct)
    toast({
      title: 'Ajouté au panier',
      description: `${product.name} a été ajouté à votre panier`,
    })
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="w-full">
      {/* Grille — 2 colonnes mobile, 3 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {products.map((product) => (
          <div key={product.id} className="min-w-0">
            <Link
              href={`/shop/${product.id}`}
              className="group relative bg-white block h-full"
            >
            {/* Wrapper image + badges */}
            <div className="relative mb-3">
              <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 pointer-events-none">
                {/* Badge SOLD OUT */}
                {product.sold_out && (
                  <div className="bg-black/80 text-white text-[10px] px-2 py-1 tracking-widest font-medium uppercase rounded-sm backdrop-blur-sm">
                    SOLD OUT
                  </div>
                )}
                
                {/* Badge PRE-ORDER */}
                {(product as any).is_preorder && !product.sold_out && (
                  <div className="bg-blue-600/90 text-white text-[10px] px-2 py-1 tracking-widest font-medium uppercase rounded-sm backdrop-blur-sm">
                    PRÉ-COMMANDE
                  </div>
                )}

                {/* Badge NEW */}
                {(product as any).is_new && !product.sold_out && !(product as any).is_preorder && (
                  <div className="bg-white/90 text-black text-[10px] px-2 py-1 tracking-widest font-medium uppercase rounded-sm backdrop-blur-sm border border-gray-200">
                    NEW
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="overflow-hidden bg-gray-50 rounded-sm">
                {product.images && product.images.length > 1 ? (
                  <ImageCarousel
                    images={product.images}
                    alt={product.name}
                  />
                ) : (
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={getValidImageUrl(product.image)}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      loading="lazy"
                      quality={85}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Infos produit */}
            <div className="text-center pb-6">
              <h3 className="text-sm font-bold tracking-wide text-black mb-1">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {formatPrice(convertPrice(product.price, product.currency))}
              </p>
            </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Voir toute la boutique */}
      <div className="text-center mt-10">
        <Link
          href="/shop"
          className="inline-block text-xs tracking-widest font-medium uppercase border border-black px-10 py-4 hover:bg-black hover:text-white transition-colors duration-300"
        >
          VOIR TOUT
        </Link>
      </div>
    </section>
  )
}
