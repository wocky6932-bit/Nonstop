"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Plus, X, GripVertical } from 'lucide-react'
import { getValidImageUrl } from "@/lib/image-utils"

interface Product {
  id: string
  name: string
  price: number
  currency: string
  image: string
  images?: string[] // Array of image URLs for carousel
  category?: string // Product category for filtering
  soldOut: boolean
}

// Helper pour parser les images depuis MySQL (handles single & double JSON encoding)
const parseImages = (images: any): string[] => {
  console.log('🔧 parseImages input:', images, 'type:', typeof images)

  if (!images) return []

  if (Array.isArray(images)) {
    return images.filter(img => img && typeof img === 'string' && img.trim() !== '')
  }

  if (typeof images === 'string') {
    // Recursively parse until we get a real array or a plain non-JSON string
    let current: any = images
    for (let i = 0; i < 3; i++) {
      if (Array.isArray(current)) {
        const filtered = current.filter((img: any) => img && typeof img === 'string' && img.trim() !== '')
        console.log('🔧 Final parsed array:', filtered)
        return filtered
      }
      if (typeof current !== 'string') break
      try {
        current = JSON.parse(current)
      } catch {
        // Not valid JSON, treat as plain string path
        break
      }
    }
    // If after all parsing it's still a string, it's a single image path
    if (typeof current === 'string' && current.trim()) {
      return [current.trim()]
    }
    if (Array.isArray(current)) {
      return current.filter((img: any) => img && typeof img === 'string' && img.trim() !== '')
    }
  }

  return []
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Debug: voir les données du produit
  console.log('🔍 Product data received:', product)
  console.log('🔍 Product images:', product?.images)
  console.log('🔍 Product image:', product?.image)

  const parsedImages = parseImages(product?.images)
  console.log('🔍 Parsed images:', parsedImages)

  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    currency: product?.currency || "XOF",
    image: product?.image || "",
    images: parsedImages,
    category: product?.category || "general",
    soldOut: product?.soldOut || false,
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formDataUpload,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'upload')
      }

      const result = await response.json()
      console.log('✅ Image uploadée:', result.url)

      // Ajouter la nouvelle image à la liste
      const newImages = [...formData.images, result.url]
      setFormData({ ...formData, images: newImages })

      toast({
        title: "Image uploadée",
        description: `${file.name} a été ajoutée avec succès.`,
      })

      // Réinitialiser le champ input pour permettre de re-sélectionner le même fichier
      e.target.value = ''
    } catch (error: any) {
      console.error('❌ Erreur upload:', error)
      toast({
        title: "Erreur d'upload",
        description: error.message || "Impossible d'uploader l'image.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    // Get the original image URL at this filtered index
    const validImages = formData.images.filter(img => img && img.trim() !== '')
    const imageToRemove = validImages[index]

    // Remove this specific image from the original array
    const newImages = formData.images.filter(img => img !== imageToRemove)

    // Also update the main image field if needed
    const updatedFormData = { ...formData, images: newImages }
    if (newImages.length > 0 && (!updatedFormData.image || updatedFormData.image === imageToRemove)) {
      updatedFormData.image = newImages[0]
    }
    setFormData(updatedFormData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = product
        ? `/api/admin/products?id=${product.id}`
        : '/api/admin/products'

      const method = product ? 'PUT' : 'POST'

      // Prepare data - exclude empty category to avoid schema errors
      // Auto-sync main image with first image in array
      const validImages = formData.images.filter(img => img && img.trim() !== '')
      const mainImage = validImages.length > 0 ? validImages[0] : formData.image

      const submitData = {
        name: formData.name,
        price: formData.price,
        currency: formData.currency,
        image: mainImage,   // always use first uploaded image as the main one
        images: JSON.stringify(validImages), // store clean array as JSON string
        sold_out: formData.soldOut, // Utiliser sold_out pour MySQL
      }

      // Only add category if it's not empty
      if (formData.category && formData.category.trim() !== '') {
        (submitData as any).category = formData.category
      }

      console.log('Submitting product data:', submitData)
      console.log('URL:', url)
      console.log('Method:', method)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Erreur lors de l\'enregistrement')
      }

      const result = await response.json()

      toast({
        title: product ? "Produit mis à jour" : "Produit créé",
        description: product
          ? "Le produit a été modifié avec succès."
          : "Le nouveau produit a été ajouté avec succès.",
      })

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("[v0] Product error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Nom du produit *</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="price">Prix *</Label>
        <Input
          id="price"
          type="number"
          required
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: parseInt(e.target.value) })
          }
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="currency">Devise</Label>
        <Input
          id="currency"
          value={formData.currency}
          onChange={(e) =>
            setFormData({ ...formData, currency: e.target.value })
          }
          className="mt-1"
          placeholder="XOF"
        />
      </div>

      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="mt-1"
          placeholder="general"
        />
        <div className="text-sm text-gray-600 mt-1">
          💡 Exemples: clothing, accessories, general, etc.
        </div>
      </div>

      <div>
        <Label>Images du produit *</Label>
        <div className="mt-2 space-y-4">
          {/* Upload button */}
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isUploading}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {isUploading ? 'Upload en cours...' : `Ajouter une image (${formData.images.filter(img => img && img.trim() !== '').length} actuellement)`}
          </Button>

          {/* Upload progress */}
          {isUploading && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div className="text-sm text-blue-600 font-medium">Upload en cours...</div>
              </div>
              <div className="mt-2 text-xs text-blue-500">
                Veuillez patienter, l'image est en cours de traitement...
              </div>
            </div>
          )}

          {/* Images grid */}
          {(() => {
            const validImages = formData.images.filter(img => img && img.trim() !== '')

            return validImages.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {validImages.map((image, index) => (
                    <div key={`${image}-${index}-${Math.random().toString(36).substr(2, 9)}`} className="relative group">
                      <img
                        src={getValidImageUrl(image)}
                        alt={`Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          console.error('Image failed to load:', image)
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', image)
                        }}
                      />
                      {/* Remove button */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-80 hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {/* Image number indicator */}
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                        {index + 1}
                      </div>
                      {/* Main image indicator */}
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                          Principal
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Note :</strong> La première image sera utilisée comme image principale du produit.
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded">
                <div className="text-lg">🖼️</div>
                <div>Aucune image ajoutée pour le moment</div>
                <div className="text-sm">Cliquez sur "Ajouter une image" pour commencer</div>
              </div>
            )
          })()}

          {/* Help text */}
          <div className="text-sm text-gray-600">
            💡 Les images s'affichent en carrousel dans la boutique.
            {formData.images.length === 0 && " Ajoutez au moins une image."}
            {formData.images.length > 1 && ` ${formData.images.length} images ajoutées.`}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="soldOut"
          checked={formData.soldOut}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, soldOut: checked as boolean })
          }
        />
        <Label htmlFor="soldOut" className="cursor-pointer">
          Produit épuisé
        </Label>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-black text-white hover:bg-gray-800"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Enregistrement..."
            : product
              ? "Mettre à jour"
              : "Créer"}
        </Button>
      </div>
    </form>
  )
}
