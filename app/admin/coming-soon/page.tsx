'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ImageIcon, Save } from 'lucide-react'
import { normalizeComingSoonConfig } from '@/lib/coming-soon-config'

const defaultConfig = {
  enabled: true,
  title: 'COMING SOON',
  subtitle: 'TEE 01 / 02 — NOUVELLE COLLECTION',
  description: 'Deux coloris. Une seule identité. La prochaine collection NONSTOP arrive bientôt.',
  ctaText: 'PRÉCOMMANDER',
  image: '/coming-soon-cover.jpeg',
  heroLabel: 'NONSTOP',
  heroSecondary: 'TEE 01 / 02',
  visibleOnHome: true,
  whatsappNumber: '',
  launchDate: '',
  preorderProducts: [
    {
      id: 'tee-01-white',
      name: 'TEE 01 — WHITE',
      description: 'T-shirt blanc avec logo bleu et noir',
      image: '/tee-01-white.jpeg',
      is_preorder: true,
      sizes: ['S', 'M', 'L', 'XL'],
      price: 0,
      currency: 'XOF'
    },
    {
      id: 'tee-02-black',
      name: 'TEE 02 — BLACK',
      description: 'T-shirt noir avec logo bleu et blanc',
      image: '/tee-02-black.jpeg',
      is_preorder: true,
      sizes: ['S', 'M', 'L', 'XL'],
      price: 0,
      currency: 'XOF'
    }
  ]
}

