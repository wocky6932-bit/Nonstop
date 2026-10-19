'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { getValidImageUrl } from '@/lib/image-utils'

export type ComingSoonConfig = {
  enabled: boolean
  title: string
  subtitle: string
  description: string
  ctaText: string
  image: string
  heroLabel: string
  heroSecondary: string
  visibleOnHome: boolean
  whatsappNumber: string
  launchDate: string
}

const defaultConfig: ComingSoonConfig = {
  enabled: true,
  title: 'COMING SOON',
  subtitle: 'TEE 01 / 02 — NOUVELLE COLLECTION',
  description: 'Deux coloris. Une seule identité. La prochaine collection NONSTOP arrive bientôt.',
  ctaText: 'PRÉCOMMANDER',
  image: '/images/nonstop_mac_wallpaper_v2.png',
  heroLabel: 'NONSTOP',
  heroSecondary: 'TEE 01 / 02',
  visibleOnHome: true,
  whatsappNumber: '',
  launchDate: ''
}

function PreorderModal({
  product,
  whatsappNumber,
  onClose
}: {
  product: any
  whatsappNumber: string
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [size, setSize] = useState(product?.sizes?.[0] || 'M')
  const [quantity, setQuantity] = useState(1)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const normalizedPhone = (whatsappNumber || '').replace(/\D/g, '')
    if (!name.trim() || !phone.trim() || !normalizedPhone) {
      alert('Merci de renseigner votre nom, votre WhatsApp et le numéro WhatsApp boutique configuré.')
      return
    }

    const message = [
      'Bonjour NONSTOP 👋',
      `Je souhaite précommander ${product?.name || 'un tee NONSTOP'}.`,
      `Modèle : ${product?.name || 'TEE'}`,
      `Taille : ${size}`,
      `Quantité : ${quantity}`,
      `Nom : ${name}`,
      `WhatsApp : ${phone}`,
      'Merci de me confirmer la disponibilité.'
    ].join('\n')

    const target = `https://api.whatsapp.com/send?phone=${encodeURIComponent(normalizedPhone)}&text=${encodeURIComponent(message)}`
    window.open(target, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-none border border-white/10 bg-[#111111] p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Précommande</p>
            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">{product?.name || 'TEE NONSTOP'}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 p-2 text-gray-300 transition hover:text-white" aria-label="Fermer la précommande">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-gray-400">Modèle</label>
            <input value={product?.name || ''} readOnly className="w-full border border-white/10 bg-transparent px-3 py-3 text-sm outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-gray-400">Taille</label>
              <select value={size} onChange={(event) => setSize(event.target.value)} className="w-full border border-white/10 bg-transparent px-3 py-3 text-sm outline-none">
                {(product?.sizes?.length ? product.sizes : ['S', 'M', 'L', 'XL']).map((item: string) => (
                  <option key={item} value={item} className="bg-black text-white">{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-gray-400">Quantité</label>
              <input type="number" min={1} max={10} value={quantity} onChange={(event) => setQuantity(Number(event.target.value) || 1)} className="w-full border border-white/10 bg-transparent px-3 py-3 text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-gray-400">Nom</label>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Votre nom" className="w-full border border-white/10 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-500" />
          </div>

          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-gray-400">WhatsApp</label>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+221 ..." className="w-full border border-white/10 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-500" />
          </div>

          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">Valider la précommande</Button>
        </form>
      </div>
    </div>
  )
}

export function ComingSoonSection({ config, products }: { config?: Partial<ComingSoonConfig>; products?: any[] }) {
  const mergedConfig = { ...defaultConfig, ...(config || {}) }
  const preorderProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : []
    return list.filter((product: any) => product.is_preorder === true || product.is_preorder === 1 || product.is_preorder === '1').slice(0, 2)
  }, [products])

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  if (!mergedConfig.enabled || !mergedConfig.visibleOnHome) return null

  const heroImage = getValidImageUrl(mergedConfig.image, defaultConfig.image)

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#0b0b0b] text-white">
        <div className="relative aspect-[16/11] w-full md:aspect-[21/9]">
          <Image
            src={heroImage}
            alt={mergedConfig.title || 'Coming Soon'}
            fill
            priority
            className="object-cover object-center"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex items-end p-4 md:p-10">
            <div className="w-full max-w-6xl mx-auto flex items-end justify-between gap-4">
              <div className="text-left">
                <span className="block text-[10px] font-medium uppercase tracking-[0.4em] text-white/80">{mergedConfig.heroLabel}</span>
                <span className="mt-2 block text-[10px] font-medium uppercase tracking-[0.4em] text-white/60">{mergedConfig.heroSecondary}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
          <p className="text-center text-[10px] font-medium uppercase tracking-[0.5em] text-white/70">{mergedConfig.title}</p>
          <h2 className="mt-4 text-center text-3xl font-black uppercase tracking-[-0.04em] text-white md:text-5xl">
            {mergedConfig.subtitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-6 text-white/75 md:text-base">
            {mergedConfig.description}
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              type="button"
              onClick={() => setSelectedProduct(preorderProducts[0] || null)}
              className="border border-white/15 bg-white px-8 py-6 text-[10px] font-medium uppercase tracking-[0.3em] text-black hover:bg-gray-200"
            >
              {mergedConfig.ctaText}
            </Button>
          </div>
        </div>
      </section>

      {preorderProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {preorderProducts.map((product: any) => {
              const productImage = getValidImageUrl(product.image || product.images?.[0] || '', '/images/nonstop_mac_wallpaper_v2.png')
              return (
                <article key={product.id} className="border border-black/10 bg-white p-3 sm:p-4">
                  <div className="overflow-hidden bg-neutral-100">
                    <div className="relative aspect-[4/5] w-full">
                      <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-black">{product.name}</h3>
                      <p className="mt-2 text-sm text-gray-600">{product.description || 'T-shirt NONSTOP en édition limitée.'}</p>
                    </div>
                    <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-gray-500">À confirmer</span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">Précommande</span>
                    <Button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="bg-black px-5 py-3 text-[10px] font-medium uppercase tracking-[0.25em] text-white hover:bg-neutral-800"
                    >
                      PRÉCOMMANDER
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {selectedProduct && (
        <PreorderModal
          product={selectedProduct}
          whatsappNumber={mergedConfig.whatsappNumber || ''}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
