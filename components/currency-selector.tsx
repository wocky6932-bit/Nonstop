"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  SUPPORTED_CURRENCIES
} from '@/lib/currency-converter'
import { useCurrency } from '@/lib/currency-context'
import { ChevronDown } from 'lucide-react'

interface CurrencySelectorProps {
  className?: string
}

export function CurrencySelector({ className = "" }: CurrencySelectorProps) {
  const { selectedCurrency, setSelectedCurrency } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (currency: any) => {
    setSelectedCurrency(currency)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm hover:bg-gray-100"
      >
        <span className="text-xs">{selectedCurrency.flag}</span>
        <span className="hidden sm:inline">
          {selectedCurrency.code}
        </span>
        <ChevronDown className="h-3 w-3" />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {SUPPORTED_CURRENCIES.map((currency) => (
            <button
              key={`${currency.country}-${currency.code}`}
              onClick={() => handleSelect(currency)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{currency.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{currency.country}</span>
                  <span className="text-xs text-gray-600">{currency.name}</span>
                </div>
              </div>
              <span className="font-medium text-sm">{currency.code}</span>
            </button>
          ))}
        </div>
      )}

      {/* Overlay pour fermer le menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}