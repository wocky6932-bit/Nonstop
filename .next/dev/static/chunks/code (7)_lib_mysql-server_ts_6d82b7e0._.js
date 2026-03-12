(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/code (7)/lib/mysql-server.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticateUser",
    ()=>authenticateUser,
    "createOrder",
    ()=>createOrder,
    "createProduct",
    ()=>createProduct,
    "createUser",
    ()=>createUser,
    "deleteProduct",
    ()=>deleteProduct,
    "getConnection",
    ()=>getConnection,
    "getProductById",
    ()=>getProductById,
    "getProducts",
    ()=>getProducts,
    "getUserByEmail",
    ()=>getUserByEmail,
    "getUserOrders",
    ()=>getUserOrders,
    "query",
    ()=>query,
    "updateProduct",
    ()=>updateProduct,
    "updateUser",
    ()=>updateUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$mysql2$40$3$2e$19$2e$1_$40$types$2b$node$40$22$2e$19$2e$1$2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/mysql2@3.19.1_@types+node@22.19.1/node_modules/mysql2/promise.js [app-client] (ecmascript)");
;
// Configuration de la base de données MySQL
const dbConfig = {
    host: __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.DB_HOST || 'localhost',
    user: __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.DB_USER || 'root',
    password: __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.DB_PASSWORD || '',
    database: __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.DB_NAME || 'nonstop_ecommerce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
// Pool de connexions
const pool = __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$mysql2$40$3$2e$19$2e$1_$40$types$2b$node$40$22$2e$19$2e$1$2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createPool(dbConfig);
async function query(sql, params) {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('MySQL Query Error:', error);
        throw error;
    }
}
async function getConnection() {
    return await pool.getConnection();
}
async function createUser(userData) {
    try {
        const sql = `
      INSERT INTO users (id, email, password, nom, telephone, adresse, ville)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        const result = await query(sql, [
            Date.now().toString(),
            userData.email,
            userData.password,
            userData.nom,
            userData.telephone,
            userData.adresse,
            userData.ville
        ]);
        return {
            success: true,
            userId: result.insertId
        };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return {
                success: false,
                error: 'Cet email est déjà utilisé'
            };
        }
        return {
            success: false,
            error: 'Erreur lors de la création du compte'
        };
    }
}
async function authenticateUser(email, password) {
    try {
        const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
        const users = await query(sql, [
            email,
            password
        ]);
        if (users.length > 0) {
            return {
                success: true,
                user: users[0]
            };
        } else {
            return {
                success: false,
                error: 'Email ou mot de passe incorrect'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: 'Erreur lors de l\'authentification'
        };
    }
}
async function updateUser(userId, updates) {
    try {
        const sql = `
      UPDATE users 
      SET nom = COALESCE(?, nom),
          telephone = COALESCE(?, telephone),
          adresse = COALESCE(?, adresse),
          ville = COALESCE(?, ville)
      WHERE id = ?
    `;
        await query(sql, [
            updates.nom,
            updates.telephone,
            updates.adresse,
            updates.ville,
            userId
        ]);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: 'Erreur lors de la mise à jour'
        };
    }
}
async function getUserByEmail(email) {
    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const users = await query(sql, [
            email
        ]);
        return users.length > 0 ? users[0] : null;
    } catch (error) {
        console.error('Error fetching user by email from MySQL:', error);
        return null;
    }
}
async function getProducts() {
    try {
        const sql = 'SELECT * FROM products ORDER BY created_at DESC';
        return await query(sql);
    } catch (error) {
        console.error('Error fetching products from MySQL:', error);
        return [];
    }
}
async function getProductById(id) {
    try {
        const sql = 'SELECT * FROM products WHERE id = ?';
        const products = await query(sql, [
            id
        ]);
        return products.length > 0 ? products[0] : null;
    } catch (error) {
        console.error('Error fetching product by id from MySQL:', error);
        return null;
    }
}
async function createProduct(productData) {
    try {
        const id = Date.now().toString();
        const sql = `
      INSERT INTO products (id, name, price, currency, image, images, description, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await query(sql, [
            id,
            productData.name,
            productData.price,
            productData.currency || 'XOF',
            productData.image,
            JSON.stringify(productData.images || []),
            productData.description || '',
            productData.category || 'general'
        ]);
        return {
            success: true,
            product: {
                id,
                ...productData
            }
        };
    } catch (error) {
        console.error('Error creating product in MySQL:', error);
        return {
            success: false,
            error: 'Erreur lors de la création du produit'
        };
    }
}
async function updateProduct(id, productData) {
    try {
        const fields = [];
        const params = [];
        for (const [key, value] of Object.entries(productData)){
            if (key === 'id') continue;
            fields.push(`${key} = ?`);
            params.push(key === 'images' ? JSON.stringify(value) : value);
        }
        if (fields.length === 0) return {
            success: true
        };
        params.push(id);
        const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
        await query(sql, params);
        return {
            success: true
        };
    } catch (error) {
        console.error('Error updating product in MySQL:', error);
        return {
            success: false,
            error: 'Erreur lors de la mise à jour du produit'
        };
    }
}
async function deleteProduct(id) {
    try {
        const sql = 'DELETE FROM products WHERE id = ?';
        await query(sql, [
            id
        ]);
        return {
            success: true
        };
    } catch (error) {
        console.error('Error deleting product from MySQL:', error);
        return {
            success: false,
            error: 'Erreur lors de la suppression du produit'
        };
    }
}
async function createOrder(orderData) {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();
        // Créer la commande
        const orderId = Date.now().toString();
        const orderSql = `
      INSERT INTO orders (id, user_id, total, notes)
      VALUES (?, ?, ?, ?)
    `;
        await connection.execute(orderSql, [
            orderId,
            orderData.userId,
            orderData.total,
            orderData.notes || null
        ]);
        // Ajouter les articles
        const itemSql = `
      INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, product_image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
        for (const item of orderData.items){
            await connection.execute(itemSql, [
                orderId,
                item.id,
                item.name,
                item.price,
                item.quantity,
                item.image
            ]);
        }
        await connection.commit();
        return {
            success: true,
            orderId
        };
    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        return {
            success: false,
            error: 'Erreur lors de la création de la commande'
        };
    } finally{
        connection.release();
    }
}
async function getUserOrders(userId) {
    try {
        const sql = `
      SELECT o.*, 
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
        return await query(sql, [
            userId
        ]);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=code%20%287%29_lib_mysql-server_ts_6d82b7e0._.js.map