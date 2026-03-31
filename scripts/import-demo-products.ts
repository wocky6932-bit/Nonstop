import mysql from 'mysql2/promise'
import { demoProducts } from '../lib/demo-products'
import dotenv from 'dotenv'

dotenv.config()

async function importProducts() {
  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '4000'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: true
    }
  }

  console.log('--- Importation des produits de démonstration ---')
  const connection = await mysql.createConnection(config)

  try {
    for (const product of demoProducts) {
      console.log(`Importation de : ${product.name}...`)
      
      const sql = `
        INSERT INTO products (id, name, price, currency, image, images, description, category, sold_out)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price)
      `

      await connection.execute(sql, [
        product.id,
        product.name,
        product.price,
        product.currency || 'XOF',
        product.image,
        JSON.stringify(product.images || []),
        product.description || '',
        'general',
        product.sold_out ? 1 : 0
      ])
    }

    console.log('✅ Produits importés avec succès !')
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation :', error)
  } finally {
    await connection.end()
  }
}

importProducts()
