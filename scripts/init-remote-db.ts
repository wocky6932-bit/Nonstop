import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

async function initRemoteDB() {
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

  console.log('--- Initialisation de la base de données distante ---')
  console.log(`Connection à : ${config.host}:${config.port}`)

  const connection = await mysql.createConnection(config)

  try {
    const schemaSql = fs.readFileSync(path.join(process.cwd(), 'database', 'schema.sql'), 'utf8')
    
    // Séparer les commandes par point-virgule
    const commands = schemaSql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0)

    console.log(`Exécution de ${commands.length} commandes SQL...`)

    for (const cmd of commands) {
      // Ignorer "CREATE DATABASE" et "USE" car TiDB Cloud gère ça différemment
      if (cmd.toUpperCase().startsWith('CREATE DATABASE') || cmd.toUpperCase().startsWith('USE ')) {
        continue
      }
      try {
        await connection.query(cmd)
      } catch (err: any) {
        if (err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log(`⚠️  Ignoré (déjà existant) : ${err.sqlMessage || err.message}`);
        } else {
          console.error(`❌ Erreur sur la commande SQL: ${cmd}`);
          throw err;
        }
      }
    }

    console.log('✅ Base de données initialisée avec succès !')
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error)
  } finally {
    await connection.end()
  }
}

initRemoteDB()
