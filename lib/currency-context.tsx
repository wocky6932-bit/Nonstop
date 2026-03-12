"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { Currency, SUPPORTED_CURRENCIES } from './currency-converter'

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
    if (!price || isNaN(price) || price <= 0 || !fromCurrency) {
      return 10000 // Prix par défaut en FCFA
    }
    
    // Si la devise source est la même que la devise cible, retourner le prix tel quel
    if (fromCurrency === selectedCurrency.code) {
      return price
    }
    
    // Taux de change approximatifs (en pratique, vous utiliseriez une API)
    const EXCHANGE_RATES: { [key: string]: number } = {
      'FCFA': 655.957, // 1 EUR = 655.957 FCFA
      'EUR': 1,
      'GMD': 70.0,     // 1 EUR = 70 GMD approx
    }
    
    // Vérifier que les devises existent dans les taux
    if (!EXCHANGE_RATES[fromCurrency] || !EXCHANGE_RATES[selectedCurrency.code]) {
      return price // Retourner le prix original si devise non supportée
    }
    
    // Convertir vers l'EUR puis vers la devise cible
    const basePrice = price / EXCHANGE_RATES[fromCurrency]
    const convertedPrice = basePrice * EXCHANGE_RATES[selectedCurrency.code]
    
    // Vérifier que le résultat est valide
    if (isNaN(convertedPrice) || !isFinite(convertedPrice) || convertedPrice <= 0) {
      return 10000 // Prix par défaut
    }
    
    return Math.round(convertedPrice * 100) / 100
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