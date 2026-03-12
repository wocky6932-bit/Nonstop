// Service de conversion de devises
export interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
  country: string
}

export interface ExchangeRates {
  [key: string]: number
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'FCFA', name: 'Franc CFA', symbol: 'CFA', flag: '🇸🇳', country: 'Sénégal' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', country: 'Europe' },
  { code: 'GMD', name: 'Dalasi', symbol: 'D', flag: '🇬🇲', country: 'Gambie' },
]

// Taux de change approximatifs (en pratique, vous utiliseriez une API)
const EXCHANGE_RATES: ExchangeRates = {
  'FCFA': 655.957, // 1 EUR = 655.957 FCFA
  'EUR': 1,
  'GMD': 70.0,     // 1 EUR = 70 GMD approx
}

export const BASE_CURRENCY = 'EUR' // Euro comme devise de base

export function convertPrice(price: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return price
  
  // Convertir vers la devise de base puis vers la devise cible
  const basePrice = price / EXCHANGE_RATES[fromCurrency]
  const convertedPrice = basePrice * EXCHANGE_RATES[toCurrency]
  
  return Math.round(convertedPrice * 100) / 100
}

export function formatPrice(price: number, currencyCode: string): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)
  if (!currency) return `${price} ${currencyCode}`
  
  const symbol = currency.symbol
  const formattedPrice = price.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  
  return `${formattedPrice} ${symbol}`
}

export function getCurrencyByCountry(country: string): Currency | undefined {
  return SUPPORTED_CURRENCIES.find(c => c.country === country)
}

export function getCurrencyByCode(code: string): Currency | undefined {
  return SUPPORTED_CURRENCIES.find(c => c.code === code)
}