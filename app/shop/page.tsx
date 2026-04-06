'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, User, Menu, ShoppingBag, X, Instagram, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { ImageCarousel } from '@/components/image-carousel'
import { CurrencySelector } from '@/components/currency-selector'
import { useCurrency } from '@/lib/currency-context'
import { getValidImageUrl } from '@/lib/image-utils'
import { normalizeProductData } from '@/lib/product-utils'

const CATEGORIES = ['Tous', 'clothing', 'accessories', 'general']

export default function ShopPage() {
    const { addToCart } = useCart()
    const { toast } = useToast()
    const { convertPrice, formatPrice } = useCurrency()
    const [menuOpen, setMenuOpen] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('Tous')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchOpen, setSearchOpen] = useState(false)
    // Stocke la taille sélectionnée pour chaque produit : { [productId]: "M" }
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/admin/products')
                if (response.ok) {
                    const data = await response.json()
                    const normalized = data
                        .filter((p: any) => !p.sold_out)
                        .map((p: any) => normalizeProductData(p))
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

    const handleAddToCart = (product: any) => {
        const normalized = normalizeProductData(product)
        const hasSizes = normalized.sizes && normalized.sizes.length > 0
        const selectedSize = selectedSizes[product.id]

        if (hasSizes && !selectedSize) {
            toast({
                title: 'Choisissez une taille',
                description: `Veuillez sélectionner une taille pour ${product.name}`,
                variant: 'destructive',
            })
            return
        }

        addToCart({ ...normalized, selectedSize: selectedSize || undefined })
        toast({
            title: 'Ajouté au panier',
            description: selectedSize
                ? `${product.name} - Taille ${selectedSize} ajouté au panier`
                : `${product.name} ajouté au panier`,
        })
    }

    const filteredProducts = products.filter((p) => {
        const matchCat =
            activeCategory === 'Tous' ||
            (p as any).category === activeCategory
        const matchSearch =
            !searchQuery.trim() ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchCat && matchSearch
    })

    const categories = ['Tous', ...Array.from(new Set(products.map((p: any) => p.category).filter(Boolean)))]

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200 sticky top-0 z-50 bg-white/90 backdrop-blur-sm">
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
                                            <Button variant="ghost" className="w-full justify-start tracking-wider">ACCUEIL</Button>
                                        </Link>
                                        <Link href="/shop" onClick={() => setMenuOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start tracking-wider font-bold">BOUTIQUE</Button>
                                        </Link>
                                        <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start tracking-wider">SE CONNECTER</Button>
                                        </Link>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Logo */}
                        <div className="justify-self-center">
                            <Link href="/" className="flex items-center gap-2">
                                <Image src="/nonstop-logo.png" alt="Nonstop" width={50} height={50} className="h-10 w-auto" />
                                <span className="text-xl font-bold tracking-wider">Nonstop</span>
                            </Link>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center gap-3 sm:gap-6 justify-self-end">
                            <CurrencySelector className="text-sm" />
                            <Link href="/auth/login">
                                <button aria-label="Se connecter"><User className="h-5 w-5" /></button>
                            </Link>
                            <button
                                aria-label="Search"
                                onClick={() => setSearchOpen(true)}
                                className="hover:opacity-70 transition-opacity"
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
                    <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
                        <div className="flex items-center gap-4 p-6 border-b">
                            <Search className="h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher des produits..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 outline-none text-lg"
                                autoFocus
                            />
                            <button
                                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="border-b border-gray-100 py-10 text-center bg-neutral-50">
                <div className="h-px w-16 bg-black mx-auto mb-4" />
                <h1 className="text-4xl sm:text-5xl tracking-wider font-light mb-3">BOUTIQUE</h1>
                <p className="text-gray-500 text-sm tracking-widest uppercase">
                    {products.length} article{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Search bar inline */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Category filters */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all duration-200 rounded-full ${activeCategory === cat
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-600 border-gray-300 hover:border-black'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Inline search */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 w-full sm:w-64">
                        <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="outline-none text-sm flex-1 bg-transparent"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')}>
                                <X className="h-4 w-4 text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <main className="container mx-auto px-4 pb-24">
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
                            <p className="text-gray-500 tracking-wide">Chargement...</p>
                        </div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-32">
                        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-xl text-gray-500 tracking-wide">Aucun produit trouvé</p>
                        {(searchQuery || activeCategory !== 'Tous') && (
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('Tous') }}
                                className="mt-4 text-sm text-gray-400 underline hover:text-black transition-colors"
                            >
                                Réinitialiser les filtres
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {filteredProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className="group relative bg-white rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-transparent hover:border-gray-100"
                                style={{ animationDelay: `${index * 60}ms` }}
                            >
                                {/* Badge sold out */}
                                {product.sold_out && (
                                    <div className="absolute top-4 left-4 z-20 bg-gray-900 text-white text-xs px-3 py-1 tracking-wider font-medium rounded-full">
                                        ÉPUISÉ
                                    </div>
                                )}

                                {/* Image */}
                                {product.images && product.images.length > 1 ? (
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
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                                    </div>
                                )}

                                {/* Info */}
                                <div className="p-5 text-center">
                                    <h2 className="text-base font-medium text-gray-900 mb-2 tracking-wide group-hover:text-gray-600 transition-colors">
                                        {product.name}
                                    </h2>
                                    <p className="text-lg font-bold text-gray-900 mb-3">
                                        {formatPrice(convertPrice(product.price, product.currency))}
                                    </p>

                                    {/* Sélecteur de taille */}
                                    {product.sizes && product.sizes.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-500 mb-1.5 tracking-widest uppercase">Taille</p>
                                            <div className="flex flex-wrap gap-1.5 justify-center">
                                                {product.sizes.map((size: string) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSizes(prev => ({
                                                            ...prev,
                                                            [product.id]: prev[product.id] === size ? '' : size
                                                        }))}
                                                        className={`px-2.5 py-1 text-xs border rounded transition-all duration-150 ${
                                                            selectedSizes[product.id] === size
                                                                ? 'bg-black text-white border-black font-bold'
                                                                : 'border-gray-300 text-gray-600 hover:border-black'
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {!product.sold_out ? (
                                        <Button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium tracking-wide py-3 text-sm"
                                        >
                                            AJOUTER AU PANIER
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled
                                            className="w-full bg-gray-200 text-gray-400 cursor-not-allowed font-medium tracking-wide py-3 text-sm"
                                        >
                                            ÉPUISÉ
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-black text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center mb-6">
                        <Image src="/nonstop-logo.png" alt="Nonstop" width={60} height={60} className="h-12 w-auto" />
                    </div>
                    <div className="mb-4 flex justify-center gap-6">
                        <a
                            href="https://www.instagram.com/nonstop__sn/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <Instagram className="h-5 w-5" />
                            @nonstop__sn
                        </a>
                    </div>
                    <p className="text-sm text-gray-400">© 2025 Nonstop. Tous droits réservés.</p>
                    <p className="text-xs text-gray-500 mt-2">
                        Réalisé par <a href="https://github.com/mactar27" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">wocky</a>
                    </p>
                </div>
            </footer>
            <Toaster />
        </div>
    )
}
