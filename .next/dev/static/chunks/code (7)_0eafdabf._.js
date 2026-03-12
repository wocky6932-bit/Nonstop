(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/code (7)/lib/mysql.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    host: __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.MYSQL_HOST || 'localhost',
    user: __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.MYSQL_USER || 'root',
    password: __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.MYSQL_PASSWORD || '',
    database: __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.MYSQL_DATABASE || 'nonstop_ecommerce',
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
"[project]/code (7)/lib/fallback-auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Fallback auth using localStorage if SQLite fails
__turbopack_context__.s([
    "authenticateUser",
    ()=>authenticateUser,
    "createOrder",
    ()=>createOrder,
    "createUser",
    ()=>createUser,
    "updateUser",
    ()=>updateUser
]);
function loadUsers() {
    try {
        const saved = localStorage.getItem('nonstop-users');
        return saved ? JSON.parse(saved) : [];
    } catch  {
        return [];
    }
}
function saveUsers(users) {
    try {
        localStorage.setItem('nonstop-users', JSON.stringify(users));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
    }
}
async function createUser(userData) {
    const users = loadUsers();
    const existingUser = users.find((u)=>u.email === userData.email);
    if (existingUser) {
        return {
            success: false,
            error: 'Cet email est déjà utilisé'
        };
    }
    const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        password: userData.password,
        nom: userData.nom,
        telephone: userData.telephone,
        adresse: userData.adresse,
        ville: userData.ville,
        created_at: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    return {
        success: true,
        user: newUser
    };
}
async function authenticateUser(email, password) {
    const users = loadUsers();
    const user = users.find((u)=>u.email === email && u.password === password);
    if (user) {
        return {
            success: true,
            user
        };
    } else {
        return {
            success: false,
            error: 'Email ou mot de passe incorrect'
        };
    }
}
async function updateUser(userId, updates) {
    const users = loadUsers();
    const userIndex = users.findIndex((u)=>u.id === userId);
    if (userIndex === -1) {
        return {
            success: false,
            error: 'Utilisateur non trouvé'
        };
    }
    users[userIndex] = {
        ...users[userIndex],
        ...updates
    };
    saveUsers(users);
    return {
        success: true
    };
}
async function createOrder(orderData) {
    try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = {
            id: Date.now().toString(),
            userId: orderData.userId,
            items: orderData.items,
            total: orderData.total,
            notes: orderData.notes,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        return {
            success: true,
            orderId: order.id
        };
    } catch (error) {
        return {
            success: false,
            error: 'Erreur lors de la création de la commande'
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/code (7)/lib/hybrid-auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticateUser",
    ()=>authenticateUser,
    "createOrder",
    ()=>createOrder,
    "createUser",
    ()=>createUser,
    "getUserByEmail",
    ()=>getUserByEmail,
    "updateUserProfile",
    ()=>updateUserProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/lib/mysql.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$fallback$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/lib/fallback-auth.ts [app-client] (ecmascript)");
;
;
async function createUser(userData) {
    try {
        // Essayer MySQL d'abord
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUser"])(userData);
        if (result.success) {
            return result;
        }
    } catch (error) {
        console.warn('MySQL failed, using fallback:', error);
    }
    // Utiliser le fallback si MySQL échoue
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$fallback$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUser"])(userData);
}
async function authenticateUser(email, password) {
    try {
        // Essayer MySQL d'abord
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticateUser"])(email, password);
        if (result.success) {
            return result;
        }
    } catch (error) {
        console.warn('MySQL failed, using fallback:', error);
    }
    // Utiliser le fallback si MySQL échoue
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$fallback$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticateUser"])(email, password);
}
async function updateUserProfile(userId, updates) {
    try {
        // Essayer MySQL d'abord
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateUser"])(userId, updates);
        if (result.success) {
            return result;
        }
    } catch (error) {
        console.warn('MySQL failed, using fallback:', error);
    }
    // Utiliser le fallback si MySQL échoue
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$fallback$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateUser"])(userId, updates);
}
async function createOrder(orderData) {
    try {
        // Essayer MySQL d'abord
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createOrder"])(orderData);
        if (result.success) {
            return result;
        }
    } catch (error) {
        console.warn('MySQL failed, using fallback:', error);
    }
    // Utiliser le fallback si MySQL échoue
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$fallback$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createOrder"])(orderData);
}
async function getUserByEmail(email) {
    try {
        // Pour MySQL, vous devrez implémenter cette fonction
        console.log('Getting user by email (MySQL simulation):', email);
        return null;
    } catch (error) {
        console.warn('MySQL failed, checking fallback:', error);
        const users = JSON.parse(localStorage.getItem('nonstop-users') || '[]');
        return users.find((u)=>u.email === email) || null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/code (7)/lib/local-auth.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$hybrid$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/lib/hybrid-auth.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/code (7)/lib/local-auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$local$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/code (7)/lib/local-auth.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$hybrid$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/lib/hybrid-auth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Vérifier s'il y a une session en cours au démarrage
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (error) {
                    localStorage.removeItem('currentUser');
                }
            }
            setIsLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    const login = async (email, password)=>{
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$hybrid$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticateUser"])(email, password);
            if (result.success && result.user) {
                setUser(result.user);
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };
    const logout = ()=>{
        setUser(null);
        localStorage.removeItem('currentUser');
    };
    const value = {
        isAuthenticated: !!user,
        user,
        login,
        logout,
        isLoading
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/code (7)/lib/local-auth-context.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "YajQB7LURzRD+QP5gw0+K2TZIWA=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/code (7)/hooks/use-toast.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reducer",
    ()=>reducer,
    "toast",
    ()=>toast,
    "useToast",
    ()=>useToast
]);
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST'
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: 'REMOVE_TOAST',
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case 'UPDATE_TOAST':
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case 'DISMISS_TOAST':
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case 'REMOVE_TOAST':
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: 'UPDATE_TOAST',
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: 'DISMISS_TOAST',
            toastId: id
        });
    dispatch({
        type: 'ADD_TOAST',
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    _s();
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](memoryState);
    __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useToast.useEffect": ()=>{
            listeners.push(setState);
            return ({
                "useToast.useEffect": ()=>{
                    const index = listeners.indexOf(setState);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }
            })["useToast.useEffect"];
        }
    }["useToast.useEffect"], [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: 'DISMISS_TOAST',
                toastId
            })
    };
}
_s(useToast, "SPWE98mLGnlsnNfIwu/IAKTSZtk=");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/code (7)/lib/cart-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$local$2d$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/lib/local-auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function CartProvider({ children }) {
    _s();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$local$2d$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [cart, setCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Load cart from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            const savedCart = localStorage.getItem('nonstop-cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        }
    }["CartProvider.useEffect"], []);
    // Save cart to localStorage whenever it changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            localStorage.setItem('nonstop-cart', JSON.stringify(cart));
        }
    }["CartProvider.useEffect"], [
        cart
    ]);
    const addToCart = (product)=>{
        // Vérifier l'authentification avant d'ajouter au panier
        if (!isAuthenticated) {
            toast({
                title: 'Connexion requise',
                description: 'Veuillez vous connecter pour ajouter des produits au panier',
                variant: 'destructive'
            });
            router.push('/auth/login');
            return;
        }
        setCart((prevCart)=>{
            const existingItem = prevCart.find((item)=>item.id === product.id);
            if (existingItem) {
                return prevCart.map((item)=>item.id === product.id ? {
                        ...item,
                        quantity: item.quantity + 1
                    } : item);
            }
            return [
                ...prevCart,
                {
                    ...product,
                    quantity: 1
                }
            ];
        });
    };
    const removeFromCart = (productId)=>{
        // Vérifier l'authentification
        if (!isAuthenticated) {
            toast({
                title: 'Connexion requise',
                description: 'Veuillez vous connecter pour modifier votre panier',
                variant: 'destructive'
            });
            router.push('/auth/login');
            return;
        }
        setCart((prevCart)=>prevCart.filter((item)=>item.id !== productId));
    };
    const updateQuantity = (productId, quantity)=>{
        // Vérifier l'authentification
        if (!isAuthenticated) {
            toast({
                title: 'Connexion requise',
                description: 'Veuillez vous connecter pour modifier votre panier',
                variant: 'destructive'
            });
            router.push('/auth/login');
            return;
        }
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart)=>prevCart.map((item)=>item.id === productId ? {
                    ...item,
                    quantity
                } : item));
    };
    const clearCart = ()=>{
        // Vérifier l'authentification
        if (!isAuthenticated) {
            toast({
                title: 'Connexion requise',
                description: 'Veuillez vous connecter pour modifier votre panier',
                variant: 'destructive'
            });
            router.push('/auth/login');
            return;
        }
        setCart([]);
    };
    const getTotalPrice = ()=>{
        return cart.reduce((total, item)=>total + item.price * item.quantity, 0);
    };
    const getCartCount = ()=>{
        return cart.reduce((count, item)=>count + item.quantity, 0);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalPrice,
            getCartCount
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/code (7)/lib/cart-context.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_s(CartProvider, "DcfjBN4Wf5cT4+BnrghXhsZLmkY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$local$2d$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CartProvider;
function useCart() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
_s1(useCart, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/code (7)/lib/currency-converter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Service de conversion de devises
__turbopack_context__.s([
    "BASE_CURRENCY",
    ()=>BASE_CURRENCY,
    "SUPPORTED_CURRENCIES",
    ()=>SUPPORTED_CURRENCIES,
    "convertPrice",
    ()=>convertPrice,
    "formatPrice",
    ()=>formatPrice,
    "getCurrencyByCode",
    ()=>getCurrencyByCode,
    "getCurrencyByCountry",
    ()=>getCurrencyByCountry
]);
const SUPPORTED_CURRENCIES = [
    {
        code: 'FCFA',
        name: 'Franc CFA',
        symbol: 'CFA',
        flag: '🇸🇳',
        country: 'Sénégal'
    },
    {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        flag: '🇪🇺',
        country: 'Europe'
    },
    {
        code: 'GMD',
        name: 'Dalasi',
        symbol: 'D',
        flag: '🇬🇲',
        country: 'Gambie'
    }
];
// Taux de change approximatifs (en pratique, vous utiliseriez une API)
const EXCHANGE_RATES = {
    'FCFA': 655.957,
    'EUR': 1,
    'GMD': 70.0
};
const BASE_CURRENCY = 'EUR' // Euro comme devise de base
;
function convertPrice(price, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return price;
    // Convertir vers la devise de base puis vers la devise cible
    const basePrice = price / EXCHANGE_RATES[fromCurrency];
    const convertedPrice = basePrice * EXCHANGE_RATES[toCurrency];
    return Math.round(convertedPrice * 100) / 100;
}
function formatPrice(price, currencyCode) {
    const currency = SUPPORTED_CURRENCIES.find((c)=>c.code === currencyCode);
    if (!currency) return `${price} ${currencyCode}`;
    const symbol = currency.symbol;
    const formattedPrice = price.toLocaleString('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
    return `${formattedPrice} ${symbol}`;
}
function getCurrencyByCountry(country) {
    return SUPPORTED_CURRENCIES.find((c)=>c.country === country);
}
function getCurrencyByCode(code) {
    return SUPPORTED_CURRENCIES.find((c)=>c.code === code);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/code (7)/lib/currency-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CurrencyProvider",
    ()=>CurrencyProvider,
    "useCurrency",
    ()=>useCurrency
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$currency$2d$converter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/lib/currency-converter.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const CurrencyContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function CurrencyProvider({ children }) {
    _s();
    const [selectedCurrency, setSelectedCurrency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$currency$2d$converter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORTED_CURRENCIES"][0]);
    const convertPrice = (price, fromCurrency)=>{
        // Si pas de prix, prix invalide, ou devise invalide, retourner un prix par défaut
        if (!price || isNaN(price) || price <= 0 || !fromCurrency) {
            return 10000 // Prix par défaut en FCFA
            ;
        }
        // Si la devise source est la même que la devise cible, retourner le prix tel quel
        if (fromCurrency === selectedCurrency.code) {
            return price;
        }
        // Taux de change approximatifs (en pratique, vous utiliseriez une API)
        const EXCHANGE_RATES = {
            'FCFA': 655.957,
            'EUR': 1,
            'GMD': 70.0
        };
        // Vérifier que les devises existent dans les taux
        if (!EXCHANGE_RATES[fromCurrency] || !EXCHANGE_RATES[selectedCurrency.code]) {
            return price // Retourner le prix original si devise non supportée
            ;
        }
        // Convertir vers l'EUR puis vers la devise cible
        const basePrice = price / EXCHANGE_RATES[fromCurrency];
        const convertedPrice = basePrice * EXCHANGE_RATES[selectedCurrency.code];
        // Vérifier que le résultat est valide
        if (isNaN(convertedPrice) || !isFinite(convertedPrice) || convertedPrice <= 0) {
            return 10000 // Prix par défaut
            ;
        }
        return Math.round(convertedPrice * 100) / 100;
    };
    const formatPrice = (price, currencyCode)=>{
        // Vérifier que le prix est valide
        if (!price || isNaN(price) || !isFinite(price)) {
            return '0 ' + (currencyCode || selectedCurrency.symbol);
        }
        const currency = currencyCode ? __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$currency$2d$converter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORTED_CURRENCIES"].find((c)=>c.code === currencyCode) : selectedCurrency;
        if (!currency) return `0 ${currencyCode}`;
        const symbol = currency.symbol;
        const formattedPrice = price.toLocaleString('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        return `${formattedPrice} ${symbol}`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CurrencyContext.Provider, {
        value: {
            selectedCurrency,
            setSelectedCurrency,
            convertPrice,
            formatPrice
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/code (7)/lib/currency-context.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_s(CurrencyProvider, "f+t3xS7E9GKYcsCvz57s9HBjqq4=");
_c = CurrencyProvider;
function useCurrency() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
_s1(useCurrency, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CurrencyProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=code%20%287%29_0eafdabf._.js.map