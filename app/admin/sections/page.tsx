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
  Save,
  Eye,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Zap
} from 'lucide-react'
import { SiteHomepageConfig, EditorialCollection, DEFAULT_HOMEPAGE_CONFIG, normalizeHomepageConfig } from '@/lib/homepage-config'
import { compressImage, getValidImageUrl } from '@/lib/image-utils'

export default function AdminHomepageSectionsPage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const [form, setForm] = useState<SiteHomepageConfig>(DEFAULT_HOMEPAGE_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingCollectionIndex, setUploadingCollectionIndex] = useState<number | null>(null)
  const [allProducts, setAllProducts] = useState<any[]>([])

  // Onglet ou vue simplifiée (Général vs Collections)
  const [activeTab, setActiveTab] = useState<'collections' | 'hero'>('collections')

  useEffect(() => {
    if (!sessionLoading && (!session || !session.isAdmin)) {
      router.push('/auth/login')
      return
    }

    if (session?.isAdmin) {
      loadData()
    }
  }, [session, sessionLoading, router])

  const loadData = async () => {
    try {
      setLoading(true)
      const [configRes, prodsRes] = await Promise.all([
        fetch('/api/admin/site-config?key=homepage_config'),
        fetch('/api/admin/products')
      ])

      if (configRes.ok) {
        const configData = await configRes.json()
        if (configData && typeof configData === 'object' && Object.keys(configData).length > 0) {
          setForm(normalizeHomepageConfig(configData))
        } else {
          setForm(DEFAULT_HOMEPAGE_CONFIG)
        }
      }

      if (prodsRes.ok) {
        const prods = await prodsRes.json()
        setAllProducts(Array.isArray(prods) ? prods : [])
      }
    } catch (err) {
      console.error('Erreur chargement configuration homepage:', err)
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
        body: JSON.stringify({ key: 'homepage_config', value: form })
      })

      if (!res.ok) throw new Error('Erreur de sauvegarde')
      alert('Modifications enregistrées avec succès !')
    } catch (err) {
      console.error(err)
      alert('Échec de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingHero(true)
    try {
      let fileToUpload: Blob | File = file
      if (file.type.startsWith('image/')) {
        try {
          fileToUpload = await compressImage(file, 1920, 1080, 0.8)
        } catch (err) {
          console.warn('Compression ignorée:', err)
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
        hero: {
          ...prev.hero,
          image: data.url
        }
      }))
    } catch (err) {
      console.error(err)
      alert("Échec de l'upload de l'image de couverture Hero.")
    } finally {
      setUploadingHero(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleCollectionBannerUpload = async (collectionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCollectionIndex(collectionIndex)
    try {
      let fileToUpload: Blob | File = file
      if (file.type.startsWith('image/')) {
        try {
          fileToUpload = await compressImage(file, 1920, 1080, 0.8)
        } catch (err) {
          console.warn('Compression ignorée:', err)
        }
      }

      const formData = new FormData()
      formData.append('file', fileToUpload, file.name)

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Upload bannière collection impossible')
      const data = await res.json()

      setForm((prev) => {
        const collections = [...(prev.editorialCollections || [prev.collectionSection])]
        if (collections[collectionIndex]) {
          collections[collectionIndex] = {
            ...collections[collectionIndex],
            bannerImage: data.url
          }
        }
        return {
          ...prev,
          editorialCollections: collections,
          collectionSection: collections[0] || prev.collectionSection
        }
      })
    } catch (err) {
      console.error(err)
      alert("Échec de l'upload de la bannière collection.")
    } finally {
      setUploadingCollectionIndex(null)
      if (e.target) e.target.value = ''
    }
  }

  const toggleCollectionProductId = (collectionIndex: number, productId: string) => {
    setForm((prev) => {
      const collections = [...(prev.editorialCollections || [prev.collectionSection])]
      const targetCol = collections[collectionIndex]
      if (!targetCol) return prev

      const current = targetCol.selectedProductIds || []
      const updated = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]

      collections[collectionIndex] = {
        ...targetCol,
        selectedProductIds: updated
      }

      return {
        ...prev,
        editorialCollections: collections,
        collectionSection: collections[0] || prev.collectionSection
      }
    })
  }

  const addEditorialCollection = () => {
    const newCol: EditorialCollection = {
      id: `collection-${Date.now()}`,
      enabled: true,
      title: 'NOUVELLE COLLECTION',
      bannerImage: '/images/collection-essentiels-banner.jpg',
      buttonText: 'DÉCOUVRIR',
      enableMannequinToggle: false,
      selectedProductIds: []
    }

    setForm((prev) => {
      const currentCols = prev.editorialCollections && prev.editorialCollections.length > 0
        ? prev.editorialCollections
        : [prev.collectionSection]
      const updated = [...currentCols, newCol]
      return {
        ...prev,
        editorialCollections: updated,
        collectionSection: updated[0]
      }
    })
  }

  const removeEditorialCollection = (index: number) => {
    if (!confirm('Supprimer cette section ?')) return
    setForm((prev) => {
      const currentCols = prev.editorialCollections && prev.editorialCollections.length > 0
        ? prev.editorialCollections
        : [prev.collectionSection]
      const updated = currentCols.filter((_, i) => i !== index)
      return {
        ...prev,
        editorialCollections: updated,
        collectionSection: updated[0] || DEFAULT_HOMEPAGE_CONFIG.collectionSection
      }
    })
  }

  const collections = form.editorialCollections && form.editorialCollections.length > 0
    ? form.editorialCollections
    : [form.collectionSection]

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-black" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-neutral-900 pb-28">
      {/* ── HEADER MODERNE STICKY & FLUIDE ───────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 py-3 sm:px-8 shadow-xs">
        <div className="container mx-auto flex items-center justify-between max-w-4xl">
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

      {/* ── CONTENU PRINCIPAL ───────────────────── */}
      <main className="container mx-auto max-w-3xl px-4 pt-6 sm:pt-8 space-y-6">
        {/* Titre & Description épurés */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
            Bannières & Collections
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Ajoutez et organisez simplement vos grandes photos de présentation et leurs articles.
          </p>
        </div>

        {/* ── ONGLET NAVIGATION RAPIDE ── */}
        <div className="flex items-center gap-2 p-1 bg-neutral-200/60 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('collections')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'collections'
                ? 'bg-white text-black shadow-xs'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            Collections ({collections.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'hero'
                ? 'bg-white text-black shadow-xs'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            Haut de Page (Hero)
          </button>
        </div>

        {/* ── ACCÈS DIRECT AU DROP ── */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-black" />
              Drop & Compte à rebours
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Articles à manches longues, prix et mode de vente (immédiat ou timer).
            </p>
          </div>
          <Link href="/admin/drop">
            <Button size="sm" variant="outline" className="h-8 px-3 text-xs font-bold uppercase tracking-wider border-neutral-300">
              Ouvrir le drop →
            </Button>
          </Link>
        </div>

        {/* ── VUE 1 : COLLECTIONS & BANNIÈRES ── */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            {collections.map((col, cIndex) => (
              <div
                key={col.id || cIndex}
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden transition-all"
              >
                {/* Header de la carte collection */}
                <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center">
                      {cIndex + 1}
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-black">
                      {col.title || 'Collection'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-neutral-700">
                      <input
                        type="checkbox"
                        checked={col.enabled}
                        onChange={(e) => {
                          const updated = [...collections]
                          updated[cIndex] = { ...col, enabled: e.target.checked }
                          setForm((prev) => ({
                            ...prev,
                            editorialCollections: updated,
                            collectionSection: updated[0]
                          }))
                        }}
                        className="w-4 h-4 accent-black rounded"
                      />
                      <span>Active</span>
                    </label>

                    {collections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEditorialCollection(cIndex)}
                        className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {/* Photo Bannière */}
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2 block">
                      Grande photo bannière
                    </Label>

                    <div className="relative aspect-[16/9] w-full rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200/80 mb-2.5">
                      <img
                        src={getValidImageUrl(col.bannerImage)}
                        alt={col.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleCollectionBannerUpload(cIndex, e)}
                      />
                      <span className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold border border-neutral-300 rounded-xl bg-white hover:bg-neutral-50 active:scale-[0.99] transition-all shadow-2xs">
                        {uploadingCollectionIndex === cIndex ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5 text-neutral-600" />
                        )}
                        <span>Remplacer la photo</span>
                      </span>
                    </label>
                  </div>

                  {/* Titre & Bouton côte à côte */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1 block">
                        Titre sur la bannière
                      </Label>
                      <Input
                        value={col.title}
                        onChange={(e) => {
                          const updated = [...collections]
                          updated[cIndex] = { ...col, title: e.target.value }
                          setForm((prev) => ({
                            ...prev,
                            editorialCollections: updated,
                            collectionSection: updated[0]
                          }))
                        }}
                        placeholder="Ex: TARTAN"
                        className="h-10 text-xs font-semibold rounded-xl"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1 block">
                        Texte du bouton
                      </Label>
                      <Input
                        value={col.buttonText || 'DÉCOUVRIR'}
                        onChange={(e) => {
                          const updated = [...collections]
                          updated[cIndex] = { ...col, buttonText: e.target.value }
                          setForm((prev) => ({
                            ...prev,
                            editorialCollections: updated,
                            collectionSection: updated[0]
                          }))
                        }}
                        placeholder="Ex: DÉCOUVRIR"
                        className="h-10 text-xs font-semibold rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Sélection des vêtements */}
                  <div className="pt-2 border-t border-neutral-100">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                        Articles à afficher ({col.selectedProductIds?.length || 0} sélectionnés)
                      </Label>
                      <span className="text-[10px] text-neutral-400">Cliquez pour cocher / décocher</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
                      {allProducts.map((p) => {
                        const isSelected = col.selectedProductIds?.includes(String(p.id))
                        return (
                          <div
                            key={p.id}
                            onClick={() => toggleCollectionProductId(cIndex, String(p.id))}
                            className={`p-2 rounded-lg border cursor-pointer select-none transition-all flex items-center gap-2 ${
                              isSelected
                                ? 'border-black bg-white ring-1 ring-black shadow-2xs'
                                : 'border-neutral-200 bg-white/70 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <div className="w-7 h-7 rounded bg-neutral-100 flex-shrink-0 overflow-hidden">
                              <img src={getValidImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-black truncate leading-tight">{p.name}</p>
                              <p className="text-[9px] text-neutral-500">{p.price} CFA</p>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-black flex-shrink-0" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Bouton pour rajouter une collection */}
            <button
              type="button"
              onClick={addEditorialCollection}
              className="w-full py-3.5 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-black bg-white hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-black shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ajouter une nouvelle bannière / collection</span>
            </button>
          </div>
        )}

        {/* ── VUE 2 : HERO (HAUT DE PAGE) ── */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-5 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-black">
                Bannière d'accueil du site
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.hero.enabled}
                  onChange={(e) => setForm((prev) => ({ ...prev, hero: { ...prev.hero, enabled: e.target.checked } }))}
                  className="w-4 h-4 accent-black rounded"
                />
                <span>Active</span>
              </label>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2 block">
                Photo principale
              </Label>
              <div className="relative aspect-[16/9] w-full rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200/80 mb-2.5">
                <img
                  src={getValidImageUrl(form.hero.image)}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              </div>

              <label className="cursor-pointer block">
                <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                <span className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold border border-neutral-300 rounded-xl bg-white hover:bg-neutral-50 active:scale-[0.99] transition-all shadow-2xs">
                  {uploadingHero ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5 text-neutral-600" />}
                  <span>Remplacer l'image Hero</span>
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1 block">
                  Texte du Bouton
                </Label>
                <Input
                  value={form.hero.buttonText}
                  onChange={(e) => setForm((prev) => ({ ...prev, hero: { ...prev.hero, buttonText: e.target.value } }))}
                  placeholder="DÉCOUVRIR LA COLLECTION"
                  className="h-10 text-xs font-semibold rounded-xl"
                />
              </div>

              <div>
                <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1 block">
                  Lien du Bouton
                </Label>
                <Input
                  value={form.hero.buttonLink}
                  onChange={(e) => setForm((prev) => ({ ...prev, hero: { ...prev.hero, buttonLink: e.target.value } }))}
                  placeholder="/shop"
                  className="h-10 text-xs font-semibold rounded-xl"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
