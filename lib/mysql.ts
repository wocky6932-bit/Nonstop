import mysql from 'mysql2/promise'
import { dbConfig } from './db-config'

// Pool de connexions
const pool = mysql.createPool(dbConfig)

export async function query(sql: string, params?: any[]) {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows
  } catch (error) {
    console.error('MySQL Query Error:', error)
    throw error
  }
}

export async function getConnection() {
  return await pool.getConnection()
}

// Fonctions pour les utilisateurs
export async function createUser(userData: {
  email: string
  password: string
  nom?: string
  telephone?: string
  adresse?: string
  ville?: string
}) {
  try {
    const sql = `
      INSERT INTO users (id, email, password, nom, telephone, adresse, ville)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    const result = await query(sql, [
      Date.now().toString(),
      userData.email,
      userData.password,
      userData.nom,
      userData.telephone,
      userData.adresse,
      userData.ville
    ]) as any

    return { success: true, userId: result.insertId }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Cet email est déjà utilisé' }
    }
    return { success: false, error: 'Erreur lors de la création du compte' }
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?'
    const users = await query(sql, [email, password]) as any[]

    if (users.length > 0) {
      return { success: true, user: users[0] }
    } else {
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }
  } catch (error) {
    return { success: false, error: 'Erreur lors de l\'authentification' }
  }
}

export async function updateUser(userId: string, updates: {
  nom?: string
  telephone?: string
  adresse?: string
  ville?: string
}) {
  try {
    const sql = `
      UPDATE users 
      SET nom = COALESCE(?, nom),
          telephone = COALESCE(?, telephone),
          adresse = COALESCE(?, adresse),
          ville = COALESCE(?, ville)
      WHERE id = ?
    `

    await query(sql, [
      updates.nom,
      updates.telephone,
      updates.adresse,
      updates.ville,
      userId
    ])

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const sql = 'SELECT * FROM users WHERE email = ?'
    const users = await query(sql, [email]) as any[]
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error('Error fetching user by email from MySQL:', error)
    return null
  }
}

// Fonctions pour les produits
export async function getProducts() {
  try {
    const sql = 'SELECT * FROM products ORDER BY created_at DESC'
    return await query(sql)
  } catch (error) {
    console.error('Error fetching products from MySQL:', error)
    return []
  }
}

export async function getProductById(id: string) {
  try {
    const sql = 'SELECT * FROM products WHERE id = ?'
    const products = await query(sql, [id]) as any[]
    return products.length > 0 ? products[0] : null
  } catch (error) {
    console.error('Error fetching product by id from MySQL:', error)
    return null
  }
}

export async function createProduct(productData: {
  name: string
  price: number
  currency?: string
  image: string
  images?: string[]
  description?: string
  category?: string
  sizes?: string[]
  is_preorder?: boolean
}) {
  try {
    const id = Date.now().toString()
    const sql = `
      INSERT INTO products (id, name, price, currency, image, images, description, category, sizes, is_preorder)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    await query(sql, [
      id,
      productData.name,
      productData.price,
      productData.currency || 'XOF',
      productData.image,
      JSON.stringify(productData.images || []),
      productData.description || '',
      productData.category || 'general',
      JSON.stringify(productData.sizes || []),
      productData.is_preorder ? 1 : 0
    ])

    return { success: true, product: { id, ...productData } }
  } catch (error) {
    console.error('Error creating product in MySQL:', error)
    return { success: false, error: 'Erreur lors de la création du produit' }
  }
}

