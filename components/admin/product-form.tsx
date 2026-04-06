"use client"

import { useState, useRef } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, X, GripVertical, CheckCircle2 } from 'lucide-react'
import { getValidImageUrl, compressImage } from "@/lib/image-utils"
import { Progress } from "@/components/ui/progress"

interface Product {
  id: string
  name: string
  price: number
  currency: string
  image: string
  images?: string[] // Array of image URLs for carousel
  category?: string // Product category for filtering
  sizes?: string[] // Available sizes
  soldOut: boolean
}

const AVAILABLE_SIZES = ['TU', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

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
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const [compressionSummary, setCompressionSummary] = useState("")

  // Debug: voir les données du produit
  console.log('🔍 Product data received:', product)
  console.log('🔍 Product images:', product?.images)
  console.log('🔍 Product image:', product?.image)

  const initialImages = parseImages(product?.images)
  // Si l'image principale n'est pas dans la liste des images, on l'ajoute au début
  if (product?.image && product.image.trim() !== '' && !initialImages.includes(product.image)) {
    initialImages.unshift(product.image)
  }

  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    currency: product?.currency || "XOF",
    image: product?.image || "",
    images: initialImages,
    category: product?.category || "general",
    sizes: product?.sizes || [],
    soldOut: product?.soldOut || false,
  })

  const handleSizeToggle = (size: string) => {
    setFormData(prev => {
      if (prev.sizes.includes(size)) {
        return { ...prev, sizes: prev.sizes.filter(s => s !== size) }
      } else {
        return { ...prev, sizes: [...prev.sizes, size] }
      }
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    setUploadPercentage(0)
    const newAddedImages: string[] = []
    let totalOriginalSize = 0
    let totalCompressedSize = 0

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        totalOriginalSize += file.size
        setUploadProgress(`Optimisation ${i + 1}/${selectedFiles.length} : ${file.name}`)
        setUploadPercentage(((i) / selectedFiles.length) * 100)

        // 1. Compression client-side
        let fileToUpload: Blob | File = file
        if (file.type.startsWith('image/')) {
          try {
            console.log(`⏳ Compression de ${file.name}...`)
            fileToUpload = await compressImage(file, 800, 800, 0.7) // Taille réduite pour le Base64
            totalCompressedSize += fileToUpload.size
            console.log(`✅ Compression réussie : ${(file.size / 1024 / 1024).toFixed(2)}Mo -> ${(fileToUpload.size / 1024 / 1024).toFixed(2)}Mo`)
          } catch (err) {
            console.warn(`⚠️ Échec compression pour ${file.name}, envoi original`, err)
            totalCompressedSize += file.size
          }
        } else {
          totalCompressedSize += file.size
        }

        // 2. Upload
        setUploadProgress(`Upload ${i + 1}/${selectedFiles.length}...`)
        const formDataUpload = new FormData()
        formDataUpload.append('file', fileToUpload, file.name)

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formDataUpload,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Erreur sur ${file.name}`)
        }

        const result = await response.json()
        newAddedImages.push(result.url)
        setUploadPercentage(((i + 1) / selectedFiles.length) * 100)
      }

      // 3. Update state
      const updatedImages = [...formData.images, ...newAddedImages]
      setFormData({ 
        ...formData, 
        images: updatedImages,
        image: formData.image || newAddedImages[0]
      })

      const gain = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(0)
      const ratio = `${(totalOriginalSize / 1024 / 1024).toFixed(1)}Mo -> ${(totalCompressedSize / 1024 / 1024).toFixed(1)}Mo`
      
      toast({
        title: selectedFiles.length > 1 ? "Images ajoutées" : "Image ajoutée",
        description: `Gain de ${gain}% (${ratio}). Prêt pour le web !`,
      })
    } catch (error: any) {
      console.error('❌ Erreur upload:', error)
      toast({
        title: "Erreur d'upload",
        description: error.message || "Impossible d'uploader les images.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress("")
      setUploadPercentage(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
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
        sizes: formData.sizes,
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
        <Label>Tailles disponibles</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map(size => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeToggle(size)}
              className={`px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${
                formData.sizes.includes(size)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600 mt-2">
          💡 Sélectionnez les tailles disponibles pour cet article. Si aucune n'est sélectionnée, l'option de taille n'apparaîtra pas.
        </div>
      </div>

      <div>
        <Label>Images du produit *</Label>
        <div className="mt-2 space-y-4">
          {/* Upload button */}
          <input
            type="file"
            ref={fileInputRef}
            id="image-upload"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isUploading ? 'Traitement en cours...' : `Ajouter des images (${formData.images.filter(img => img && img.trim() !== '').length} actuellement)`}
          </Button>

          {/* Upload progress */}
          {isUploading && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">{uploadProgress}</span>
                </div>
                <span className="text-xs font-bold text-blue-600">{Math.round(uploadPercentage)}%</span>
              </div>
              <Progress value={uploadPercentage} className="h-1.5 bg-blue-100" />
              <p className="mt-2 text-[10px] text-blue-400 uppercase tracking-widest text-center">
                Optimisation pour mobile en cours...
              </p>
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