export default function ComingSoonAdminPage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!sessionLoading && (!session || !session.isAdmin)) {
      router.push('/auth/login')
      return
    }

    if (session?.isAdmin) {
      fetchConfig()
    }
  }, [session, sessionLoading, router])

  const fetchConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/site-config?key=coming_soon')
      if (!response.ok) throw new Error('Configuration introuvable')
      const data = await response.json()
      const mergedConfig = normalizeComingSoonConfig(data || defaultConfig)
      setForm(mergedConfig)
    } catch (error) {
      console.error(error)
      setForm(defaultConfig)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'coming_soon', value: form })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }

      alert('Section Coming Soon enregistrée avec succès.')
    } catch (error) {
      console.error(error)
      alert('Impossible d’enregistrer la section pour le moment.')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload image impossible')
      }

      const data = await response.json()
      setForm((previous) => ({ ...previous, image: data.url }))
    } catch (error) {
      console.error(error)
      alert('Échec du chargement de l’image.')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handlePreorderImageUpload = async (productIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    try {
      const uploadedUrls: string[] = []

      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Upload image produit impossible')
        }

        const data = await response.json()
        uploadedUrls.push(data.url)
      }

      setForm((previous) => ({
        ...previous,
        preorderProducts: previous.preorderProducts.map((product, index) => {
          if (index !== productIndex) return product

          const currentImages = Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : product.image
              ? [product.image]
              : []

          const combinedImages = [...currentImages, ...uploadedUrls]

          return {
            ...product,
            images: combinedImages,
            image: combinedImages[0] || product.image || ''
          }
        })
      }))
    } catch (error) {
      console.error(error)
      alert('Échec du chargement de l’image du produit.')
    } finally {
      if (event.target) event.target.value = ''
    }
  }

  const addPreorderProduct = () => {
    setForm((previous) => ({
      ...previous,
      preorderProducts: [
        ...(previous.preorderProducts || []),
        {
          id: `custom-${Date.now()}`,
          name: `Produit ${((previous.preorderProducts || []).length + 1)}`,
          description: 'Nouvelle précommande',
          image: '',
          images: [],
          is_preorder: true,
          sizes: ['S', 'M', 'L', 'XL'],
          price: 0,
          currency: 'XOF'
        }
      ]
    }))
  }

  const removePreorderProduct = (productIndex: number) => {
    setForm((previous) => ({
      ...previous,
      preorderProducts: (previous.preorderProducts || []).filter((_, index) => index !== productIndex)
    }))
  }

  const removePreorderImage = (productIndex: number, imageIndex: number) => {
    setForm((previous) => ({
      ...previous,
      preorderProducts: previous.preorderProducts.map((product, index) => {
        if (index !== productIndex) return product

        const currentImages = Array.isArray(product.images) ? product.images : product.image ? [product.image] : []
        const nextImages = currentImages.filter((_, idx) => idx !== imageIndex)

        return {
          ...product,
          images: nextImages,
          image: nextImages[0] || ''
        }
      })
    }))
  }

  if (sessionLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  if (!session || !session.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Administration</p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">Coming Soon</h1>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-black text-white hover:bg-gray-800">
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>

        <div className="space-y-6 rounded-none border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 rounded-none border border-black/10 p-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em]">Afficher la section</p>
              <p className="text-xs text-gray-500">Désactiver complètement pour supprimer le Coming Soon</p>
            </div>
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(event) => setForm((previous) => ({ ...previous, enabled: event.target.checked }))}
              className="h-5 w-5"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input id="title" value={form.title} onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))} />
            </div>
            <div>
              <Label htmlFor="ctaText">Bouton principal</Label>
              <Input id="ctaText" value={form.ctaText} onChange={(event) => setForm((previous) => ({ ...previous, ctaText: event.target.value }))} />
            </div>
          </div>

          <div>
            <Label htmlFor="subtitle">Sous-titre</Label>
            <Input id="subtitle" value={form.subtitle} onChange={(event) => setForm((previous) => ({ ...previous, subtitle: event.target.value }))} />
          </div>

          <div>
            <Label htmlFor="description">Texte descriptif</Label>
            <textarea id="description" value={form.description} onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))} className="min-h-[110px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="heroLabel">Libellé du haut gauche</Label>
              <Input id="heroLabel" value={form.heroLabel} onChange={(event) => setForm((previous) => ({ ...previous, heroLabel: event.target.value }))} />
            </div>
            <div>
              <Label htmlFor="heroSecondary">Libellé du haut droit</Label>
              <Input id="heroSecondary" value={form.heroSecondary} onChange={(event) => setForm((previous) => ({ ...previous, heroSecondary: event.target.value }))} />
            </div>
          </div>

          <div className="rounded-none border border-black/10 bg-gray-50 p-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600">Parcours commande</p>
            <p className="mt-2 text-sm text-gray-700">
              Les précommandes utilisent le même parcours que les commandes classiques : ajout au panier puis checkout standard.
            </p>
          </div>

          <div>
            <Label htmlFor="launchDate">Date de lancement</Label>
            <Input id="launchDate" type="date" value={form.launchDate} onChange={(event) => setForm((previous) => ({ ...previous, launchDate: event.target.value }))} />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-none border border-black/10 p-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em]">Afficher sur l’accueil</p>
            </div>
            <input
              type="checkbox"
              checked={form.visibleOnHome}
              onChange={(event) => setForm((previous) => ({ ...previous, visibleOnHome: event.target.checked }))}
              className="h-5 w-5"
            />
          </div>

          <div className="space-y-3">
            <Label>Image principale</Label>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Importer une image
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <span className="text-xs text-gray-500">Utilisez une vraie image provenant du produit ou de la collection.</span>
            </div>

            <div>
              <Label htmlFor="coverImageUrl">URL de l’image de couverture</Label>
              <Input
                id="coverImageUrl"
                value={form.image || ''}
                onChange={(event) => setForm((previous) => ({ ...previous, image: event.target.value }))}
                placeholder="https://... ou /coming-soon-cover.jpeg"
              />
            </div>

            {form.image && (
              <div className="overflow-hidden border border-black/10 bg-neutral-100">
                <img
                  src={form.image}
                  alt="Preview Coming Soon"
                  className="h-48 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = '/coming-soon-cover.jpeg'
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em]">Produits précommande</p>
              <Button type="button" variant="outline" onClick={addPreorderProduct} className="h-9">
                + Ajouter un produit
              </Button>
            </div>

            {(form.preorderProducts || []).map((product, index) => (
              <div key={product.id || index} className="rounded-none border border-black/10 p-4">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium uppercase tracking-[0.2em]">{product.name || `Produit ${index + 1}`}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removePreorderProduct(index)}
                      className="text-xs uppercase tracking-[0.2em] text-red-600"
                    >
                      Supprimer
                    </button>
                    <label className="cursor-pointer text-xs uppercase tracking-[0.2em] text-gray-600">
                      Ajouter images
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(event) => handlePreorderImageUpload(index, event)}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Nom</Label>
                    <Input
                      value={product.name}
                      onChange={(event) => setForm((previous) => ({
                        ...previous,
                        preorderProducts: previous.preorderProducts.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, name: event.target.value } : item
                        )
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Prix</Label>
                    <Input
                      type="number"
                      min="0"
                      value={Number(product.price ?? 0)}
                      onChange={(event) => setForm((previous) => ({
                        ...previous,
                        preorderProducts: previous.preorderProducts.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, price: Number(event.target.value || 0) } : item
                        )
                      }))}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Devise</Label>
                    <Input
                      value={product.currency || 'XOF'}
                      onChange={(event) => setForm((previous) => ({
                        ...previous,
                        preorderProducts: previous.preorderProducts.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, currency: event.target.value.toUpperCase() } : item
                        )
                      }))}
                    />
                  </div>
                  <div>
                    <Label>URL image</Label>
                    <Input
                      value={product.image || ''}
                      onChange={(event) => setForm((previous) => ({
                        ...previous,
                        preorderProducts: previous.preorderProducts.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, image: event.target.value } : item
                        )
                      }))}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Description</Label>
                  <textarea
                    value={product.description}
                    onChange={(event) => setForm((previous) => ({
                      ...previous,
                      preorderProducts: previous.preorderProducts.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, description: event.target.value } : item
                      )
                    }))}
                    className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                  />
                </div>

                {(Array.isArray(product.images) && product.images.length > 0 ? product.images : product.image ? [product.image] : []).map((image, imageIndex) => (
                  <div key={`${product.id || index}-image-${imageIndex}`} className="mt-4 overflow-hidden border border-black/10 bg-neutral-100">
                    <div className="relative">
                      <img src={image} alt={`${product.name} ${imageIndex + 1}`} className="h-52 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePreorderImage(index, imageIndex)}
                        className="absolute right-2 top-2 rounded bg-black/80 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
