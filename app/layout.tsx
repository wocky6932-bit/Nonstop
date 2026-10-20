import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { CurrencyProvider } from '@/lib/currency-context'
import { SplashScreen } from '@/components/ui/splash-screen'
import { PwaRegister } from '@/components/pwa-register'

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
  title: 'NONSTOP',
  description: 'Boutique premium streetwear, accessoires et précommandes',
  generator: 'NONSTOP',
  manifest: '/manifest.webmanifest',
  applicationName: 'NONSTOP',
  appleWebApp: {
    capable: true,
    title: 'NONSTOP',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/nonstop-logo.png', type: 'image/png' },
      { url: '/icon-light-32x32.png', type: 'image/png', sizes: '32x32' }
    ],
    apple: '/nonstop-logo.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
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
        <PwaRegister />
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
