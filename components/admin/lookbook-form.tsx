"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, X, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  currency: string
  image: string
}

interface Pin {
  id: string
  x: number
  y: number
  productId: string
  productName: string
  productPrice: number
}

export function LookbookForm({ initialData }: { initialData?: any }) {
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  
  const [title, setTitle] = useState(initialData?.title || "")
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "")
  const [isActive, setIsActive] = useState(initialData ? initialData.is_active : true)
  const [pins, setPins] = useState<Pin[]>(initialData?.pins || [])

  // Modal pour sélectionner un produit
  const [selectingPin, setSelectingPin] = useState<{x: number, y: number} | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Charger les produits pour la sélection
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Erreur chargement produits:", err))
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Échec de l\'upload')
      
      const data = await response.json()
      setImageUrl(data.url)
      toast({ title: "Image uploadée avec succès" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur d'upload", variant: "destructive" })
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageUrl) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setSelectingPin({ x, y })
  }

  const addPin = (product: Product) => {
    if (!selectingPin) return
    
    setPins([
      ...pins,
      {
        id: Date.now().toString(),
        x: selectingPin.x,
        y: selectingPin.y,
        productId: product.id,
        productName: product.name,
        productPrice: product.price
      }
    ])
    setSelectingPin(null)
    setSearchQuery("")
  }

  const removePin = (pinId: string) => {
    setPins(pins.filter(p => p.id !== pinId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !imageUrl) {
      toast({ title: "Le titre et l'image sont obligatoires", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const url = initialData ? `/api/admin/lookbooks/${initialData.id}` : '/api/admin/lookbooks'
      const method = initialData ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          image_url: imageUrl,
          pins,
          is_active: isActive
        })
      })

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde')

      toast({ title: "Lookbook sauvegardé avec succès" })
      router.push('/admin/lookbooks')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur lors de la sauvegarde", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold">{initialData ? "Modifier le Lookbook" : "Nouveau Lookbook Interactif"}</h2>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Sauvegarder
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Titre du Lookbook</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Ex: Collection Été 2026"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isActive" 
            checked={isActive} 
            onCheckedChange={(c) => setIsActive(c as boolean)} 
          />
          <Label htmlFor="isActive">Actif (visible sur le site)</Label>
        </div>

        <div className="space-y-4">
          <Label>Image Principale & Tags</Label>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          
          {!imageUrl ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
              ) : (
                <>
                  <Plus className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Cliquez pour ajouter l'image du lookbook</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">
                  Cliquez sur l'image pour ajouter un point (+) interactif lié à un produit.
                </p>
                <Button type="button" variant="outline" size="sm" onClick={() => setImageUrl("")}>
                  Changer l'image
                </Button>
              </div>

              <div 
                className="relative w-full overflow-hidden rounded-lg border bg-gray-100 cursor-crosshair"
                style={{ minHeight: '400px' }}
                onClick={handleImageClick}
              >
                <img 
                  src={imageUrl} 
                  alt="Lookbook" 
                  className="w-full h-auto"
                />
                
                {/* Affichage des pins existants */}
                {pins.map(pin => (
                  <div 
                    key={pin.id}
                    className="absolute w-8 h-8 -ml-4 -mt-4 bg-white/90 rounded-full flex items-center justify-center shadow-lg border border-gray-200 group"
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    onClick={(e) => { e.stopPropagation(); removePin(pin.id); }}
                  >
                    <Plus className="w-5 h-5 text-black" />
                    {/* Tooltip admin au survol */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block w-32 bg-black text-white text-xs p-2 rounded text-center">
                      {pin.productName}<br/>
                      <span className="text-red-400 mt-1 block">Cliquez pour supp.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de sélection de produit */}
      {selectingPin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Lier un produit à ce point</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectingPin(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 border-b">
              <Input 
                placeholder="Rechercher un produit..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="overflow-y-auto p-4 flex-1 space-y-2">
              {filteredProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Aucun produit trouvé.</p>
              ) : (
                filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    onClick={() => addPin(product)}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:border-black cursor-pointer transition-colors"
                  >
                    {product.image && (
                      <img src={product.image.startsWith('data:') ? '/placeholder.jpg' : product.image} alt="" className="w-12 h-12 object-cover rounded bg-gray-100" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.price} {product.currency}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
