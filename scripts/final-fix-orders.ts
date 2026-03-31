import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function finalFixOrdersSchema() {
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

  console.log('--- Ajout de client_email à la table orders ---')
  const connection = await mysql.createConnection(config)

  try {
    // On peut juste ajouter la colonne au lieu de tout recréer pour garder les tests
    try {
        await connection.execute('ALTER TABLE orders ADD COLUMN client_email VARCHAR(255) AFTER client_phone')
        console.log('✅ Colonne client_email ajoutée !')
    } catch (e) {
        console.log('La colonne existe peut-être déjà ou une erreur est survenue.')
    }

    console.log('✅ Schéma finalisé !')
  } catch (error) {
    console.error('❌ Erreur :', error)
  } finally {
    await connection.end()
  }
}

finalFixOrdersSchema()
