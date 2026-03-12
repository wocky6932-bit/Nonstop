import mysql from 'mysql2/promise'
import { dbConfig } from '../lib/db-config'

async function setupProducts() {
  const connection = await mysql.createConnection(dbConfig)

  try {
    console.log('🔍 Vérification/Création de la table products...')

    // Créer la table products si elle n'existe pas
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'XOF',
        image VARCHAR(500),
        images JSON,
        sold_out BOOLEAN DEFAULT FALSE,
        category VARCHAR(100) DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_sold_out (sold_out)
      )
    `

    await connection.execute(createProductsTable)
    console.log('✅ Table products vérifiée/créée')

    // Vérifier s'il y a déjà des produits
    const [existingProducts] = await connection.execute('SELECT COUNT(*) as count FROM products')
    const productCount = (existingProducts as any)[0].count

    if (productCount > 0) {
      console.log(`📦 ${productCount} produit(s) déjà dans la base`)
    } else {
      console.log('📦 Aucun produit trouvé, ajout des produits de démo...')

      // Ajouter quelques produits de démo
      const demoProducts = [
        {
          id: 'demo-1',
          name: 'Bonnet NONSTOP',
          description: 'Bonnet élégant et confortable pour toutes les saisons',
          price: 4000,
          currency: 'XOF',
          image: '/images/WhatsApp Image 2026-03-12 at 01.03.24 (5).jpeg',
          images: JSON.stringify([
            '/images/WhatsApp Image 2026-03-12 at 01.03.24 (5).jpeg',
            '/images/WhatsApp Image 2026-03-12 at 01.03.24 (2).jpeg',
            '/images/WhatsApp Image 2026-03-12 at 01.03.24 (3).jpeg',
            '/images/WhatsApp Image 2026-03-12 at 01.03.24 (4).jpeg'
          ]),
          sold_out: false,
          category: 'accessories'
        },
        {
          id: 'demo-2',
          name: 'Long sleeve Nonstop',
          description: 'T-shirt manches longues de qualité premium',
          price: 6000,
          currency: 'XOF',
          image: '/images/WhatsApp Image 2026-03-12 at 01.03.24 (2).jpeg',
          images: JSON.stringify([
            '/images/WhatsApp Image 2026-03-12 at 01.03.24 (2).jpeg',
            '/images/WhatsApp Image 2026-03-12 at 01.03.24 (3).jpeg'
          ]),
          sold_out: false,
          category: 'clothing'
        },
        {
          id: 'demo-3',
          name: 'Sweat Nonstop Premium',
          description: 'Sweat à capuche confortable et stylé',
          price: 8500,
          currency: 'XOF',
          image: '/images/WhatsApp Image 2026-03-12 at 01.03.24 (3).jpeg',
          images: JSON.stringify([
            '/images/WhatsApp Image 2026-03-12 at 01.03.24 (3).jpeg',
            '/images/WhatsApp Image 2026-03-12 at 01.03.24 (4).jpeg'
          ]),
          sold_out: false,
          category: 'clothing'
        }
      ]

      for (const product of demoProducts) {
        await connection.execute(`
          INSERT INTO products (id, name, description, price, currency, image, images, sold_out, category)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          product.id,
          product.name,
          product.description,
          product.price,
          product.currency,
          product.image,
          product.images,
          product.sold_out,
          product.category
        ])
      }

      console.log('✅ 3 produits de démo ajoutés')
    }

    console.log('🎉 Produits prêts !')

  } catch (error) {
    console.error('❌ Erreur lors de la configuration des produits:', error)
  } finally {
    await connection.end()
    process.exit(0)
  }
}

setupProducts()
