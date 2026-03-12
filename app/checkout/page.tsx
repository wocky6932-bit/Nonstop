"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/lib/cart-context'
import { useToast } from '@/hooks/use-toast'
import { useSession } from '@/hooks/use-session'
import { Toaster } from '@/components/ui/toaster'
import { getValidImageUrl } from '@/lib/image-utils'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getTotalPrice, clearCart } = useCart()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { session, loading: sessionLoading } = useSession()

  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    notes: '',
  })

  // Pré-remplir le formulaire avec les infos de l'utilisateur connecté
  useEffect(() => {
    if (session) {
      setFormData({
        nom: session.nom || '',
        telephone: session.telephone || '',
        email: session.email || '',
        adresse: session.adresse || '',
        ville: session.ville || '',
        notes: '',
      })
    }
  }, [session])

  const totalPrice = getTotalPrice()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Checkout form submitted!') // Debug
    console.log('Cart items:', cart) // Debug
    console.log('Total price:', totalPrice) // Debug
    console.log('Session:', session) // Debug
    
    setIsSubmitting(true)

    try {
      // Use API route for orders
      console.log('Sending order request:', { formData, cart, totalPrice }) // Debug
      console.log('User ID:', session?.id) // Debug
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: {
            ...formData,
            userId: session?.id && session?.id !== '0' ? session.id : 'guest'
          },
          cart,
          totalPrice
        }),
      })

      console.log('Response status:', response.status) // Debug
      console.log('Response ok:', response.ok) // Debug
      
      const result = await response.json()
      console.log('Checkout response:', result) // Debug

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de la création de la commande')
      }

      toast({
        title: 'Commande confirmée!',
        description: 'Nous vous contacterons bientôt pour la livraison.',
      })

      clearCart()

      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error: any) {
      console.error('Order error:', error)
      const errorMessage = error.message || 'Une erreur inconnue est survenue'

      toast({
        title: 'Erreur de commande',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <RefreshCw className="animate-spin h-12 w-12 border-b-2 border-black" />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Votre panier est vide</h2>
          <Link href="/">
            <Button className="bg-black text-white hover:bg-gray-800">
              Retour à la boutique
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-8 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la boutique
        </Link>

        <h1 className="text-3xl tracking-wider mb-8">FINALISER LA COMMANDE</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de l'utilisateur connecté */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-3">Informations de livraison</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom:</span>
                    <span className="font-medium">{formData.nom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Téléphone:</span>
                    <span className="font-medium">{formData.telephone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adresse:</span>
                    <span className="font-medium">
                      {formData.adresse ? `${formData.adresse}, ${formData.ville}` : 'Non renseignée'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm tracking-wide mb-2">
                  Notes supplémentaires (optionnel)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Instructions de livraison, préférences..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 tracking-wider py-6 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'TRAITEMENT...' : 'CONFIRMER LA COMMANDE'}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                En passant commande, vous acceptez nos conditions générales de vente.
                Nous vous contacterons par téléphone pour confirmer la livraison.
              </p>
            </form>
          </div>

          <div>
            <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
              <h2 className="text-xl tracking-wider mb-6">RÉCAPITULATIF</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-200 flex-shrink-0">
                      <img
                        src={getValidImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.price.toLocaleString()} XOF × {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {(item.price * item.quantity).toLocaleString()} XOF
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{totalPrice.toLocaleString()} XOF</span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between text-lg font-medium">
                  <span className="tracking-wider">TOTAL</span>
                  <span>{totalPrice.toLocaleString()} XOF</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded text-sm">
                <p className="text-blue-900">
                  <strong>Mode de paiement:</strong> Paiement à la livraison (Cash)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
