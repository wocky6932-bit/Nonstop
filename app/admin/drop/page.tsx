'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ImageIcon, Loader2, Plus, Save, Trash2, X, Clock, Eye } from 'lucide-react'
import { DropConfig, DropProduct, DEFAULT_DROP_CONFIG, normalizeDropConfig } from '@/lib/drop-config'
import { compressImage, getValidImageUrl } from '@/lib/image-utils'

const STANDARD_SIZES = ['TU', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function AdminDropPage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const [form, setForm] = useState<DropConfig>(DEFAULT_DROP_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [newCategoryInput, setNewCategoryInput] = useState('')

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
    try {
      setLoading(true)
      const res = await fetch('/api/admin/site-config?key=drop_config')
      if (res.ok) {
        const data = await res.json()
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          setForm(normalizeDropConfig(data))
        } else {
          setForm(DEFAULT_DROP_CONFIG)
        }
      }
    } catch (err) {
      console.error('Erreur chargement drop config:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'drop_config', value: form })
      })

      if (!res.ok) throw new Error('Erreur de sauvegarde')
      alert('Drop et compte à rebours mis à jour avec succès !')
    } catch (err) {
      console.error(err)
      alert('Échec de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  const handleProductImageUpload = async (productIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingIndex(productIndex)
    try {
      let fileToUpload: Blob | File = file
      if (file.type.startsWith('image/')) {
        try {
          fileToUpload = await compressImage(file, 1000, 1000, 0.75)
        } catch (e) {
          console.warn('Compression ignorée:', e)
        }
      }

      const formData = new FormData()
      formData.append('file', fileToUpload, file.name)

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Upload image impossible')
      const data = await res.json()

      setForm((prev) => ({
        ...prev,
        products: prev.products.map((p, idx) => {
          if (idx !== productIndex) return p
          return {
            ...p,
            image: data.url,
            images: [data.url]
          }
        })
      }))
    } catch (err) {
      console.error(err)
      alert("Échec de l'upload de l'image.")
    } finally {
      setUploadingIndex(null)
      if (event.target) event.target.value = ''
    }
  }

  const addProduct = () => {
    const newProd: DropProduct = {
      id: `drop-prod-${Date.now()}`,
      name: `NOUVEAU PRODUIT ${form.products.length + 1}`,
      subtitle: '',
      description: '',
      image: '/placeholder.jpg',
      images: ['/placeholder.jpg'],
      price: 11000,
      currency: 'CFA',
      sizes: ['S', 'M', 'L', 'XL'],
      statusText: 'Coming soon',
      badge: 'DROP 1',
      is_preorder: true
    }

    setForm((prev) => ({
      ...prev,
      products: [...prev.products, newProd]
    }))
  }

  const removeProduct = (index: number) => {
    if (!confirm('Voulez-vous supprimer ce produit du drop ?')) return
    setForm((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }))
  }

  const toggleSize = (productIndex: number, size: string) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.map((p, idx) => {
        if (idx !== productIndex) return p
        const sizes = p.sizes.includes(size)
          ? p.sizes.filter((s) => s !== size)
          : [...p.sizes, size]
        return { ...p, sizes: sizes.length > 0 ? sizes : ['M'] }
      })
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Barre supérieure */}
      <div className="sticky top-0 z-40 bg-white border-b px-4 py-4 sm:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                Voir sur le site
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-black text-white hover:bg-neutral-800 gap-2"
              size="sm"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 pt-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>DROP & COMPTE À REBOURS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
            Gestion du Drop & Lancement
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Configurez la date du compte à rebours, les visuels des articles et autorisez ou non les précommandes directes.
          </p>
        </div>

        <div className="space-y-8">
          {/* Section Paramètres Généraux */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-black border-b pb-3">
              1. Paramètres du Compte à Rebours
            </h2>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div>
                <p className="font-bold text-sm text-black uppercase tracking-wide">Activer le Drop sur l'accueil</p>
                <p className="text-xs text-neutral-500">Affiche ou masque la section Drop & compte à rebours</p>
              </div>
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
                className="h-5 w-5 accent-black rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tagline" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Tagline haut
                </Label>
                <Input
                  id="tagline"
                  value={form.tagline}
                  onChange={(e) => setForm((prev) => ({ ...prev, tagline: e.target.value }))}
                  placeholder="DROP 1 · COMING SOON"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dateLabel" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Libellé date affiché
                </Label>
                <Input
                  id="dateLabel"
                  value={form.dateLabel}
                  onChange={(e) => setForm((prev) => ({ ...prev, dateLabel: e.target.value }))}
                  placeholder="08/12/26 19:00 GMT"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="targetDate" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Date & Heure cible du Compte à Rebours (ISO)
              </Label>
              <Input
                id="targetDate"
                value={form.targetDate}
                onChange={(e) => setForm((prev) => ({ ...prev, targetDate: e.target.value }))}
                placeholder="2026-12-08T19:00:00Z"
                className="mt-1"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Format standard ISO (ex : 2026-12-08T19:00:00Z pour le 8 décembre 2026 à 19h00).
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div>
                <p className="font-bold text-sm text-black uppercase tracking-wide">Autoriser les Précommandes directes</p>
                <p className="text-xs text-neutral-500">Permet aux clients de choisir leur taille et de réserver le produit</p>
              </div>
              <input
                type="checkbox"
                checked={form.allowPreorder}
                onChange={(e) => setForm((prev) => ({ ...prev, allowPreorder: e.target.checked }))}
                className="h-5 w-5 accent-black rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Section Produits du Drop */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold uppercase tracking-wider text-black">
                2. Produits du Drop ({form.products.length})
              </h2>
              <Button onClick={addProduct} variant="outline" size="sm" className="gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" />
                Ajouter un produit
              </Button>
            </div>

            <div className="space-y-6">
              {form.products.map((product, pIndex) => (
                <div
                  key={product.id || pIndex}
                  className="p-5 rounded-lg border border-neutral-200 bg-neutral-50/50 relative space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-neutral-400">
                      PRODUIT #{pIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeProduct(pIndex)}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Colonne Image */}
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 block">
                        Image du vêtement
                      </Label>
                      <div className="relative aspect-square w-full rounded border bg-white overflow-hidden flex items-center justify-center p-2 mb-2">
                        <img
                          src={getValidImageUrl(product.image, '/placeholder.jpg')}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleProductImageUpload(pIndex, e)}
                          />
                          <span className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-bold border border-neutral-300 rounded bg-white hover:bg-neutral-100 transition-colors">
                            {uploadingIndex === pIndex ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5" />
                            )}
                            Changer l'image
                          </span>
                        </label>
                        <Input
                          value={product.image}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              products: prev.products.map((p, idx) =>
                                idx === pIndex ? { ...p, image: e.target.value } : p
                              )
                            }))
                          }
                          placeholder="/images/..."
                          className="text-xs font-mono h-8"
                        />
                      </div>
                    </div>

                    {/* Colonnes Infos */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                            Nom du produit
                          </Label>
                          <Input
                            value={product.name}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                products: prev.products.map((p, idx) =>
                                  idx === pIndex ? { ...p, name: e.target.value } : p
                                )
                              }))
                            }
                            placeholder="ex: LONG SLEEVES NS NOIR"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                            Sous-titre / Variante
                          </Label>
                          <Input
                            value={product.subtitle || ''}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                products: prev.products.map((p, idx) =>
                                  idx === pIndex ? { ...p, subtitle: e.target.value } : p
                                )
                              }))
                            }
                            placeholder="ex: Édition Collector • Noir Profond"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                            Prix (CFA)
                          </Label>
                          <Input
                            type="number"
                            value={product.price}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                products: prev.products.map((p, idx) =>
                                  idx === pIndex ? { ...p, price: Number(e.target.value) || 0 } : p
                                )
                              }))
                            }
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                            Badge
                          </Label>
                          <Input
                            value={product.badge || ''}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                products: prev.products.map((p, idx) =>
                                  idx === pIndex ? { ...p, badge: e.target.value } : p
                                )
                              }))
                            }
                            placeholder="DROP 1"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                            Statut affiché
                          </Label>
                          <Input
                            value={product.statusText || ''}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                products: prev.products.map((p, idx) =>
                                  idx === pIndex ? { ...p, statusText: e.target.value } : p
                                )
                              }))
                            }
                            placeholder="Coming soon"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* Tailles disponibles */}
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 block">
                          Tailles disponibles
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {STANDARD_SIZES.map((size) => {
                            const isChecked = product.sizes.includes(size)
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(pIndex, size)}
                                className={`px-3 py-1.5 rounded text-xs font-bold tracking-wider transition-colors ${
                                  isChecked
                                    ? 'bg-black text-white'
                                    : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100'
                                }`}
                              >
                                {size}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
