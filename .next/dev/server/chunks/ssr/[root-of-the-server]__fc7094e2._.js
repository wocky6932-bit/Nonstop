module.exports = [
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/code (7)/lib/mysql-server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"002edc7b2f05a75bb80019f4c56075e9e138d13801":"getConnection","005a542a63d9208eddea64a8bfd9a9f970a4506fae":"getProducts","402109215bbe34b87da63395b0e63a6cac824a324b":"createOrder","40590fd03b72271d90b4bc50b56b7dc2b6a28daf04":"createUser","405a65e198866e4776aaaecb4f0fbd74c6066dc004":"getProductById","40606b162b9610bf2501715f0776aa9565560b0781":"deleteProduct","406c6ce8c59b4724fb5a9145a2d33106cd2549aa36":"getUserOrders","40a953f8dd1641ce1d0d497cf1dc74ea5976e27685":"createProduct","40e930569a4c2ca0b4d99667bb2e96d26cc955222b":"getUserByEmail","60213c5fa9e246fe75efb9408321394e895f0d0357":"authenticateUser","602bdd92d4433b13477b92c3eae9136c8da4a6c624":"updateUser","6080dec358785b79dda4fa147279052d03409457d9":"updateProduct","60d49883e5f7f38690fef9688c63fe3da124b4aa5c":"query"},"",""] */ __turbopack_context__.s([
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
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$mysql2$40$3$2e$19$2e$1_$40$types$2b$node$40$22$2e$19$2e$1$2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/mysql2@3.19.1_@types+node@22.19.1/node_modules/mysql2/promise.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
// Configuration de la base de données MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nonstop_ecommerce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
// Pool de connexions
const pool = __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$mysql2$40$3$2e$19$2e$1_$40$types$2b$node$40$22$2e$19$2e$1$2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].createPool(dbConfig);
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
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    query,
    getConnection,
    createUser,
    authenticateUser,
    updateUser,
    getUserByEmail,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createOrder,
    getUserOrders
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(query, "60d49883e5f7f38690fef9688c63fe3da124b4aa5c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getConnection, "002edc7b2f05a75bb80019f4c56075e9e138d13801", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createUser, "40590fd03b72271d90b4bc50b56b7dc2b6a28daf04", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(authenticateUser, "60213c5fa9e246fe75efb9408321394e895f0d0357", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUser, "602bdd92d4433b13477b92c3eae9136c8da4a6c624", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserByEmail, "40e930569a4c2ca0b4d99667bb2e96d26cc955222b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProducts, "005a542a63d9208eddea64a8bfd9a9f970a4506fae", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProductById, "405a65e198866e4776aaaecb4f0fbd74c6066dc004", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createProduct, "40a953f8dd1641ce1d0d497cf1dc74ea5976e27685", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateProduct, "6080dec358785b79dda4fa147279052d03409457d9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteProduct, "40606b162b9610bf2501715f0776aa9565560b0781", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createOrder, "402109215bbe34b87da63395b0e63a6cac824a324b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserOrders, "406c6ce8c59b4724fb5a9145a2d33106cd2549aa36", null);
}),
"[project]/code (7)/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/code (7)/lib/mysql-server.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/lib/mysql-server.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/code (7)/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/code (7)/lib/mysql-server.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "002edc7b2f05a75bb80019f4c56075e9e138d13801",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getConnection"],
    "005a542a63d9208eddea64a8bfd9a9f970a4506fae",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProducts"],
    "402109215bbe34b87da63395b0e63a6cac824a324b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createOrder"],
    "40590fd03b72271d90b4bc50b56b7dc2b6a28daf04",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createUser"],
    "405a65e198866e4776aaaecb4f0fbd74c6066dc004",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductById"],
    "40606b162b9610bf2501715f0776aa9565560b0781",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteProduct"],
    "406c6ce8c59b4724fb5a9145a2d33106cd2549aa36",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserOrders"],
    "40a953f8dd1641ce1d0d497cf1dc74ea5976e27685",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createProduct"],
    "40e930569a4c2ca0b4d99667bb2e96d26cc955222b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserByEmail"],
    "60213c5fa9e246fe75efb9408321394e895f0d0357",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authenticateUser"],
    "602bdd92d4433b13477b92c3eae9136c8da4a6c624",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUser"],
    "6080dec358785b79dda4fa147279052d03409457d9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateProduct"],
    "60d49883e5f7f38690fef9688c63fe3da124b4aa5c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/code (7)/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/code (7)/lib/mysql-server.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/lib/mysql-server.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fc7094e2._.js.map