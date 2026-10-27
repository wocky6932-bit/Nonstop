'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingBag, ArrowLeft, ArrowRight, ExternalLink, Check } from 'lucide-react'
import { Product, useCart } from '@/lib/cart-context'
import { useToast } from '@/hooks/use-toast'
import { useCurrency } from '@/lib/currency-context'
import { getValidImageUrl } from '@/lib/image-utils'
import { HangerIcon } from './hanger-icon'

interface ProductRackDetailProps {
  product: Product | null
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
}

export function ProductRackDetail({
  product,
  onClose,
  onNext,
  onPrev,
}: ProductRackDetailProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { convertPrice, formatPrice } = useCurrency()

  // État DEVANT / DOS (Front / Back)
  const [viewSide, setViewSide] = useState<'FRONT' | 'BACK'>('FRONT')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [isAdding, setIsAdding] = useState(false)

  // Réinitialiser les sélections lors de l'ouverture d'un nouveau vêtement
  useEffect(() => {
    setViewSide('FRONT')
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0])
      } else {
        setSelectedSize('')
      }
      if (product.variant_options && product.variant_options.length > 0) {
        setSelectedVariant(product.variant_options[0])
      } else {
        setSelectedVariant('')
      }
    }
  }, [product?.id])

  // Raccourcis clavier (Echap = fermer, Flèches = navigation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && onNext) onNext()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  if (!product) return null

  // RÈGLE STRICTE SUR LES IMAGES RECTO / VERSO (FRONT / BACK)
  const frontImage = getValidImageUrl(product.image, '/placeholder.jpg')
  
  const hasMultipleImages = Boolean(
    product.images &&
    Array.isArray(product.images) &&
    product.images.length > 1 &&
    product.images[1] &&
    product.images[1] !== product.images[0]
  )
  const backImage = hasMultipleImages ? getValidImageUrl(product.images![1], '') : ''
  const hasBackImage = Boolean(hasMultipleImages && backImage && backImage !== frontImage)

  const displayPrice = convertPrice(product.price, product.currency)
  const formattedPrice = formatPrice(displayPrice)

  const handleAddToCart = () => {
    if (product.sold_out) return

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: 'Choisissez une taille',
        description: `Veuillez sélectionner une taille avant d'ajouter ${product.name}`,
        variant: 'destructive',
      })
      return
    }

    if (product.variant_options && product.variant_options.length > 0 && !selectedVariant) {
      toast({
        title: 'Choisissez une coupe',
        description: `Veuillez sélectionner une option pour ${product.name}`,
        variant: 'destructive',
      })
      return
    }

    setIsAdding(true)

    addToCart({
      ...product,
      selectedSize: selectedSize || undefined,
      selectedVariant: selectedVariant || undefined,
    }, 1)

    toast({
      title: product.is_preorder ? 'Pré-commande ajoutée' : 'Ajouté au panier',
      description: `${product.name}${selectedSize ? ` — Taille ${selectedSize}` : ''}${selectedVariant ? ` (${selectedVariant})` : ''}`,
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 600)
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-md transition-opacity select-none"
      onClick={onClose}
    >
      {/* Conteneur Focus (Structure exacte .focus / .focus-anchor / .fg-card de Snug Wrld) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#f7f5ef] text-neutral-900 rounded-xl shadow-2xl overflow-hidden border border-neutral-300 flex flex-col md:flex-row max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label={`Détails de ${product.name}`}
      >
        {/* Bouton fermeture rond */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-white/90 hover:bg-neutral-950 hover:text-white transition-colors duration-200 shadow-md border border-neutral-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Flèches de navigation circulaire (.focus-arrow l / r) */}
        {onPrev && (
          <button
            onClick={onPrev}
            aria-label="Article précédent"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/90 hover:bg-neutral-950 hover:text-white transition-colors duration-200 shadow-lg border border-neutral-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            aria-label="Article suivant"
            className="hidden md:flex absolute right-14 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/90 hover:bg-neutral-950 hover:text-white transition-colors duration-200 shadow-lg border border-neutral-300"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* ZONE GAUCHE : VÊTEMENT AVEC ROTATION 3D DEVANT / DOS (FLIP 3D SNUG WRLD) */}
        <div className="relative md:w-1/2 p-6 flex flex-col items-center justify-between bg-[#eae6dc]/70 border-b md:border-b-0 md:border-r border-neutral-300">
          {/* Cintre suspendu */}
          <div className="w-48 mb-2 flex justify-center">
            <HangerIcon className="w-44 h-16 text-neutral-800 drop-shadow-sm" />
          </div>

          {/* Vêtement en 3D Flip (Perspective front / back avec rotateY(180deg)) */}
          <div 
            className="relative w-full aspect-[4/5] max-h-[350px] flex items-center justify-center"
            style={{ perspective: '1200px' }}
          >
            <div 
              className="relative w-full h-full transition-transform duration-700 ease-in-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: viewSide === 'BACK' ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* FACE DEVANT (FRONT) */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Image
                  src={frontImage}
                  alt={`${product.name} - Devant`}
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  className="object-contain drop-shadow-md"
                  priority
                />
              </div>

              {/* FACE DOS (BACK) : Uniquement si une vraie image verso existe */}
              {hasBackImage && (
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <Image
                    src={backImage}
                    alt={`${product.name} - Dos`}
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    className="object-contain drop-shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SÉLECTEUR SEGMENTÉ DEVANT / DOS (.seg avec .seg-knob type Snug Wrld) */}
          <div className="mt-4 flex items-center">
            {hasBackImage ? (
              <div className="relative inline-flex rounded-full bg-neutral-950 p-1 shadow-inner border border-neutral-800">
                {/* Knob coulissant */}
                <span
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#d2f831] rounded-full transition-all duration-300 ease-out shadow-xs"
                  style={{
                    left: viewSide === 'FRONT' ? '4px' : 'calc(50%)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setViewSide('FRONT')}
                  className={`relative z-10 px-5 py-1 text-xs font-black tracking-widest uppercase transition-colors duration-200 ${
                    viewSide === 'FRONT' ? 'text-neutral-950' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  DEVANT
                </button>
                <button
                  type="button"
                  onClick={() => setViewSide('BACK')}
                  className={`relative z-10 px-5 py-1 text-xs font-black tracking-widest uppercase transition-colors duration-200 ${
                    viewSide === 'BACK' ? 'text-neutral-950' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  DOS
                </button>
              </div>
            ) : (
              <span className="text-[10px] tracking-wider uppercase font-bold text-neutral-600 bg-neutral-200/90 px-3.5 py-1 rounded-full border border-neutral-300">
                VUE FACE UNIQUE
              </span>
            )}
          </div>
        </div>

        {/* ZONE DROITE : INFORMATIONS PRODUIT & COMMANDE (.focus-info) */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Statuts */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-widest font-black text-neutral-500">
                NONSTOP STUDIO
              </span>
              {product.sold_out && (
                <span className="bg-neutral-950 text-white text-[9px] px-2 py-0.5 tracking-wider uppercase font-bold rounded-xs">
                  SOLD OUT
                </span>
              )}
              {product.is_preorder && !product.sold_out && (
                <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 tracking-wider uppercase font-bold rounded-xs">
                  PRÉCOMMANDE
                </span>
              )}
            </div>

            {/* Nom exact du produit (.info-name) */}
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 mb-2">
              {product.name}
            </h2>

            {/* Prix réel en FCFA */}
            <div className="text-xl sm:text-2xl font-black font-mono text-neutral-950 mb-4">
              {formattedPrice}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-xs text-neutral-600 leading-relaxed mb-5">
                {product.description}
              </p>
            )}

            {/* Sélecteur de Variantes (Cropped / Non cropped) */}
            {product.variant_options && product.variant_options.length > 0 && (
              <div className="mb-5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-800 mb-2">
                  Coupe / Modèle
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variant_options.map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all ${
                        selectedVariant === variant
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sélecteur de Tailles */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-neutral-800">
                    Taille disponible
                  </label>
                  {selectedSize && (
                    <span className="text-[10px] text-neutral-500 font-mono font-medium">
                      Choisie : {selectedSize}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[42px] h-9 px-3 text-xs font-black uppercase tracking-wider rounded-xs border transition-all ${
                        selectedSize === size
                          ? 'bg-neutral-950 text-white border-neutral-950 ring-1 ring-neutral-950'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-950'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Boutons d'action (.info-cta) */}
          <div className="pt-4 border-t border-neutral-300 flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.sold_out || isAdding}
              className={`w-full py-3.5 px-6 rounded-xs font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-200 ${
                product.sold_out
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : product.is_preorder
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-98'
                  : 'bg-neutral-950 hover:bg-neutral-800 text-white shadow-md active:scale-98'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-4 h-4 text-lime-400" />
                  <span>AJOUTÉ AU PANIER !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {product.sold_out
                      ? 'ARTICLE ÉPUISÉ'
                      : product.is_preorder
                      ? 'PRÉCOMMANDER CET ARTICLE'
                      : 'AJOUTER AU PANIER'}
                  </span>
                </>
              )}
            </button>

            <Link
              href={`/shop/${product.id}`}
              className="text-center text-[10px] tracking-widest uppercase font-bold text-neutral-600 hover:text-neutral-950 pt-1 flex items-center justify-center gap-1"
            >
              Voir la fiche détaillée complète ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
