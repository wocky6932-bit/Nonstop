import mysql from 'mysql2/promise'
import { dbConfig } from '../lib/db-config'

async function fixProductsTable() {
  const connection = await mysql.createConnection(dbConfig)

  try {
    console.log('🔧 Mise à jour de la table products...')

    // Vérifier la structure actuelle
    const [columns] = await connection.execute('DESCRIBE products')
    console.log('📋 Colonnes actuelles:', (columns as any).map((c: any) => c.Field))

    // Ajouter les colonnes manquantes si elles n'existent pas
    const requiredColumns = [
      { name: 'description', sql: 'ADD COLUMN description TEXT' },
      { name: 'currency', sql: 'ADD COLUMN currency VARCHAR(10) DEFAULT "XOF"' },
      { name: 'images', sql: 'ADD COLUMN images JSON' },
      { name: 'sold_out', sql: 'ADD COLUMN sold_out BOOLEAN DEFAULT FALSE' },
      { name: 'category', sql: 'ADD COLUMN category VARCHAR(100) DEFAULT "general"' },
      { name: 'updated_at', sql: 'ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
    ]

    for (const column of requiredColumns) {
      try {
        await connection.execute(`ALTER TABLE products ${column.sql}`)
        console.log(`✅ Colonne ${column.name} ajoutée`)
      } catch (error: any) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`ℹ️  Colonne ${column.name} existe déjà`)
        } else {
          console.error(`❌ Erreur ajout colonne ${column.name}:`, error.message)
        }
      }
    }

    // Nettoyer les produits existants
    await connection.execute('DELETE FROM products')
    console.log('🧹 Anciens produits supprimés')

    // Ajouter les nouveaux produits
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

    console.log('✅ 3 produits ajoutés avec succès')

    // Vérifier le résultat
    const [count] = await connection.execute('SELECT COUNT(*) as total FROM products')
    console.log(`📦 Total produits dans la base: ${(count as any)[0].total}`)

    console.log('🎉 Table products prête !')

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await connection.end()
    process.exit(0)
  }
}

fixProductsTable()
