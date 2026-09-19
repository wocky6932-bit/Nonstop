import { sendAdminPushNotification } from '../lib/notifications'
import * as dotenv from 'dotenv'

dotenv.config()

async function testTelegram() {
  console.log('Envoi de la notification Telegram de test...')
  
  const orderData = {
    orderId: 'TEST-TELEGRAM',
    formData: {
      nom: 'Utilisateur Telegram',
      telephone: '77 123 45 67',
      ville: 'Dakar',
    },
    totalPrice: 15000,
    cart: [
      {
        name: 'T-Shirt Premium',
        quantity: 1,
        size: 'L',
      }
    ]
  }

  await sendAdminPushNotification(orderData)
}

testTelegram()
