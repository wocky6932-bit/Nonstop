'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'

export interface Product {
  id: string
  name: string
  price: number
  currency: string
  image: string
  images?: string[]
  sold_out: boolean
  sizes?: string[]       // Tailles disponibles (ex: ["S","M","L","XL"])
  selectedSize?: string  // Taille choisie par le client
  is_preorder?: boolean
}

export interface CartItem extends Product {
  cartItemId: string // ID unique : productId + taille (ex: "123-M")
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const isAuthenticated = !!session

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('nonstop-cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch {
        localStorage.removeItem('nonstop-cart')
      }
    }
  }, [])

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('nonstop-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour ajouter des produits au panier',
        variant: 'destructive'
      })
      router.push('/auth/login')
      return
    }

    // ID unique = id produit + taille choisie (ou juste l'id si pas de taille)
    const cartItemId = product.selectedSize
      ? `${product.id}-${product.selectedSize}`
      : product.id

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.cartItemId === cartItemId)
      if (existingItem) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, cartItemId, quantity: 1 }]
    })
  }

  const removeFromCart = (cartItemId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour modifier votre panier',
        variant: 'destructive'
      })
      router.push('/auth/login')
      return
    }
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId))
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (!isAuthenticated) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour modifier votre panier',
        variant: 'destructive'
      })
      router.push('/auth/login')
      return
    }
    if (quantity <= 0) {
      removeFromCart(cartItemId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour modifier votre panier',
        variant: 'destructive'
      })
      router.push('/auth/login')
      return
    }
    setCart([])
  }

  const getTotalPrice = () => {
    return cart.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count: number, item: CartItem) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
