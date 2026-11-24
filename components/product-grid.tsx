"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart, Product } from '@/lib/cart-context'
import { ShoppingCart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useCurrency } from '@/lib/currency-context'
import { ImageCarousel } from '@/components/image-carousel'
import { getValidImageUrl } from '@/lib/image-utils'
import { normalizeProductData } from '@/lib/product-utils'

interface ProductGridProps {
  products: Product[]
  showMannequinToggle?: boolean
}

export function ProductGrid({ products, showMannequinToggle = true }: ProductGridProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { convertPrice, formatPrice } = useCurrency()
  const [isMannequin, setIsMannequin] = useState<boolean>(false)

  // Vérifier si au moins un produit possède une image mannequin
  const hasAnyMannequin = products.some(p => Boolean(p.mannequin_image))

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
      {/* Bascule VUE / MANNEQUIN si au moins un article a une photo portée */}
      {showMannequinToggle && hasAnyMannequin && (
        <div className="flex items-center justify-end mb-6 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase">
            <button
              type="button"
              onClick={() => setIsMannequin(false)}
              className={`py-1 px-2.5 rounded transition-colors text-[11px] ${
                !isMannequin ? 'font-black text-black bg-neutral-100' : 'text-neutral-400 hover:text-black'
              }`}
            >
              VUE
            </button>
            <button
              type="button"
              onClick={() => setIsMannequin(!isMannequin)}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded transition-colors text-[11px] ${
                isMannequin ? 'font-black text-black bg-neutral-100' : 'text-neutral-400 hover:text-black'
              }`}
            >
              <span>MANNEQUIN</span>
              <span className={`w-5 h-3 border border-neutral-400 p-0.5 rounded-full transition-colors flex items-center ${
                isMannequin ? 'bg-black border-black' : 'bg-transparent'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full transition-transform ${
                  isMannequin ? 'bg-white translate-x-2' : 'bg-neutral-400 translate-x-0'
                }`} />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Grille — 2 colonnes mobile, 3 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {products.map((product) => {
          // Déterminer l'image à afficher (Mannequin si activé et disponible)
          const displayImage = (isMannequin && product.mannequin_image)
            ? product.mannequin_image
            : product.image

          return (
            <div key={product.id} className="min-w-0">
              <Link
                href={`/shop/${product.id}`}
                className="group relative bg-white block h-full"
              >
              {/* Wrapper image + badges */}
              <div className="relative mb-3">
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 pointer-events-none">
                  {/* Badge PORTÉ MANNEQUIN */}
                  {isMannequin && product.mannequin_image && (
                    <div className="bg-black text-white text-[9px] px-2 py-0.5 tracking-widest font-bold uppercase rounded-sm">
                      PORTÉ
                    </div>
                  )}

                  {/* Badge PROMO */}
                  {product.original_price && Number(product.original_price) > product.price && !product.sold_out && (
                    <div className="bg-red-600 text-white text-[10px] px-2 py-1 tracking-widest font-bold uppercase rounded-sm backdrop-blur-sm">
                      PROMO
                    </div>
                  )}

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
                  {isMannequin && product.mannequin_image ? (
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={getValidImageUrl(product.mannequin_image)}
                        alt={`${product.name} sur mannequin`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        loading="lazy"
                        quality={85}
                      />
                    </div>
                  ) : product.images && product.images.length > 1 ? (
                    <ImageCarousel
                      images={product.images}
                      alt={product.name}
                    />
                  ) : (
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={getValidImageUrl(displayImage)}
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

              {/* Bouton + quick add */}
              {!product.sold_out && (
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  aria-label={`Ajouter ${product.name} au panier`}
                  className="absolute bottom-2 right-2 z-20 w-8 h-8 bg-white border border-gray-200 flex items-center justify-center rounded-full shadow-sm text-black hover:bg-black hover:text-white transition-colors duration-200"
                >
                  <ShoppingCart className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              )}
            </div>

            {/* Infos produit */}
            <div className="text-center pb-6">
              <h3 className="text-sm font-bold tracking-wide text-black mb-1">
                {product.name}
              </h3>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-semibold text-black">
                  {formatPrice(convertPrice(product.price, product.currency))}
                </span>
                {product.original_price && Number(product.original_price) > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(convertPrice(Number(product.original_price), product.currency))}
                  </span>
                )}
              </div>
            </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
