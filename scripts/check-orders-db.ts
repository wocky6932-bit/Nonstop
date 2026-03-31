import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function checkOrders() {
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

  console.log(`--- Vérification de la base : ${config.database} ---`)
  const connection = await mysql.createConnection(config)

  try {
    const [orders] = await connection.execute('SELECT * FROM orders')
    console.log('Nombre de commandes dans la table orders:', (orders as any[]).length)
    console.log('Détails des commandes:', JSON.stringify(orders, null, 2))

    const [items] = await connection.execute('SELECT * FROM order_items')
    console.log('Nombre d\'articles dans la table order_items:', (items as any[]).length)
  } catch (error) {
    console.error('❌ Erreur lors de la lecture :', error)
  } finally {
    await connection.end()
  }
}

checkOrders()
