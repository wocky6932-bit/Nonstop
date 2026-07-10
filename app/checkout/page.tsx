"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/lib/cart-context'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { getValidImageUrl } from '@/lib/image-utils'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getTotalPrice, clearCart } = useCart()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    adresse: '',
    ville: '',
    notes: '',
  })

  const totalPrice = getTotalPrice()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.prenom.trim() || !formData.nom.trim()) {
      toast({ title: 'Champs requis', description: 'Veuillez indiquer votre prénom et nom.', variant: 'destructive' })
      return
    }
    if (!formData.telephone.trim()) {
      toast({ title: 'Téléphone requis', description: 'Veuillez indiquer votre numéro de téléphone.', variant: 'destructive' })
      return
    }
    if (!formData.adresse.trim() || !formData.ville.trim()) {
      toast({ title: 'Adresse requise', description: 'Veuillez indiquer votre adresse de livraison.', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: {
            nom: `${formData.prenom.trim()} ${formData.nom.trim()}`,
            telephone: formData.telephone.trim(),
            email: '',
            adresse: formData.adresse.trim(),
            ville: formData.ville.trim(),
            notes: formData.notes.trim(),
            userId: 'guest',
          },
          cart,
          totalPrice,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de la création de la commande')
      }

      clearCart()
      setOrderSuccess(true)

    } catch (error: any) {
      toast({
        title: 'Erreur de commande',
        description: error.message || 'Une erreur est survenue, réessayez.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Écran de succès
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="h-20 w-20 mx-auto mb-6 text-black" strokeWidth={1} />
          <h1 className="text-3xl font-bold tracking-wider mb-3">COMMANDE CONFIRMÉE</h1>
          <p className="text-gray-500 mb-2">Merci pour votre commande !</p>
          <p className="text-gray-500 mb-8">
            Nous vous contacterons au <strong>{formData.telephone}</strong> pour confirmer la livraison.
          </p>
          <Link href="/">
            <Button className="bg-black text-white hover:bg-gray-800 tracking-wider px-10 py-5">
              RETOUR À LA BOUTIQUE
            </Button>
          </Link>
        </div>
        <Toaster />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Votre panier est vide</h2>
          <Link href="/">
            <Button className="bg-black text-white hover:bg-gray-800">Retour à la boutique</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-8 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la boutique
        </Link>

        <h1 className="text-3xl tracking-wider mb-8 font-bold uppercase">Finaliser la commande</h1>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Formulaire */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-base font-semibold uppercase tracking-widest mb-4 border-b pb-2">
                Informations de livraison
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prenom" className="text-xs tracking-wide uppercase mb-1 block">
                    Prénom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Amadou"
                    required
                    className="rounded-none border-gray-300 focus:border-black focus:ring-0"
                  />
                </div>
                <div>
                  <Label htmlFor="nom" className="text-xs tracking-wide uppercase mb-1 block">
                    Nom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ndiaye"
                    required
                    className="rounded-none border-gray-300 focus:border-black focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="telephone" className="text-xs tracking-wide uppercase mb-1 block">
                  Numéro de téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+221 77 000 00 00"
                  required
                  className="rounded-none border-gray-300 focus:border-black focus:ring-0"
                />
              </div>

              <div>
                <Label htmlFor="adresse" className="text-xs tracking-wide uppercase mb-1 block">
                  Adresse de livraison <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  placeholder="Rue 10, Médina"
                  required
                  className="rounded-none border-gray-300 focus:border-black focus:ring-0"
                />
              </div>

              <div>
                <Label htmlFor="ville" className="text-xs tracking-wide uppercase mb-1 block">
                  Ville <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  placeholder="Dakar"
                  required
                  className="rounded-none border-gray-300 focus:border-black focus:ring-0"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-xs tracking-wide uppercase mb-1 block">
                  Notes (optionnel)
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Instructions de livraison, préférences..."
                  rows={3}
                  className="rounded-none border-gray-300 focus:border-black focus:ring-0"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 tracking-widest py-6 text-sm uppercase rounded-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'TRAITEMENT EN COURS...' : 'VALIDER MA COMMANDE'}
              </Button>

              <p className="text-[11px] text-gray-400 text-center">
                Paiement à la livraison · Nous vous appelons pour confirmer
              </p>
            </form>
          </div>

          {/* Récapitulatif */}
          <div>
            <div className="bg-gray-50 p-6 sticky top-8">
              <h2 className="text-base font-semibold uppercase tracking-widest mb-6 border-b pb-2">
                Récapitulatif
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4">
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
                      <h3 className="text-sm font-medium mb-0.5">{item.name}</h3>
                      {item.selectedSize && (
                        <span className="inline-block text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded mb-1">
                          Taille : {item.selectedSize}
                        </span>
                      )}
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

              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{totalPrice.toLocaleString()} XOF</span>
                </div>
                <div className="flex items-center justify-between text-sm text-green-700">
                  <span>Livraison</span>
                  <span className="font-medium">Gratuite</span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between text-lg font-bold">
                  <span className="tracking-wider uppercase">Total</span>
                  <span>{totalPrice.toLocaleString()} XOF</span>
                </div>
              </div>

              <div className="mt-5 p-3 bg-black text-white text-xs text-center tracking-widest">
                💳 PAIEMENT À LA LIVRAISON
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
