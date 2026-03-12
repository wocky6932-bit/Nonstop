import mysql from 'mysql2/promise'
import { dbConfig } from '../lib/db-config'

async function setupOrdersTables() {
  const connection = await mysql.createConnection(dbConfig)

  try {
    console.log('🔍 Vérification/Création des tables de commandes...')

    // Créer la table orders si elle n'existe pas
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        notes TEXT,
        status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      )
    `

    await connection.execute(createOrdersTable)
    console.log('✅ Table orders vérifiée/créée')

    // Créer la table order_items si elle n'existe pas
    const createOrderItemsTable = `
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL,
        product_image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_order_id (order_id),
        INDEX idx_product_id (product_id),
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `

    await connection.execute(createOrderItemsTable)
    console.log('✅ Table order_items vérifiée/créée')

    console.log('🎉 Tables de commandes prêtes !')

  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error)
  } finally {
    await connection.end()
    process.exit(0)
  }
}

setupOrdersTables()
