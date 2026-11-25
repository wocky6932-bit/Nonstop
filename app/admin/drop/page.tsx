'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Clock,
  Eye,
  Check,
  Zap,
  Calendar
} from 'lucide-react'
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
      alert('Modifications du drop enregistrées avec succès !')
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
      statusText: form.saleMode === 'instant' ? 'En stock' : 'Coming soon',
      badge: 'DROP 1',
      is_preorder: true
    }

    setForm((prev) => ({
      ...prev,
      products: [...prev.products, newProd]
    }))
  }

  const removeProduct = (index: number) => {
    if (!confirm('Supprimer ce produit du drop ?')) return
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

  // Convertit format ISO vers "YYYY-MM-DDTHH:mm" pour l'input datetime-local
  const getDatetimeInputValue = (isoStr: string) => {
    try {
      const d = new Date(isoStr)
      if (isNaN(d.getTime())) return ''
      // Format local YYYY-MM-DDTHH:mm
      const pad = (n: number) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    } catch {
      return ''
    }
  }

  const handleDatetimeChange = (value: string) => {
    if (!value) return
    const d = new Date(value)
    if (!isNaN(d.getTime())) {
      const pad = (n: number) => String(n).padStart(2, '0')
      const formattedLabel = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(-2)} ${pad(d.getHours())}:${pad(d.getMinutes())} GMT`
      setForm((prev) => ({
        ...prev,
        targetDate: d.toISOString(),
        dateLabel: formattedLabel
      }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-black" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-neutral-900 pb-28">
      {/* ── HEADER MODERNE STICKY AVEC BOUTON ENREGISTRER ULTRA CLAIR ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 py-3 shadow-xs">
        <div className="container mx-auto flex items-center justify-between max-w-3xl">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Tableau de bord</span>
            <span className="sm:hidden">Retour</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm" className="h-9 px-3 text-xs gap-1.5 text-neutral-600 hover:text-black">
                <Eye className="h-3.5 w-3.5" />
                <span>Aperçu</span>
              </Button>
            </Link>

            {/* Bouton Enregistrer bien proportionné et lisible sur iPhone */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-9 px-4 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm gap-2"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>Enregistrer</span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── CONTENU PRINCIPAL ÉPURÉ & INTUITIF ── */}
      <main className="container mx-auto max-w-2xl px-4 pt-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
            Drop & Vente
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Choisissez si vous lancez la vente maintenant ou si vous affichez un compte à rebours.
          </p>
        </div>

        {/* ── 1. LE CHOIX PRINCIPAL : VENDRE MAINTENANT OU COMPTE À REBOURS ── */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-black uppercase tracking-wider text-black">
              1. Mode de Vente
            </Label>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-neutral-700">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
                className="w-4 h-4 accent-black rounded"
              />
              <span>Section active</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Option A: VENDRE MAINTENANT */}
            <button
              type="button"
              onClick={() => setForm((prev) => ({
                ...prev,
                saleMode: 'instant',
                tagline: 'DISPONIBLE MAINTENANT',
                dateLabel: 'EN STOCK · EXPÉDITION IMMÉDIATE',
                buttonText: 'ACHETER MAINTENANT'
              }))}
              className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between ${
                form.saleMode === 'instant'
                  ? 'bg-black text-white border-black shadow-sm ring-1 ring-black'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs uppercase tracking-wider">Vendre Maintenant</span>
                <span className={`w-2.5 h-2.5 rounded-full ${form.saleMode === 'instant' ? 'bg-emerald-400' : 'bg-neutral-300'}`} />
              </div>
              <p className={`text-[11px] leading-tight ${form.saleMode === 'instant' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Disponible tout de suite avec achat direct.
              </p>
            </button>

            {/* Option B: COMPTE À REBOURS */}
            <button
              type="button"
              onClick={() => setForm((prev) => ({
                ...prev,
                saleMode: 'countdown',
                tagline: 'DROP 1 · COMING SOON',
                dateLabel: '08/12/26 19:00 GMT',
                buttonText: 'PRÉCOMMANDER'
              }))}
              className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between ${
                (form.saleMode || 'countdown') === 'countdown'
                  ? 'bg-black text-white border-black shadow-sm ring-1 ring-black'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs uppercase tracking-wider">Compte à Rebours</span>
                <Clock className={`w-3.5 h-3.5 ${form.saleMode !== 'instant' ? 'text-white' : 'text-neutral-400'}`} />
              </div>
              <p className={`text-[11px] leading-tight ${form.saleMode !== 'instant' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Affiche le décompte des jours et heures.
              </p>
            </button>
          </div>

          {/* SÉLECTEUR DE DATE FACILE (Uniquement si compte à rebours) */}
          {form.saleMode !== 'instant' && (
            <div className="pt-2 border-t border-neutral-100 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 block">
                Date et Heure du Lancement
              </Label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={getDatetimeInputValue(form.targetDate)}
                  onChange={(e) => handleDatetimeChange(e.target.value)}
                  className="w-full h-11 px-3 text-xs font-semibold rounded-xl border border-neutral-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-black"
                />
              </div>
              <p className="text-[10px] text-neutral-500">
                Affiché sur le site : <span className="font-bold text-black">{form.dateLabel}</span>
              </p>
            </div>
          )}
        </div>

        {/* ── 2. LES VÊTEMENTS DU DROP ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-black uppercase tracking-wider text-black">
              2. Vêtements du Drop ({form.products.length})
            </Label>
            <Button
              type="button"
              onClick={addProduct}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-bold gap-1 rounded-lg border-neutral-300 hover:bg-neutral-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter</span>
            </Button>
          </div>

          {form.products.map((product, pIndex) => (
            <div
              key={product.id || pIndex}
              className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                  {pIndex + 1}
                </span>

                <span className="text-xs font-bold uppercase tracking-wider text-black truncate max-w-[180px]">
                  {product.name}
                </span>

                {form.products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(pIndex)}
                    className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Photo du vêtement */}
              <div>
                <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-2 block">
                  Photo du vêtement
                </Label>
                <div className="relative aspect-square max-w-[180px] mx-auto rounded-xl bg-neutral-50 overflow-hidden border border-neutral-200/80 p-2 mb-2 flex items-center justify-center">
                  <img
                    src={getValidImageUrl(product.image, '/placeholder.jpg')}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <label className="cursor-pointer block max-w-[220px] mx-auto">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleProductImageUpload(pIndex, e)}
                  />
                  <span className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-bold border border-neutral-300 rounded-xl bg-white hover:bg-neutral-50 active:scale-[0.99] transition-all shadow-2xs">
                    {uploadingIndex === pIndex ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-neutral-600" />
                    )}
                    <span>Remplacer la photo</span>
                  </span>
                </label>
              </div>

              {/* Nom & Prix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1 block">
                    Nom du vêtement
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
                    placeholder="Ex: Long sleeves noir"
                    className="h-10 text-xs font-semibold rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1 block">
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
                    placeholder="11000"
                    className="h-10 text-xs font-semibold rounded-xl"
                  />
                </div>
              </div>

              {/* Tailles sélectionnables en 1 tap */}
              <div className="pt-2 border-t border-neutral-100">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-2 block">
                  Tailles disponibles
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {STANDARD_SIZES.map((size) => {
                    const isSelected = product.sizes.includes(size)
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(pIndex, size)}
                        className={`h-8 px-3 rounded-lg text-xs font-bold tracking-wider transition-all ${
                          isSelected
                            ? 'bg-black text-white shadow-2xs'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
