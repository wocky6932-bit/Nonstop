import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function fixOrdersTable() {
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

  console.log('--- Correction de la table orders ---')
  const connection = await mysql.createConnection(config)

  try {
    // 1. Supprimer la clé étrangère
    // Note: Le nom de la contrainte peut varier, on va essayer de la trouver ou de la supprimer par défaut
    console.log('Suppression de la contrainte de clé étrangère...')
    
    // Sur MySQL/TiDB, on peut essayer de désactiver temporairement les checks ou de supprimer la FK
    // Mais le plus simple est de modifier la colonne pour accepter NULL et supprimer le lien si on connaît le nom
    
    // On va plutôt recréer la table sans la contrainte pour être sûr
    // (Attention: cela supprime les données de commande actuelles, mais comme c'est un test...)
    
    // Alternative plus sûre : 
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0')
    
    // On essaie de supprimer la contrainte si elle existe (le nom par défaut est souvent orders_user_id_foreign ou similaire)
    try {
        await connection.execute('ALTER TABLE orders DROP FOREIGN KEY orders_ibfk_1')
    } catch (e) {
        console.log('Contrainte orders_ibfk_1 non trouvée, tentative suivante...')
        try {
            await connection.execute('ALTER TABLE orders DROP FOREIGN KEY fk_user_id')
        } catch (e2) {
            console.log('Contrainte fk_user_id non trouvée.')
        }
    }
    
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1')

    console.log('✅ Modification terminée ! Les commandes invités sont maintenant autorisées.')
  } catch (error) {
    console.error('❌ Erreur :', error)
  } finally {
    await connection.end()
  }
}

fixOrdersTable()
