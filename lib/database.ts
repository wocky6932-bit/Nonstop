import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Chemin vers la base de données
const dbPath = path.join(process.cwd(), 'data', 'database.sqlite')

let db: Database | null = null

export function getDatabase() {
  if (!db) {
    try {
      // S'assurer que le dossier data existe
      const dataDir = path.dirname(dbPath)
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      
      db = new Database(dbPath)
      
      // Activer les clés étrangères
      db.pragma('foreign_keys = ON')
      
      // Créer les tables si elles n'existent pas
      initializeDatabase()
      
      console.log('Database initialized successfully at:', dbPath)
    } catch (error) {
      console.error('Error initializing database:', error)
      throw new Error('Failed to initialize database')
    }
  }
  return db
}

function initializeDatabase() {
  if (!db) return
  
  // Table des utilisateurs
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nom TEXT,
      telephone TEXT,
      adresse TEXT,
      ville TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // Table des commandes
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      total INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)
  
  // Table des articles de commande
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      product_image TEXT,
      FOREIGN KEY (order_id) REFERENCES orders (id)
    )
  `)
  
  console.log('Database initialized successfully')
}

// Fonctions pour les utilisateurs
export function createUser(userData: {
  email: string
  password: string
  nom?: string
  telephone?: string
  adresse?: string
  ville?: string
}) {
  const db = getDatabase()
  
  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, nom, telephone, adresse, ville)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      Date.now().toString(),
      userData.email,
      userData.password,
      userData.nom,
      userData.telephone,
      userData.adresse,
      userData.ville
    )
    
    return { success: true, userId: result.lastInsertRowid.toString() }
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, error: 'Cet email est déjà utilisé' }
    }
    return { success: false, error: 'Erreur lors de la création du compte' }
  }
}

export function authenticateUser(email: string, password: string) {
  const db = getDatabase()
  
  try {
    const stmt = db.prepare(`
      SELECT * FROM users WHERE email = ? AND password = ?
    `)
    
    const user = stmt.get(email, password) as any
    
    if (user) {
      return { success: true, user }
    } else {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }
  } catch (error) {
    return { success: false, error: 'Erreur lors de l\'authentification' }
  }
}

export function updateUser(userId: string, updates: {
  nom?: string
  telephone?: string
  adresse?: string
  ville?: string
}) {
  const db = getDatabase()
  
  try {
    const stmt = db.prepare(`
      UPDATE users 
      SET nom = COALESCE(?, nom),
          telephone = COALESCE(?, telephone),
          adresse = COALESCE(?, adresse),
          ville = COALESCE(?, ville)
      WHERE id = ?
    `)
    
    stmt.run(
      updates.nom,
      updates.telephone,
      updates.adresse,
      updates.ville,
      userId
    )
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
}

// Fonctions pour les commandes
export function createOrder(orderData: {
  userId: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  notes?: string
}) {
  const db = getDatabase()
  
  try {
    // Créer la commande
    const orderId = Date.now().toString()
    const stmt = db.prepare(`
      INSERT INTO orders (id, user_id, total, notes)
      VALUES (?, ?, ?, ?)
    `)
    
    stmt.run(orderId, orderData.userId, orderData.total, orderData.notes || null)
    
    // Ajouter les articles
    const itemsStmt = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, product_image)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    for (const item of orderData.items) {
      itemsStmt.run(
        orderId,
        item.id,
        item.name,
        item.price,
        item.quantity,
        item.image
      )
    }
    
    return { success: true, orderId }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: 'Erreur lors de la création de la commande' }
  }
}

export function getUserOrders(userId: string) {
  const db = getDatabase()
  
  try {
    const stmt = db.prepare(`
      SELECT o.*, 
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `)
    
    return stmt.all(userId)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}
