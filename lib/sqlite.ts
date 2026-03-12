import { Database } from 'sqlite3'
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'path'

let db: Database | null = null

export async function getDatabase() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), 'data', 'database.sqlite'),
      driver: sqlite3.Database
    })

    // Créer les tables si elles n'existent pas
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nom TEXT,
        telephone TEXT,
        adresse TEXT,
        ville TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }
  return db
}

export async function createUser(userData: {
  email: string
  password: string
  nom?: string
  telephone?: string
  adresse?: string
  ville?: string
}) {
  const db = await getDatabase()
  
  try {
    const result = await db.run(
      `INSERT INTO users (email, password, nom, telephone, adresse, ville) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userData.email, userData.password, userData.nom, userData.telephone, userData.adresse, userData.ville]
    )
    
    return { success: true, userId: result.lastID }
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, error: 'Cet email est déjà utilisé' }
    }
    return { success: false, error: 'Erreur lors de la création du compte' }
  }
}

export async function authenticateUser(email: string, password: string) {
  const db = await getDatabase()
  
  try {
    const user = await db.get(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    )
    
    if (user) {
      return { success: true, user }
    } else {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }
  } catch (error) {
    return { success: false, error: 'Erreur lors de l\'authentification' }
  }
}
