import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const INIT_SQL_PATH = path.join(process.cwd(), 'database', 'schema.sql');

async function initializeDatabase() {
  console.log('Initialisation de la base de données MySQL...');

  try {
    // Connexion à MySQL sans spécifier de base de données
    const connection = await mysql.createConnection({
      database: process.env.DB_NAME || 'nonstop',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    // Lire et exécuter le script SQL
    const initSql = fs.readFileSync(INIT_SQL_PATH, 'utf8');

    // Exécuter les instructions SQL
    await connection.execute(initSql);

    console.log('Base de données nonstop_ecommerce initialisée avec succès !');
    console.log('Tables créées : users, orders, order_items');

    await connection.end();

  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données :', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase };
