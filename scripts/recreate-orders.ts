import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function recreateOrders() {
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

  console.log('--- Réinitialisation des tables de commandes ---')
  const connection = await mysql.createConnection(config)

  try {
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0')
    
    console.log('Suppression des anciennes tables...')
    await connection.execute('DROP TABLE IF EXISTS order_items')
    await connection.execute('DROP TABLE IF EXISTS orders')

    console.log('Création de la nouvelle table orders (sans contrainte FK rigide)...')
    await connection.execute(`
      CREATE TABLE orders (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255),
          total DECIMAL(10, 2) NOT NULL,
          status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('Création de la table order_items...')
    await connection.execute(`
      CREATE TABLE order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id VARCHAR(255) NOT NULL,
          product_id VARCHAR(255) NOT NULL,
          product_name VARCHAR(255) NOT NULL,
          product_price DECIMAL(10, 2) NOT NULL,
          quantity INT NOT NULL,
          product_image TEXT,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `)

    await connection.execute('SET FOREIGN_KEY_CHECKS = 1')
    console.log('✅ Tables de commandes réinitialisées avec succès !')
  } catch (error) {
    console.error('❌ Erreur :', error)
  } finally {
    await connection.end()
  }
}

recreateOrders()
