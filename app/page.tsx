'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Search, User, Menu, Instagram, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { ProductGrid } from '@/components/product-grid'
import { CurrencySelector } from '@/components/currency-selector'
import { getValidImageUrl } from '@/lib/image-utils'
import { normalizeProductData } from '@/lib/product-utils'

export default function HomePage() {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isOverVideo, setIsOverVideo] = useState(false)
  const [connectionError, setConnectionError] = useState(false)
  const heroSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (heroSectionRef.current) {
        const rect = heroSectionRef.current.getBoundingClientRect()
        const isVisible = rect.top <= 100 && rect.bottom >= 100
        setIsOverVideo(isVisible)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Vérifier la position initiale
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Charger les produits depuis MySQL
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products')
        if (response.ok) {
          const data = await response.json()
          // Normaliser et filtrer les produits disponibles
          const normalizedProducts = data
            .filter((p: any) => !p.sold_out)
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
      title: 'Ajouté au panier',
      description: `${product.name} a été ajouté à votre panier`,
    })
  }

  return (
    <div className="min-h-screen bg-white" suppressHydrationWarning>
      {/* Header */}
      <header className={`border-b border-gray-200 sticky top-0 z-50 transition-colors duration-300 ${
        isOverVideo ? 'bg-transparent' : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 items-center py-4">
            {/* Menu Hamburger */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button aria-label="Menu" className="p-2 justify-self-start">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="text-xl tracking-wider">MENU</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <Link href="/" onClick={() => setMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start tracking-wider">
                        ACCUEIL
                      </Button>
                    </Link>
                    <Link href="/shop" onClick={() => setMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start tracking-wider">
                        BOUTIQUE
                      </Button>
                    </Link>
                    <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start tracking-wider">
                        SE CONNECTER
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo Center */}
            <div className="justify-self-center">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/nonstop-logo.png"
                  alt="Nonstop"
                  width={40}
                  height={40}
                  className="h-8 w-8 sm:h-10 sm:w-auto"
                />
                <span className="text-lg sm:text-xl font-bold tracking-wider hidden xs:inline-block">Nonstop</span>
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-6 justify-self-end">
              <CurrencySelector 
                className="text-xs sm:text-sm"
              />
              <Link href="/auth/login" className="hidden sm:block">
                  <button aria-label="Se connecter">
                    <User className="h-5 w-5" />
                  </button>
                </Link>
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="hover:opacity-70 transition-opacity hidden xs:block"
              >
                <Search className="h-5 w-5" />
              </button>
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
      <section ref={heroSectionRef} className="relative h-screen bg-black flex items-center justify-center overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-contain object-center opacity-100"
          style={{ objectPosition: 'center center' }}
          src="/images/nonstop_mac_wallpaper_v2.png"
          alt="Hero background"
        />
        <div className="relative z-10 text-center text-white">
          <Link href="/shop">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium disabled:pointer-events-none disabled:opacity-50 h-10 rounded-md has-[>svg]:px-4 border border-white text-white transition-all duration-300 tracking-wider text-sm px-8 py-6 hover:bg-white hover:text-black hover:shadow-lg hover:scale-105"
              style={{
                '--button-background': '255 255 255',
                '--button-outline-color': '255 255 255',
                '--button-text-color': '0 0 0'
              } as React.CSSProperties}
            >
              VOIR LA COLLECTION
            </button>
          </Link>
        </div>
      </section>

      <ProductGrid products={products} />

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/nonstop-logo.png"
                alt="Nonstop"
                width={60}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <div className="mb-4 flex justify-center gap-6">
              <a
                href="https://www.instagram.com/nonstop__sn/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
                @nonstop__sn
              </a>
              <a
                href="https://www.snapchat.com/add/nonstopsn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
                </svg>
                nonstopsn
              </a>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 Nonstop. Tous droits réservés.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Réalisé par <a href="https://github.com/mactar27" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">mactar27</a>
            </p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  )
}
