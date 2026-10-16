'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Product {
  id: string
  name: string
  price: number
  currency: string
  image: string
  images?: string[]
  category?: string
  sold_out: boolean
  sizes?: string[]       // Tailles disponibles (ex: ["S","M","L","XL"])
  selectedSize?: string  // Taille choisie par le client
  variant_options?: string[] // Options de variante (ex: ["Cropped", "Non cropped"])
  selectedVariant?: string // Variante choisie par le client
  is_preorder?: boolean
}

export interface CartItem extends Product {
  cartItemId: string // ID unique : productId + taille (ex: "123-M")
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

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

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    const variantKey = product.selectedVariant ? `-${product.selectedVariant}` : ''
    const sizeKey = product.selectedSize ? `-${product.selectedSize}` : ''
    const cartItemId = `${product.id}${variantKey}${sizeKey}`

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.cartItemId === cartItemId)
      if (existingItem) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        )
      }
      return [...prevCart, { ...product, cartItemId, quantity: quantityToAdd }]
    })
  }

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId))
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
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
