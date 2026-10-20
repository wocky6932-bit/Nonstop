import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NONSTOP',
    short_name: 'NONSTOP',
    description: 'Boutique premium streetwear, accessoires et précommandes',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    categories: ['shopping', 'fashion'],
    icons: [
      {
        src: '/nonstop-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icon-light-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  }
}