export async function updateProduct(id: string, productData: any) {
  try {
    const fields = []
    const params = []

    for (const [key, value] of Object.entries(productData)) {
      if (key === 'id') continue
      fields.push(`${key} = ?`)
      if (key === 'images' || key === 'sizes') {
        // Avoid double-encoding: only stringify if it's an actual array
        params.push(Array.isArray(value) ? JSON.stringify(value) : value)
      } else {
        params.push(value)
      }
    }

    if (fields.length === 0) return { success: true }

    params.push(id)
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`

    await query(sql, params)
    return { success: true }
  } catch (error) {
    console.error('Error updating product in MySQL:', error)
    return { success: false, error: 'Erreur lors de la mise à jour du produit' }
  }
}

export async function deleteProduct(id: string) {
  try {
    const sql = 'DELETE FROM products WHERE id = ?'
    await query(sql, [id])
    return { success: true }
  } catch (error) {
    console.error('Error deleting product from MySQL:', error)
    return { success: false, error: 'Erreur lors de la suppression du produit' }
  }
}

export async function createOrder(orderData: {
  userId: string | null
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
    size?: string
  }>
  total: number
  notes?: string
  client_name?: string
  client_phone?: string
  client_email?: string
  client_address?: string
  client_city?: string
}) {
  const connection = await getConnection()

  try {
    await connection.beginTransaction()

    // Créer la commande avec les infos de livraison (dont l'email)
    const orderId = Date.now().toString()
    const orderSql = `
      INSERT INTO orders (id, user_id, client_name, client_phone, client_email, client_address, client_city, total, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    await connection.execute(orderSql, [
      orderId, 
      orderData.userId, 
      orderData.client_name || null,
      orderData.client_phone || null,
      orderData.client_email || null,
      orderData.client_address || null,
      orderData.client_city || null,
      orderData.total, 
      orderData.notes || null
    ])

    // Ajouter les articles
    const itemSql = `
      INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, product_image, selected_size)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    for (const item of orderData.items) {
      await connection.execute(itemSql, [
        orderId,
        item.id,
        item.name,
        item.price,
        item.quantity,
        item.image,
        item.size || null
      ])
    }

    await connection.commit()
    return { success: true, orderId }
  } catch (error) {
    await connection.rollback()
    console.error('Error creating order:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }
  } finally {
    connection.release()
  }
}

export async function getUserOrders(userId: string) {
  try {
    const sql = `
      SELECT o.*, 
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `

    return await query(sql, [userId])
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

export async function getClients() {
  try {
    // On récupère tous les utilisateurs sauf l'admin
    const sql = "SELECT id, nom, email, telephone, created_at FROM users WHERE LOWER(email) != 'omarlae125678@icloud.com' ORDER BY created_at DESC"
    return await query(sql)
  } catch (error) {
    console.error('Error fetching clients from MySQL:', error)
    return []
  }
}

export async function getAllOrders() {
  try {
    const sql = `
      SELECT o.*, 
             MAX(COALESCE(o.client_name, u.nom)) as client_name, 
             MAX(COALESCE(o.client_phone, u.telephone)) as client_phone,
             MAX(COALESCE(o.client_email, u.email)) as client_email,
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, o.user_id, o.total, o.status, o.notes, o.created_at, o.client_name, o.client_phone, o.client_email, o.client_address, o.client_city
      ORDER BY o.created_at DESC
    `
    return await query(sql)
  } catch (error) {
    console.error('Error fetching all orders from MySQL:', error)
    return []
  }
}

export async function getOrderById(orderId: string) {
  try {
    const orderSql = `
      SELECT o.*, 
             COALESCE(o.client_name, u.nom) as client_name, 
             COALESCE(o.client_email, u.email) as client_email, 
             COALESCE(o.client_phone, u.telephone) as client_phone,
             COALESCE(o.client_address, u.adresse) as client_address, 
             COALESCE(o.client_city, u.ville) as client_city
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `
    const orders = await query(orderSql, [orderId]) as any[]

    if (orders.length === 0) return null

    const itemsSql = 'SELECT * FROM order_items WHERE order_id = ?'
    const items = await query(itemsSql, [orderId])

    return { ...orders[0], items }
  } catch (error) {
    console.error('Error fetching order details:', error)
    return null
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const sql = 'UPDATE orders SET status = ? WHERE id = ?'
    await query(sql, [status, orderId])
    return { success: true }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: 'Erreur lors de la mise à jour du statut' }
  }
}

export async function getAdminStats() {
  try {
    // 1. Total des ventes et commandes (hors annulées)
    const totalsSql = `
      SELECT 
        SUM(total) as totalRevenue,
        COUNT(id) as totalOrders
      FROM orders
      WHERE status != 'cancelled'
    `
    const [totals] = await query(totalsSql) as any[]

    // 2. Ventes par mois (12 derniers mois) pour le graphique
    const monthlySql = `
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as label,
        SUM(total) as amount
      FROM orders
      WHERE status != 'cancelled'
      GROUP BY label
      ORDER BY label ASC
      LIMIT 12
    `
    const monthlyStats = await query(monthlySql)

    // 3. Ventes de l'année en cours
    const yearlySql = `
      SELECT SUM(total) as revenue
      FROM orders
      WHERE status != 'cancelled' AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `
    const [yearly] = await query(yearlySql) as any[]

    // 4. Ventes du mois en cours
    const currentMonthSql = `
      SELECT SUM(total) as revenue
      FROM orders
      WHERE status != 'cancelled' 
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
      AND MONTH(created_at) = MONTH(CURRENT_DATE())
    `
    const [currentMonth] = await query(currentMonthSql) as any[]

    return {
      totalRevenue: totals?.totalRevenue || 0,
      totalOrders: totals?.totalOrders || 0,
      yearlyRevenue: yearly?.revenue || 0,
      currentMonthRevenue: currentMonth?.revenue || 0,
      monthlyChartData: monthlyStats
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    throw error
  }
}

// -----------------------------------------------------------------------------
// LOOKBOOKS
// -----------------------------------------------------------------------------

export async function getLookbooks() {
  try {
    const sql = `SELECT * FROM lookbooks ORDER BY created_at DESC`
    const rows = await query(sql) as any[]
    // Parse JSON
    return rows.map(row => ({
      ...row,
      is_active: Boolean(row.is_active),
      pins: typeof row.pins === 'string' ? JSON.parse(row.pins) : row.pins
    }))
  } catch (error) {
    console.error('MySQL Get Lookbooks Error:', error)
    throw error
  }
}

export async function createLookbook(lookbookData: {
  id: string
  title: string
  image_url: string
  pins: any[]
  is_active?: boolean
}) {
  try {
    const sql = `
      INSERT INTO lookbooks (id, title, image_url, pins, is_active)
      VALUES (?, ?, ?, ?, ?)
    `
    await query(sql, [
      lookbookData.id,
      lookbookData.title,
      lookbookData.image_url,
      JSON.stringify(lookbookData.pins || []),
      lookbookData.is_active !== false ? 1 : 0
    ])
    return { success: true, id: lookbookData.id }
  } catch (error: any) {
    console.error('MySQL Create Lookbook Error:', error)
    return { success: false, error: error.message }
  }
}

export async function updateLookbook(id: string, lookbookData: {
  title?: string
  image_url?: string
  pins?: any[]
  is_active?: boolean
}) {
  try {
    const updates: string[] = []
    const values: any[] = []

    if (lookbookData.title !== undefined) {
      updates.push('title = ?')
      values.push(lookbookData.title)
    }
    if (lookbookData.image_url !== undefined) {
      updates.push('image_url = ?')
      values.push(lookbookData.image_url)
    }
    if (lookbookData.pins !== undefined) {
      updates.push('pins = ?')
      values.push(JSON.stringify(lookbookData.pins))
    }
    if (lookbookData.is_active !== undefined) {
      updates.push('is_active = ?')
      values.push(lookbookData.is_active ? 1 : 0)
    }

    if (updates.length === 0) return { success: true }

    const sql = `UPDATE lookbooks SET ${updates.join(', ')} WHERE id = ?`
    values.push(id)

    await query(sql, values)
    return { success: true }
  } catch (error: any) {
    console.error('MySQL Update Lookbook Error:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteLookbook(id: string) {
  try {
    await query(`DELETE FROM lookbooks WHERE id = ?`, [id])
    return { success: true }
  } catch (error: any) {
    console.error('MySQL Delete Lookbook Error:', error)
    return { success: false, error: error.message }
  }
}

