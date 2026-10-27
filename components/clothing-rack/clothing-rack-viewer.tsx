'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ChevronLeft, ChevronRight, X, ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useToast } from '@/hooks/use-toast'

// Chargement différé côté client du canvas Three.js (sans blocage SSR)
const RackScene = dynamic(
  () => import('./rack-scene-3d').then((mod) => mod.RackScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[480px] sm:h-[540px] flex flex-col items-center justify-center bg-[#f6f4ef]">
        <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs uppercase font-bold tracking-widest text-neutral-500">
          Chargement du Studio 3D NONSTOPP...
        </span>
      </div>
    ),
  }
)

interface RackProduct {
  id: string
  name: string
  category: string
  price: number
  frontImage: string
  backImage?: string
  thumbnails: string[]
  sizes: string[]
  sold_out?: boolean
}

// Données réelles issues du catalogue NONSTOPP
const RACK_CATALOG: RackProduct[] = [
  {
    id: '1792616909279',
    name: 'Tee shirt tartan',
    category: 'T-SHIRT',
    price: 7000,
    frontImage: '/rack-test/tee-black-tartan.png',
    thumbnails: [
      '/rack-test/tee-black-tartan.png',
      '/rack-test/tee-white-nonstop.png',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sold_out: false,
  },
  {
    id: '1786383165433',
    name: 'Longue sleeves 2004',
    category: 'LONGUE SLEEVES',
    price: 12000,
    frontImage: '/rack-test/longsleeve-2004.png',
    thumbnails: [
      '/rack-test/longsleeve-2004.png',
      '/rack-test/tee-white-nonstop.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    sold_out: false,
  },
  {
    id: '1783729610841',
    name: 'T-shirt Classic White',
    category: 'T-SHIRT',
    price: 8000,
    frontImage: '/rack-test/tee-white-nonstop.png',
    thumbnails: [
      '/rack-test/tee-white-nonstop.png',
      '/rack-test/tee-black-tartan.png',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    sold_out: false,
  },
  {
    id: '1792639100833',
    name: 'Tee shirt tartan — Edition Limitée',
    category: 'T-SHIRT',
    price: 7000,
    frontImage: '/rack-test/tee-black-tartan.png',
    thumbnails: ['/rack-test/tee-black-tartan.png'],
    sizes: ['M', 'L', 'XL'],
    sold_out: false,
  },
  {
    id: '1791674451992',
    name: 'Longue sleeves Noir',
    category: 'LONGUE SLEEVES',
    price: 12000,
    frontImage: '/rack-test/longsleeve-2004.png',
    thumbnails: ['/rack-test/longsleeve-2004.png'],
    sizes: ['S', 'M', 'L', 'XL'],
    sold_out: false,
  },
]

export function ClothingRackViewer() {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [selectedProduct, setSelectedProduct] = useState<RackProduct | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('M')
  const [selectedThumb, setSelectedThumb] = useState<number>(0)
  const [activeSide, setActiveSide] = useState<'RECTO' | 'VERSO'>('RECTO')
  const [isAdding, setIsAdding] = useState(false)

  const activeProduct = RACK_CATALOG[activeIndex] || RACK_CATALOG[0]

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % RACK_CATALOG.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + RACK_CATALOG.length) % RACK_CATALOG.length)
  }

  const handleAddToCart = () => {
    const product = selectedProduct || activeProduct
    setIsAdding(true)

    // Intégration stricte au panier existant via useCart
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: 'XOF',
      image: product.frontImage,
      sold_out: Boolean(product.sold_out),
      sizes: product.sizes,
      selectedSize: selectedSize || product.sizes[0],
    }, 1)

    toast({
      title: 'Ajouté au panier',
      description: `${product.name} — Taille ${selectedSize || 'M'}`,
    })

    setTimeout(() => setIsAdding(false), 600)
  }

  return (
    <section className="relative w-full rounded-2xl overflow-hidden bg-[#f6f4ef] border border-neutral-300 shadow-sm my-6 select-none font-sans">
      {/* 1. SCÈNE 3D THREE.JS RÉALISTE */}
      <div className="relative w-full">
        <RackScene
          activeIndex={activeIndex}
          onSelectGarment={(idx) => {
            setActiveIndex(idx)
            setSelectedProduct(RACK_CATALOG[idx])
          }}
        />

        {/* Flèches de navigation en 3D */}
        <button
          onClick={handlePrev}
          aria-label="Article précédent"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-md border border-neutral-200 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Article suivant"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-md border border-neutral-200 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bouton Voir la disponibilité */}
        <div className="absolute bottom-5 inset-x-0 z-30 flex justify-center">
          <button
            onClick={() => setSelectedProduct(activeProduct)}
            className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg transition-all hover:scale-102 active:scale-98"
          >
            VOIR LA DISPONIBILITÉ →
          </button>
        </div>
      </div>

      {/* 2. PIED DE SHOWROOM ÉLÉGANT */}
      <div className="px-6 py-3 bg-[#eae7df] border-t border-neutral-300 flex items-center justify-between text-[10px] tracking-widest uppercase font-bold text-neutral-600">
        <span>STREETWEAR / SENEGAL</span>
        <span>NONSTOPP 3D STUDIO</span>
        <span>IT'S US, NEVER THEM</span>
      </div>

      {/* 3. FICHE PRODUIT IMMERSIVE AU CLIC (VUE DÉTAILLÉE + TAILLES + PANIER) */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white text-neutral-900 rounded-xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col md:flex-row max-h-[92vh] animate-in zoom-in-95 duration-200"
          >
            {/* Fermer */}
            <button
              onClick={() => setSelectedProduct(null)}
              aria-label="Fermer"
              className="absolute top-4 right-4 z-40 p-2 text-neutral-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* COLONNE GAUCHE : VIGNETTES + VÊTEMENT EN GRAND */}
            <div className="md:w-3/5 p-6 sm:p-8 flex items-center justify-between bg-[#fbfaf8] border-b md:border-b-0 md:border-r border-neutral-200">
              {/* Vignettes verticales */}
              <div className="flex flex-col gap-3 mr-4">
                {selectedProduct.thumbnails.map((thumb, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedThumb(i)}
                    className={`w-14 h-16 rounded-xs p-1 border transition-all flex items-center justify-center ${
                      selectedThumb === i
                        ? 'border-neutral-900 ring-1 ring-neutral-900 bg-white shadow-xs'
                        : 'border-neutral-200 opacity-60 hover:opacity-100 bg-neutral-50'
                    }`}
                  >
                    <Image src={thumb} alt="Vignette" width={48} height={48} className="object-contain" />
                  </button>
                ))}
              </div>

              {/* Visuel central */}
              <div className="flex-1 flex flex-col items-center">
                <div className="relative w-full aspect-square max-h-[340px] flex items-center justify-center">
                  <Image
                    src={selectedProduct.thumbnails[selectedThumb] || selectedProduct.frontImage}
                    alt={selectedProduct.name}
                    fill
                    sizes="400px"
                    className="object-contain drop-shadow-md"
                    priority
                  />
                </div>

                {/* Bouton < RECTO | VERSO > */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="inline-flex rounded-full bg-neutral-950 p-1">
                    <button
                      onClick={() => setActiveSide('RECTO')}
                      className={`px-4 py-1 text-xs font-bold uppercase rounded-full tracking-wider transition-colors ${
                        activeSide === 'RECTO' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      RECTO
                    </button>
                    <button
                      onClick={() => setActiveSide('VERSO')}
                      className={`px-4 py-1 text-xs font-bold uppercase rounded-full tracking-wider transition-colors ${
                        activeSide === 'VERSO' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      VERSO
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* COLONNE DROITE : DÉTAILS, PRIX, TAILLES ET PANIER */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                  {selectedProduct.category}
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 mt-1 mb-2">
                  {selectedProduct.name}
                </h2>
                <div className="text-xl font-bold font-mono text-neutral-900 mb-6">
                  {selectedProduct.price.toLocaleString()} CFA
                </div>

                {/* Sélecteur de Tailles */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-neutral-700 mb-2">
                    Taille
                  </label>
                  <div className="flex gap-2">
                    {selectedProduct.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`w-10 h-10 rounded-xs text-xs font-bold uppercase border transition-all ${
                          selectedSize === s
                            ? 'bg-neutral-950 text-white border-neutral-950'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bouton Ajouter au Panier */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full py-3.5 px-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4 text-lime-400" />
                      <span>AJOUTÉ !</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>AJOUTER AU PANIER</span>
                    </>
                  )}
                </button>

                <div className="mt-3 text-center">
                  <a
                    href={`/shop/${selectedProduct.id}`}
                    className="text-xs font-semibold text-neutral-600 hover:text-black underline underline-offset-4"
                  >
                    Voir les détails →
                  </a>
                </div>
              </div>

              {/* Rassurance */}
              <div className="pt-6 border-t border-neutral-100 flex flex-col gap-2 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-700" />
                  <span>Disponible en stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-neutral-700" />
                  <span>Livraison rapide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
