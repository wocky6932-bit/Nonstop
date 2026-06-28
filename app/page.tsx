'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Search, Menu, Instagram, X, User, Zap, ShieldCheck, Star, Headphones, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { ProductGrid } from '@/components/product-grid'
import { getValidImageUrl } from '@/lib/image-utils'
import { normalizeProductData } from '@/lib/product-utils'
import { useCurrency } from '@/lib/currency-context'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function HomePage() {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { currency, setCurrency } = useCurrency()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [connectionError, setConnectionError] = useState(false)

  useEffect(() => {
    // Charger les produits depuis MySQL
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products')
        if (response.ok) {
          const data = await response.json()
          // Normaliser les produits
          const normalizedProducts = data
            .map((p: any) => normalizeProductData(p))
          setProducts(normalizedProducts)
          setConnectionError(false)
        } else {
          throw new Error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setConnectionError(true)
        // En cas d'erreur, ne rien afficher
        setProducts([])
      }
    }

    fetchProducts()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase()) ||
        (product as any).category?.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }

  const handleAddToCart = (product: any) => {
    const normalizedProduct = normalizeProductData(product)
    addToCart(normalizedProduct)
    toast({
      title: normalizedProduct.is_preorder ? 'Pré-commande ajoutée' : 'Ajouté au panier',
      description: `${product.name} a été ajouté à votre panier`,
    })
  }

  return (
    <div className="min-h-screen bg-white text-black" suppressHydrationWarning>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Menu Hamburger */}
            <div className="flex-1 flex justify-start">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <button aria-label="Menu" className="hover:opacity-60 transition-opacity text-white">
                    <Menu className="h-6 w-6" strokeWidth={1.5} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-lg bg-black border-white/10">
                  <SheetHeader>
                    <SheetTitle className="text-xl tracking-wider text-white">MENU</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <div className="space-y-4">
                      <Link href="/" onClick={() => setMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start tracking-wider text-white hover:text-black">
                          ACCUEIL
                        </Button>
                      </Link>
                      <Link href="/shop" onClick={() => setMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start tracking-wider text-white hover:text-black">
                          BOUTIQUE
                        </Button>
                      </Link>
                      <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start tracking-wider text-white hover:text-black">
                          SE CONNECTER
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo Center */}
            <div className="flex-1 flex justify-center">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/nonstop-logo.png"
                  alt="Nonstop"
                  width={120}
                  height={36}
                  className="h-7 w-auto brightness-0 invert"
                />
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex-1 flex items-center justify-end gap-5 text-white">
              <CartDrawer />
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[70vh] overflow-hidden">
            <div className="flex items-center gap-4 p-6 border-b">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 outline-none text-lg"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery('')
                  setSearchResults([])
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex gap-3">
                          <img
                            src={getValidImageUrl(product.image_url, '/placeholder.jpg')}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm">
                                {product.price?.toLocaleString()} {product.currency}
                              </span>
                              <button
                                onClick={() => {
                                  handleAddToCart(product)
                                  setSearchOpen(false)
                                  setSearchQuery('')
                                  setSearchResults([])
                                }}
                                className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors"
                              >
                                Ajouter
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchQuery.trim() ? (
                <div className="text-center text-gray-500 py-8">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun produit trouvé pour "{searchQuery}"</p>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Tapez pour rechercher des produits</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[80vh] flex items-end justify-center overflow-hidden bg-black pb-8 md:pb-12">
        {/* Hero background image */}
        <Image
          src="/images/nonstop_mac_wallpaper_v2.png"
          alt="Nonstop Hero"
          fill
          className="object-contain md:object-cover object-center"
          priority
          quality={90}
        />
        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <Link href="/shop">
            <button className="inline-flex items-center justify-center border border-white bg-transparent text-white transition-all duration-300 text-sm tracking-widest uppercase font-medium px-8 md:px-10 py-3 md:py-4 hover:bg-white hover:text-black">
              DÉCOUVRIR LA COLLECTION
            </button>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-12">
        
        {/* Collection Section Title */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] font-medium text-gray-400 mb-3">
            COLLECTION
          </p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-black mb-4 uppercase">
            À LA UNE
          </h2>
          <div className="text-black text-lg mb-3">★</div>
          <p className="text-gray-500 text-xs tracking-widest uppercase">
            DES PIÈCES CONÇUES POUR CEUX QUI VIVENT SANS LIMITES.
          </p>
        </div>

        <ProductGrid products={products} />

      </main>

      {/* Features Banner */}
      <section className="border-t border-gray-100 bg-white py-10 mt-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center gap-3">
              <Zap className="w-5 h-5 text-black" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-black mb-1">LIVRAISON RAPIDE</h4>
                <p className="text-[10px] text-gray-400">Partout au Sénégal</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <ShieldCheck className="w-5 h-5 text-black" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-black mb-1">PAIEMENT SÉCURISÉ</h4>
                <p className="text-[10px] text-gray-400">100% sécurisé</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <Star className="w-5 h-5 text-black" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-widests text-black mb-1">QUALITÉ PREMIUM</h4>
                <p className="text-[10px] text-gray-400">Produits sélectionnés</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <Headphones className="w-5 h-5 text-black" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-black mb-1">SUPPORT 24/7</h4>
                <p className="text-[10px] text-gray-400">À votre écoute</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/nonstop-logo.png"
                alt="Nonstop"
                width={120}
                height={36}
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <div className="mb-6 flex justify-center gap-6">
              <a
                href="https://www.instagram.com/nonstop__sn/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Instagram className="h-4 w-4" />
                @nonstop__sn
              </a>
            </div>
            <p className="text-[10px] text-gray-600 tracking-widest uppercase">
              © 2025 NONSTOP. TOUS DROITS RÉSERVÉS.
            </p>
            <p className="text-[10px] text-gray-600 mt-2">
              Réalisé par{' '}
              <a href="https://wockytech.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">
                Wockytech
              </a>
            </p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  )
}
