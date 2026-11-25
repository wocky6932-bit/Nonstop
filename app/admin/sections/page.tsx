'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ImageIcon, Loader2, Save, Eye, Plus, Trash2, Check, Sparkles } from 'lucide-react'
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
      alert('Toutes les sections et images de la page d’accueil ont été enregistrées avec succès !')
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
      enableMannequinToggle: true,
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
    if (!confirm('Supprimer cette collection de la page d’accueil ?')) return
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
                Voir le site
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-black text-white hover:bg-neutral-800 gap-2"
              size="sm"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer tout le site
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 pt-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest mb-2">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>GESTION COMPLÈTE DU SITE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
            Sections, Images & Textes de la page d'accueil
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Gérez toutes les sections du site : Grande bannière Hero, Collections Éditoriales, Produits et Visuels.
          </p>
        </div>

        <div className="space-y-8">
          {/* SECTION 1: HERO (BANNIÈRE PRINCIPALE HAUT) */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold uppercase tracking-wider text-black flex items-center gap-2">
                <Layers className="w-5 h-5" />
                1. Grande Bannière Hero (Haut de page)
              </h2>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase">
                <input
                  type="checkbox"
                  checked={form.hero.enabled}
                  onChange={(e) => setForm((prev) => ({ ...prev, hero: { ...prev.hero, enabled: e.target.checked } }))}
                  className="h-4 w-4 accent-black"
                />
                Activer
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Preview & Upload */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 block">
                  Image d'arrière-plan Hero
                </Label>
                <div className="relative aspect-[16/9] w-full rounded-lg border bg-neutral-100 overflow-hidden mb-3">
                  <img
                    src={getValidImageUrl(form.hero.image)}
                    alt="Hero Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                    <span className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-bold border border-neutral-300 rounded bg-white hover:bg-neutral-100 transition-colors">
                      {uploadingHero ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
                      Changer l'image Hero
                    </span>
                  </label>
                  <Input
                    value={form.hero.image}
                    onChange={(e) => setForm((prev) => ({ ...prev, hero: { ...prev.hero, image: e.target.value } }))}
                    placeholder="/images/..."
                    className="text-xs font-mono h-8"
                  />
                </div>
              </div>

              {/* Bouton et Liens */}
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Texte du Bouton</Label>
                  <Input
                    value={form.hero.buttonText}
                    onChange={(e) => setForm((prev) => ({ ...prev, hero: { ...prev.hero, buttonText: e.target.value } }))}
                    placeholder="DÉCOUVRIR LA COLLECTION"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Lien du Bouton</Label>
                  <Input
                    value={form.hero.buttonLink}
                    onChange={(e) => setForm((prev) => ({ ...prev, hero: { ...prev.hero, buttonLink: e.target.value } }))}
                    placeholder="/shop"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: DROP & COMPTE À REBOURS LIEN DIRECT */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-black">
                2. Drop & Compte à Rebours (Longues Manches)
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Gérez le compte à rebours, les 2 modèles de longues manches, les prix et les tailles.
              </p>
            </div>
            <Link href="/admin/drop">
              <Button className="bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider">
                Gérer le Drop →
              </Button>
            </Link>
          </div>

          {/* SECTION 3: NOS PRODUITS */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold uppercase tracking-wider text-black">
                3. Section "Nos Produits"
              </h2>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase">
                <input
                  type="checkbox"
                  checked={form.productsSection.enabled}
                  onChange={(e) => setForm((prev) => ({ ...prev, productsSection: { ...prev.productsSection, enabled: e.target.checked } }))}
                  className="h-4 w-4 accent-black"
                />
                Activer
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Titre Principal</Label>
                <Input
                  value={form.productsSection.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, productsSection: { ...prev.productsSection, title: e.target.value } }))}
                  placeholder="NOS PRODUITS"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Sous-titre</Label>
                <Input
                  value={form.productsSection.subtitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, productsSection: { ...prev.productsSection, subtitle: e.target.value } }))}
                  placeholder="Découvrez tous nos articles"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: MULTIPLES COLLECTIONS ÉDITORIALES STYLE TOROM PARIS (VUE / MANNEQUIN) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SECTIONS ÉDITORIALES</span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900">
                  Collections & Bannières
                </h2>
                <p className="text-xs text-neutral-500">
                  Ajoutez autant de sections bannières + articles que vous le souhaitez sur la page d'accueil.
                </p>
              </div>

              <Button
                type="button"
                onClick={addEditorialCollection}
                className="bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Ajouter une section
              </Button>
            </div>

            {/* Liste de toutes les collections configurées */}
            {(() => {
              const collections = form.editorialCollections && form.editorialCollections.length > 0
                ? form.editorialCollections
                : [form.collectionSection]

              return collections.map((col, cIndex) => (
                <div key={col.id || cIndex} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-widest bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded">
                        SECTION #{cIndex + 1}
                      </span>
                      <h3 className="text-base font-bold uppercase tracking-wider text-black">
                        {col.title || 'Collection sans nom'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase">
                        <input
                          type="checkbox"
                          checked={col.enabled}
                          onChange={(e) => {
                            const updatedCols = [...collections]
                            updatedCols[cIndex] = { ...col, enabled: e.target.checked }
                            setForm((prev) => ({
                              ...prev,
                              editorialCollections: updatedCols,
                              collectionSection: updatedCols[0]
                            }))
                          }}
                          className="h-4 w-4 accent-black"
                        />
                        Activer
                      </label>

                      {collections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEditorialCollection(cIndex)}
                          className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-medium transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Bannière */}
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 block">
                        Grande Bannière Éditoriale Plein Écran
                      </Label>
                      <div className="relative aspect-[16/10] w-full rounded-lg border bg-neutral-100 overflow-hidden mb-3">
                        <img
                          src={getValidImageUrl(col.bannerImage)}
                          alt={col.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleCollectionBannerUpload(cIndex, e)}
                          />
                          <span className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-bold border border-neutral-300 rounded bg-white hover:bg-neutral-100 transition-colors">
                            {uploadingCollectionIndex === cIndex ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5" />
                            )}
                            Changer la photo bannière
                          </span>
                        </label>
                        <Input
                          value={col.bannerImage}
                          onChange={(e) => {
                            const updatedCols = [...collections]
                            updatedCols[cIndex] = { ...col, bannerImage: e.target.value }
                            setForm((prev) => ({
                              ...prev,
                              editorialCollections: updatedCols,
                              collectionSection: updatedCols[0]
                            }))
                          }}
                          placeholder="/images/..."
                          className="text-xs font-mono h-8"
                        />
                      </div>
                    </div>

                    {/* Paramètres Collection */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Titre de la Collection</Label>
                        <Input
                          value={col.title}
                          onChange={(e) => {
                            const updatedCols = [...collections]
                            updatedCols[cIndex] = { ...col, title: e.target.value }
                            setForm((prev) => ({
                              ...prev,
                              editorialCollections: updatedCols,
                              collectionSection: updatedCols[0]
                            }))
                          }}
                          placeholder="ex: NEW IN ou TARTAN ou ESSENTIELS"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Texte du Bouton de Bannière</Label>
                        <Input
                          value={col.buttonText || 'DÉCOUVRIR'}
                          onChange={(e) => {
                            const updatedCols = [...collections]
                            updatedCols[cIndex] = { ...col, buttonText: e.target.value }
                            setForm((prev) => ({
                              ...prev,
                              editorialCollections: updatedCols,
                              collectionSection: updatedCols[0]
                            }))
                          }}
                          placeholder="DÉCOUVRIR ou SHOP NOW"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Choix des produits affichés dans cette collection */}
                  <div className="pt-4 border-t border-neutral-200">
                    <Label className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 block">
                      Articles affichés sous cette bannière ({col.selectedProductIds?.length || 0} sélectionnés)
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 border rounded-lg bg-neutral-50/50">
                      {allProducts.map((p) => {
                        const isSelected = col.selectedProductIds?.includes(String(p.id))
                        return (
                          <div
                            key={p.id}
                            onClick={() => toggleCollectionProductId(cIndex, String(p.id))}
                            className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center gap-2.5 ${
                              isSelected
                                ? 'border-black bg-white shadow-xs ring-1 ring-black'
                                : 'border-neutral-200 bg-white/60 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <div className="w-8 h-8 rounded bg-neutral-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                              <img src={getValidImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-black truncate">{p.name}</p>
                              <p className="text-[10px] text-neutral-500">{p.price} CFA</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-black flex-shrink-0" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
