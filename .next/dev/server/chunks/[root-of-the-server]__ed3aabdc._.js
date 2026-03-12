module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
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
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/code (7)/lib/db-config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Configuration de la base de données MySQL
__turbopack_context__.s([
    "dbConfig",
    ()=>dbConfig
]);
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'M@tzo2705',
    database: 'nonstop_ecommerce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
}),
"[project]/code (7)/lib/mysql.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
    "getAllOrders",
    ()=>getAllOrders,
    "getClients",
    ()=>getClients,
    "getConnection",
    ()=>getConnection,
    "getOrderById",
    ()=>getOrderById,
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
    "updateOrderStatus",
    ()=>updateOrderStatus,
    "updateProduct",
    ()=>updateProduct,
    "updateUser",
    ()=>updateUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$mysql2$40$3$2e$19$2e$1_$40$types$2b$node$40$22$2e$19$2e$1$2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/mysql2@3.19.1_@types+node@22.19.1/node_modules/mysql2/promise.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$db$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/lib/db-config.ts [app-route] (ecmascript)");
;
;
// Pool de connexions
const pool = __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$mysql2$40$3$2e$19$2e$1_$40$types$2b$node$40$22$2e$19$2e$1$2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool(__TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$db$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbConfig"]);
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
            if (key === 'images') {
                // Avoid double-encoding: only stringify if it's an actual array
                params.push(Array.isArray(value) ? JSON.stringify(value) : value);
            } else {
                params.push(value);
            }
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
async function getClients() {
    try {
        // On récupère tous les utilisateurs sauf l'admin
        const sql = "SELECT id, nom, email, telephone, created_at FROM users WHERE email != 'adminnonstop@gmail.com' ORDER BY created_at DESC";
        return await query(sql);
    } catch (error) {
        console.error('Error fetching clients from MySQL:', error);
        return [];
    }
}
async function getAllOrders() {
    try {
        const sql = `
      SELECT o.*, u.nom as client_name, u.email as client_email,
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
        return await query(sql);
    } catch (error) {
        console.error('Error fetching all orders from MySQL:', error);
        return [];
    }
}
async function getOrderById(orderId) {
    try {
        const orderSql = `
      SELECT o.*, u.nom as client_name, u.email as client_email, u.telephone as client_phone,
             u.adresse as client_address, u.ville as client_city
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `;
        const orders = await query(orderSql, [
            orderId
        ]);
        if (orders.length === 0) return null;
        const itemsSql = 'SELECT * FROM order_items WHERE order_id = ?';
        const items = await query(itemsSql, [
            orderId
        ]);
        return {
            ...orders[0],
            items
        };
    } catch (error) {
        console.error('Error fetching order details:', error);
        return null;
    }
}
async function updateOrderStatus(orderId, status) {
    try {
        const sql = 'UPDATE orders SET status = ? WHERE id = ?';
        await query(sql, [
            status,
            orderId
        ]);
        return {
            success: true
        };
    } catch (error) {
        console.error('Error updating order status:', error);
        return {
            success: false,
            error: 'Erreur lors de la mise à jour du statut'
        };
    }
}
}),
"[project]/code (7)/app/api/admin/products/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/code (7)/lib/mysql.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (id) {
            // Get specific product
            const product = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getProductById"])(id);
            if (!product) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Product not found'
                }, {
                    status: 404
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(product);
        } else {
            // Get all products
            const products = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getProducts"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(products || []);
        }
    } catch (error) {
        console.error('GET products error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Failed to fetch products'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { name, price, currency, image, images, description, category } = body;
        if (!name || !price) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Name and price are required'
            }, {
                status: 400
            });
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createProduct"])({
            name,
            price: parseFloat(price),
            currency: currency || 'XOF',
            image: image || '',
            images: images || [],
            description: description || '',
            category: category || 'general'
        });
        if (!result.success) {
            throw new Error(result.error);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result.product, {
            status: 201
        });
    } catch (error) {
        console.error('POST products error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Failed to create product'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Product ID is required'
            }, {
                status: 400
            });
        }
        const body = await request.json();
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateProduct"])(id, body);
        if (!result.success) {
            throw new Error(result.error);
        }
        const updatedProduct = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getProductById"])(id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updatedProduct);
    } catch (error) {
        console.error('PUT products error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Failed to update product'
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Product ID is required'
            }, {
                status: 400
            });
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$lib$2f$mysql$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteProduct"])(id);
        if (!result.success) {
            throw new Error(result.error);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('DELETE products error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$code__$28$7$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Failed to delete product'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ed3aabdc._.js.map