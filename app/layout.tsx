import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { CurrencyProvider } from '@/lib/currency-context'
import { SplashScreen } from '@/components/ui/splash-screen'

const cormorant = Cormorant_Garamond({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-serif'
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Nonstop',
  description: 'Discover the latest in premium streetwear and accessories',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/nonstop-logo.png',
      },
    ],
    apple: '/nonstop-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}>
        <SplashScreen />
        <CurrencyProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CurrencyProvider>
        <Analytics />
      </body>
    </html>
  )
}
