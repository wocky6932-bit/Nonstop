import dotenv from 'dotenv'
import path from 'path'

// Charger les variables d'environnement AVANT d'importer le module mysql
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import { query } from '../lib/mysql'
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function resetOrders() {
  console.log('🔄 Début de la réinitialisation des commandes...')
  
  try {
    // 1. Désactiver les contraintes de clés étrangères temporairement
    await query('SET FOREIGN_KEY_CHECKS = 0')
    
    // 2. Vider les tables
    console.log('Vider la table order_items...')
    await query('TRUNCATE TABLE order_items')
    
    console.log('Vider la table orders...')
    await query('TRUNCATE TABLE orders')
    
    // 3. Réactiver les contraintes
    await query('SET FOREIGN_KEY_CHECKS = 1')
    
    console.log('✅ Toutes les commandes ont été supprimées avec succès !')
    console.log('Les statistiques sont maintenant à 0.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error)
    await query('SET FOREIGN_KEY_CHECKS = 1')
    process.exit(1)
  }
}

resetOrders()
