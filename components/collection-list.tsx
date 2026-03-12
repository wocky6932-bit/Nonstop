"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface Collection {
  name: string
  slug: string
  image: string
  description?: string
}

const collections: Collection[] = [
  {
    name: 'Hoodies',
    slug: 'hoodies',
    image: '/images/hoodies-collection.jpg',
    description: 'Sweats-shirts et hoodies confortables'
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    image: '/images/tshirts-collection.jpg',
    description: 'T-shirts et polos'
  },
  {
    name: 'Pants',
    slug: 'pants',
    image: '/images/pants-collection.jpg',
    description: 'Pantalons et shorts'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: '/images/accessories-collection.jpg',
    description: 'Accessoires et objets'
  },
  {
    name: 'Bonnets',
    slug: 'bonnets',
    image: '/images/bonnets-collection.jpg',
    description: 'Bonnets et chapeaux'
  },
  {
    name: 'Outerwear',
    slug: 'outerwear',
    image: '/images/outerwear-collection.jpg',
    description: 'Vestes et外套'
  }
]

export function CollectionList() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl tracking-wider mb-4 font-light">
          Nos Collections
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez notre gamme complète de vêtements et accessoires, organisés par catégories pour faciliter votre shopping.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link key={collection.slug} href={`/shop?category=${collection.slug}`}>
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/3] bg-gray-100 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
                <div className="absolute inset-0 flex items-end justify-start p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-2 tracking-wide">
                      {collection.name}
                    </h3>
                    {collection.description && (
                      <p className="text-sm text-gray-200">
                        {collection.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Button
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  Voir {collection.name}
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/shop">
          <Button className="bg-black text-white hover:bg-gray-800 tracking-wider text-sm px-12 py-6">
            Voir toute la boutique
          </Button>
        </Link>
      </div>
    </section>
  )
}