'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Menu, ShoppingBag, Plus, Minus, Instagram } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { useCurrency } from '@/lib/currency-context'
import { getValidImageUrl } from '@/lib/image-utils'
import { normalizeProductData } from '@/lib/product-utils'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { convertPrice, formatPrice } = useCurrency()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products?id=${params.id}`)
        if (!res.ok) {
          router.push('/shop')
          return
        }
        const data = await res.json()
        const normalized = normalizeProductData(data)
        setProduct(normalized)
      } catch (err) {
        console.error(err)
        router.push('/shop')
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchProduct()
  }, [params.id, router])

  const handleAddToCart = () => {
    if (!product) return
    const hasSizes = product.sizes && product.sizes.length > 0
    if (hasSizes && !selectedSize) {
      toast({ title: 'Choisissez une taille', variant: 'destructive' })
      return
    }
    addToCart({ ...product, selectedSize: selectedSize || undefined })
    toast({
      title: product.is_preorder ? 'Pré-commande ajoutée ✓' : 'Ajouté au panier ✓',
      description: selectedSize ? `${product.name} — Taille ${selectedSize}` : product.name,
    })
  }

  const images: string[] = product
    ? product.images && product.images.length > 0
      ? product.images.map((img: any) => getValidImageUrl(img))
      : [getValidImageUrl(product.image)]
    : []

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 items-center py-3">
            {/* Menu */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button aria-label="Menu" className="justify-self-start hover:opacity-60 transition-opacity">
                  <Menu className="h-5 w-5 text-white" strokeWidth={1.5} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle className="text-xs tracking-[0.3em] uppercase font-medium">Menu</SheetTitle>
                </SheetHeader>
                <div className="py-8 space-y-1">
                  {[
                    { href: '/', label: 'Accueil' },
                    { href: '/shop', label: 'Boutique' },
                    { href: '/auth/login', label: 'Se connecter' },
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-3 px-2 text-sm tracking-[0.2em] uppercase border-b border-gray-100 hover:text-gray-500 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="justify-self-center">
              <Link href="/">
                <Image
                  src="/nonstop-logo.png"
                  alt="Nonstop"
                  width={120}
                  height={36}
                  className="h-7 w-auto brightness-0 invert"
                />
              </Link>
            </div>

            {/* Cart */}
            <div className="justify-self-end">
              <CartDrawer />
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-6 h-6 border border-black border-t-transparent animate-spin" />
        </div>
      ) : !product ? null : (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Retour */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft className="w-3 h-3" /> Boutique
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Galerie images */}
            <div className="space-y-3">
              {/* Image principale */}
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-sm">
                <Image
                  src={images[selectedImage] || ''}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                />
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 pointer-events-none">
                  {/* Badge SOLD OUT */}
                  {product.sold_out && (
                    <div className="bg-black/80 text-white text-[10px] px-3 py-1 tracking-widest uppercase">
                      SOLD OUT
                    </div>
                  )}

                  {/* Badge PRE-ORDER */}
                  {(product as any).is_preorder && !product.sold_out && (
                    <div className="bg-blue-600/90 text-white text-[10px] px-3 py-1 tracking-widest uppercase">
                      PRÉ-COMMANDE
                    </div>
                  )}

                  {/* Badge NEW */}
                  {(product as any).is_new && !product.sold_out && !(product as any).is_preorder && (
                    <div className="bg-white/90 text-black text-[10px] px-3 py-1 tracking-widest uppercase border border-gray-200">
                      NEW
                    </div>
                  )}
                </div>
              </div>

              {/* Miniatures */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-16 h-20 flex-shrink-0 overflow-hidden border-2 transition-all ${
                        selectedImage === i ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Infos produit */}
            <div className="flex flex-col gap-6 pt-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">
                  {product.category || 'Nonstop'}
                </p>
                <h1 className="text-2xl font-black uppercase tracking-tight mb-3">
                  {product.name}
                </h1>
                <p className="text-xl font-medium text-black">
                  {formatPrice(convertPrice(product.price, product.currency))}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Tailles */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
                    Taille {selectedSize && <span className="text-black font-bold">— {selectedSize}</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(prev => prev === size ? '' : size)}
                        className={`px-4 py-2 text-xs tracking-wider uppercase border transition-all duration-150 ${
                          selectedSize === size
                            ? 'bg-black text-white border-black'
                            : 'border-gray-200 text-black hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sold_out ? (
                <button
                  disabled
                  className="w-full py-4 bg-gray-100 text-gray-400 text-xs uppercase tracking-widest font-medium cursor-not-allowed"
                >
                  ÉPUISÉ
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {product.is_preorder ? "PRÉ-COMMANDER" : "AJOUTER AU PANIER"}
                </button>
              )}

              {/* Détails */}
              <div className="border-t border-gray-100 pt-6 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Partout au Sénégal</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-10 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-5">
            <Image src="/nonstop-logo.png" alt="Nonstop" width={80} height={24} className="h-6 w-auto brightness-0 invert" />
          </div>
          <div className="mb-4 flex justify-center">
            <a
              href="https://www.instagram.com/nonstop__sn/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors tracking-widest uppercase"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
              @nonstop__sn
            </a>
          </div>
          <p className="text-xs text-gray-500">© 2025 Nonstop. Tous droits réservés.</p>
          <p className="text-[11px] text-gray-600 mt-1">
            Réalisé par{' '}
            <a href="https://wockytech.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">
              Wockytech
            </a>
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}
