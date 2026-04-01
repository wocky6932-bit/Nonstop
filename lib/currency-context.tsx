"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { Currency, SUPPORTED_CURRENCIES, convertPrice as convertPriceHelper } from './currency-converter'

interface CurrencyContextType {
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  convertPrice: (price: number, fromCurrency: string) => number
  formatPrice: (price: number, currencyCode?: string) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0])

  const convertPrice = (price: number | undefined | null, fromCurrency: string): number => {
    // Si pas de prix, prix invalide, ou devise invalide, retourner un prix par défaut
    if (price === undefined || price === null || isNaN(price) || !fromCurrency) {
      return 0
    }
    
    return convertPriceHelper(price, fromCurrency, selectedCurrency.code)
  }

  const formatPrice = (price: number, currencyCode?: string): string => {
    // Vérifier que le prix est valide
    if (!price || isNaN(price) || !isFinite(price)) {
      return '0 ' + (currencyCode || selectedCurrency.symbol)
    }
    
    const currency = currencyCode ? 
      SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) : 
      selectedCurrency
    
    if (!currency) return `0 ${currencyCode}`
    
    const symbol = currency.symbol
    const formattedPrice = price.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
    
    return `${formattedPrice} ${symbol}`
  }

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      setSelectedCurrency,
      convertPrice,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}