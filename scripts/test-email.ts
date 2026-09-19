import 'dotenv/config'
import { sendAdminOrderNotification } from '../lib/email'

async function testEmail() {
  console.log('Envoi de l\'email de test à l\'administrateur...');
  try {
    const result = await sendAdminOrderNotification({
      orderId: 'TEST-999',
      formData: {
        nom: 'Utilisateur Test',
        telephone: '77 123 45 67',
        adresse: '123 Rue de Test',
        ville: 'Dakar',
        notes: 'Ceci est un test pour vérifier les notifications iCloud.'
      },
      cart: [
        {
          name: 'T-Shirt Nonstop',
          quantity: 1,
          price: 15000,
          selectedSize: 'M'
        }
      ],
      totalPrice: 15000
    });
    console.log('Résultat de l\'envoi:', result);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
}

testEmail();
