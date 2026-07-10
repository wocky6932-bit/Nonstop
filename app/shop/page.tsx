'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, ShoppingBag, X, Instagram, Plus, Zap, ShieldCheck, Star, Headphones } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { ImageCarousel } from '@/components/image-carousel'
import { useCurrency } from '@/lib/currency-context'
import { getValidImageUrl } from '@/lib/image-utils'
import { normalizeProductData } from '@/lib/product-utils'

function ShopContent() {
    const { addToCart } = useCart()
    const { toast } = useToast()
    const { convertPrice, formatPrice } = useCurrency()
    const [menuOpen, setMenuOpen] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('Tous')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
    const searchParams = useSearchParams()
    const filterParam = searchParams.get('filter')
    const [preorderFilter, setPreorderFilter] = useState(false)

    useEffect(() => {
        if (filterParam === 'preorder') {
            setPreorderFilter(true)
        }
    }, [filterParam])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/admin/products')
                if (response.ok) {
                    const data = await response.json()
                    const normalized = data.map((p: any) => normalizeProductData(p))
                    setProducts(normalized)
                }
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault()
        e.stopPropagation()
        const normalized = normalizeProductData(product)
        const hasSizes = normalized.sizes && normalized.sizes.length > 0
        const selectedSize = selectedSizes[product.id]

        if (hasSizes && !selectedSize) {
            toast({
                title: 'Choisissez une taille',
                description: `Sélectionnez une taille pour ${product.name}`,
                variant: 'destructive',
            })
            return
        }

        addToCart({ ...normalized, selectedSize: selectedSize || undefined })
        toast({
            title: normalized.is_preorder ? 'Pré-commande ajoutée' : 'Ajouté au panier',
            description: selectedSize
                ? `${product.name} — Taille ${selectedSize}`
                : `${product.name} ajouté au panier`,
        })
    }

    const categories = ['Tous', ...Array.from(new Set(products.map((p: any) => p.category).filter(Boolean)))]

    const filteredProducts = products.filter((p) => {
        const matchCat = activeCategory === 'Tous' || (p as any).category === activeCategory
        const matchSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchPreorder = !preorderFilter || (p as any).is_preorder
        return matchCat && matchSearch && matchPreorder
    })

    return (
        <div className="min-h-screen bg-white">

            {/* ── HEADER ───────────────────────────────────────────── */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-3 items-center py-3">

                        {/* Hamburger */}
                        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                            <SheetTrigger asChild>
                                <button aria-label="Menu" className="justify-self-start hover:opacity-60 transition-opacity">
                                    <Menu className="h-5 w-5" strokeWidth={1.5} />
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
                                    className="h-7 w-auto brightness-0"
                                />
                            </Link>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-4 justify-self-end">
                            <button
                                aria-label="Rechercher"
                                onClick={() => setSearchOpen(true)}
                                className="hover:opacity-60 transition-opacity"
                            >
                                <Search className="h-5 w-5" strokeWidth={1.5} />
                            </button>
                            <CartDrawer />
                        </div>
                    </div>
                </div>
            </header>

            {/* ── SEARCH MODAL ─────────────────────────────────────── */}
            {searchOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
                    <div className="bg-white w-full max-w-2xl mx-4">
                        <div className="flex items-center gap-4 px-6 py-4 border-b">
                            <Search className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                            <input
                                type="text"
                                placeholder="Rechercher des produits..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 outline-none text-sm tracking-wide"
                                autoFocus
                            />
                            <button
                                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                                className="hover:opacity-60 transition-opacity"
                            >
                                <X className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PAGE TITLE + FILTERS ─────────────────────────────── */}
            <div className="border-b border-gray-100">
                {/* Title */}
                <div className="text-center py-8">
                    <h1 className="text-xs tracking-[0.4em] uppercase text-black font-medium">
                        {preorderFilter ? 'Pré-commandes' : 'Boutique'}
                    </h1>
                    <p className="text-[11px] text-gray-400 mt-1 tracking-widest">
                        {filteredProducts.length} article{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                    {preorderFilter && (
                        <button
                            onClick={() => setPreorderFilter(false)}
                            className="mt-3 inline-flex items-center gap-2 text-[10px] tracking-widest uppercase bg-blue-600 text-white px-4 py-1.5 rounded-sm hover:bg-blue-700 transition-colors"
                        >
                            <X className="w-3 h-3" />
                            Voir tous les produits
                        </button>
                    )}
                </div>

                {/* Category pills */}
                <div className="flex gap-0 overflow-x-auto border-t border-gray-100 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex-shrink-0 px-5 py-3 text-[11px] tracking-[0.2em] uppercase transition-all duration-150 border-b-2 ${
                                activeCategory === cat
                                    ? 'border-black text-black font-medium'
                                    : 'border-transparent text-gray-400 hover:text-black'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── PRODUCT GRID ─────────────────────────────────────── */}
            <main className="pb-24">
                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <div className="w-6 h-6 border border-black border-t-transparent animate-spin" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-40">
                        <ShoppingBag className="h-10 w-10 mx-auto mb-4 text-gray-200" strokeWidth={1} />
                        <p className="text-xs text-gray-400 tracking-[0.2em] uppercase">Aucun produit trouvé</p>
                        {(searchQuery || activeCategory !== 'Tous') && (
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('Tous') }}
                                className="mt-4 text-[11px] text-gray-400 underline hover:text-black transition-colors tracking-widest uppercase"
                            >
                                Réinitialiser
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 pt-4">
                        {filteredProducts.map((product) => (
                            <Link
                                href={`/shop/${product.id}`}
                                key={product.id}
                                className="group relative bg-white overflow-hidden min-w-0 block"
                            >
                                {/* Wrapper image + badges + bouton */}
                                <div className="relative">
                                    <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 pointer-events-none">
                                        {/* Badge SOLD OUT */}
                                        {product.sold_out && (
                                            <div className="bg-white/90 text-black text-[10px] px-2 py-0.5 tracking-widest font-medium uppercase border border-gray-200">
                                                SOLD OUT
                                            </div>
                                        )}

                                        {/* Badge PRE-ORDER */}
                                        {(product as any).is_preorder && !product.sold_out && (
                                            <div className="bg-blue-600/90 text-white text-[10px] px-2 py-0.5 tracking-widest font-medium uppercase border border-blue-600">
                                                PRÉ-COMMANDE
                                            </div>
                                        )}

                                        {/* Badge NEW */}
                                        {(product as any).is_new && !product.sold_out && !(product as any).is_preorder && (
                                            <div className="bg-white/90 text-black text-[10px] px-2 py-0.5 tracking-widest font-medium uppercase border border-gray-200">
                                                NEW
                                            </div>
                                        )}
                                    </div>

                                    {/* Image — overflow-hidden ici seulement */}
                                    <div className="overflow-hidden bg-gray-50">
                                        {product.images && product.images.length > 1 ? (
                                            <ImageCarousel
                                                images={product.images}
                                                alt={product.name}
                                            />
                                        ) : (
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={getValidImageUrl(product.image)}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    sizes="(max-width: 1024px) 50vw, 25vw"
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
                                            className="absolute bottom-2 right-2 z-20 w-8 h-8 bg-white/95 border border-gray-300 flex items-center justify-center rounded-full shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-black hover:text-white hover:border-black"
                                        >
                                            <Plus className="w-4 h-4" strokeWidth={1.5} />
                                        </button>
                                    )}
                                </div>

                                {/* Sélecteur de taille — visible au hover */}
                                {product.sizes && product.sizes.length > 0 && (
                                    <div className="px-2 pt-2 hidden group-hover:flex flex-wrap gap-1">
                                        {product.sizes.map((size: string) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSizes(prev => ({
                                                    ...prev,
                                                    [product.id]: prev[product.id] === size ? '' : size
                                                }))}
                                                className={`text-[10px] px-2 py-0.5 border transition-all ${
                                                    selectedSizes[product.id] === size
                                                        ? 'bg-black text-white border-black'
                                                        : 'border-gray-300 text-gray-600 hover:border-black'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Infos produit */}
                                <div className="px-2 pt-2 pb-4">
                                    <p className="text-[11px] sm:text-xs font-medium tracking-widest uppercase text-black leading-tight truncate">
                                        {product.name}
                                    </p>
                                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                                        {formatPrice(convertPrice(product.price, product.currency))}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* ── FEATURES ─────────────────────────────────────────── */}
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
                      <h4 className="font-bold text-[10px] uppercase tracking-widest text-black mb-1">QUALITÉ PREMIUM</h4>
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

            {/* ── FOOTER ───────────────────────────────────────────── */}
            <footer className="bg-black text-white py-10">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center mb-5">
                        <Image src="/nonstop-logo.png" alt="Nonstop" width={80} height={24} className="h-6 w-auto brightness-0 invert" />
                    </div>
                    <div className="mb-4 flex justify-center gap-6">
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

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>}>
            <ShopContent />
        </Suspense>
    )
}
