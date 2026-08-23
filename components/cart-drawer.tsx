'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useCurrency } from '@/lib/currency-context'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getCartCount, clearCart } = useCart()
  const { convertPrice, formatPrice } = useCurrency()
  const [open, setOpen] = useState(false)

  const totalPrice = getTotalPrice()
  const cartCount = getCartCount()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Cart"
          className="relative"
          onClick={() => setOpen(true)}
        >
          <ShoppingCart className="h-8 w-8" strokeWidth={2.5} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
              {cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl tracking-wider">PANIER ({cartCount})</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">Votre panier est vide</p>
              <Button onClick={() => setOpen(false)} variant="outline">
                Continuer vos achats
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 border-b pb-4">
                    <div className="relative w-20 h-20 bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium mb-0.5">{item.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-1">
                        {item.is_preorder && (
                          <span className="inline-block text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium tracking-widest uppercase">
                            PRÉ-COMMANDE
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            Taille : {item.selectedSize}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {formatPrice(convertPrice(item.price, item.currency))}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="h-6 w-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="h-6 w-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Retirer l'article"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-medium">
                <span className="tracking-wider">TOTAL</span>
                <span>{formatPrice(convertPrice(totalPrice, 'XOF'))}</span>
              </div>

              <Link href="/checkout" onClick={() => setOpen(false)}>
                <Button className="w-full bg-black text-white hover:bg-gray-800 tracking-wider">
                  COMMANDER
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  clearCart()
                  setOpen(false)
                }}
              >
                Vider le panier
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
