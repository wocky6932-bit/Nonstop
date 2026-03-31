import mysql from 'mysql2/promise'
import { config } from 'dotenv'

// Charger les variables d'environnement
config({ path: '.env' })

// Afficher les variables pour débogage
console.log('Variables d\'environnement:')
console.log('DB_HOST:', process.env.DB_HOST)
console.log('DB_USER:', process.env.DB_USER)
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NON DEFINI')
console.log('DB_NAME:', process.env.DB_NAME)

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '4000'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nonstop',
  ssl: {
    rejectUnauthorized: true
  }
}

async function createAdmin() {
  const connection = await mysql.createConnection(dbConfig)
  
  try {
    // Vérifier si la table users existe
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"')
    
    if ((tables as any[]).length === 0) {
      console.log('Création de la table users...')
      await connection.execute(`
        CREATE TABLE users (
          id VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          nom VARCHAR(255),
          telephone VARCHAR(255),
          adresse TEXT,
          ville VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      console.log('Table users créée avec succès')
    }
    
    // Insérer l'administrateur
    const adminEmail = 'adminnonstop@gmail.com'
    const adminPassword = 'admin123' // Mot de passe simple pour l'admin
    const adminId = Date.now().toString()
    
    // Supprimer l'admin s'il existe déjà
    await connection.execute('DELETE FROM users WHERE email = ?', [adminEmail])
    
    // Insérer le nouvel admin
    await connection.execute(`
      INSERT INTO users (id, email, password, nom, telephone, adresse, ville)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      adminId,
      adminEmail,
      adminPassword,
      'Administrateur',
      '+221 77 123 45 67',
      'Bureau Principal',
      'Dakar'
    ])
    
    console.log('✅ Administrateur créé avec succès !')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Mot de passe:', adminPassword)
    console.log('')
    console.log('Connectez-vous sur: http://localhost:3000/auth/login')
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error)
  } finally {
    await connection.end()
  }
}

createAdmin()
