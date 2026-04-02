import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/mysql'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formData, cart, totalPrice } = body

    console.log('[API Orders] Received order request (MySQL):', { formData, cart, totalPrice })

    // Utiliser null si l'ID utilisateur est invalide (commande invité)
    const userId = (formData.userId && formData.userId !== '0' && formData.userId !== 'guest') ? formData.userId : null

    // Sauvegarder dans MySQL avec les infos de livraison
    const result = await createOrder({
      userId: userId,
      client_name: formData.nom,
      client_phone: formData.telephone,
      client_email: formData.email,
      client_address: formData.adresse,
      client_city: formData.ville,
      items: cart.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total: Math.round(totalPrice),
      notes: formData.notes
    })

    if (!result.success) {
      console.error('[API Orders] MySQL Error:', result.error)
      throw new Error(result.error)
    }

    console.log('[API Orders] Order saved to MySQL:', result.orderId)

    // Envoi de l'email de notification à l'administrateur
    try {
      // Pour utiliser iCloud SMTP: smtp.mail.me.com, port 587
      // L'utilisateur doit configurer SMTP_USER et SMTP_PASSWORD dans son fichier .env
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.mail.me.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      // Construction du contenu de l'email
      const itemsList = cart.map((item: any) => `- ${item.quantity}x ${item.name} (${item.price} CFA)`).join('\n')
      
      const mailOptions = {
        from: process.env.SMTP_USER || '"Boutique Nonstop" <noreply@nonstopp.shop>',
        to: 'Omarlae125678@icloud.com', // Le nouvel email de l'administrateur
        subject: `Nouvelle commande #${result.orderId} - Nonstop`,
        text: `Bonjour Seydina,\n\nVous avez reçu une nouvelle commande !\n\nClient : ${formData.nom}\nTéléphone : ${formData.telephone}\nAdresse : ${formData.adresse}, ${formData.ville}\n\nArticles :\n${itemsList}\n\nTotal : ${Math.round(totalPrice)} CFA\n\nNotes : ${formData.notes || 'Aucune'}\n\nConnectez-vous sur https://nonstopp.shop/admin/orders pour la gérer.\n\nL'équipe Nonstop`,
        html: `
          <h2>Nouvelle commande #${result.orderId}</h2>
          <p>Vous avez reçu une nouvelle commande sur votre boutique Nonstop !</p>
          <h3>Informations Client</h3>
          <ul>
            <li><strong>Nom:</strong> ${formData.nom}</li>
            <li><strong>Téléphone:</strong> ${formData.telephone}</li>
            <li><strong>Adresse:</strong> ${formData.adresse}, ${formData.ville}</li>
          </ul>
          <h3>Détails de la commande</h3>
          <ul>
            ${cart.map((item: any) => `<li>${item.quantity}x ${item.name} - ${item.price} CFA</li>`).join('')}
          </ul>
          <p><strong>Total: ${Math.round(totalPrice)} CFA</strong></p>
          ${formData.notes ? `<p><strong>Notes du client:</strong> ${formData.notes}</p>` : ''}
          <br/>
          <a href="https://nonstopp.shop/admin/orders" style="background-color: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir la commande</a>
        `
      }

      // N'envoyer l'email que si la configuration SMTP est présente
      if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        await transporter.sendMail(mailOptions)
        console.log('[API Orders] Notification email sent successfully')
      } else {
        console.log('[API Orders] Email sending skipped: SMTP configuration missing')
      }
    } catch (emailError) {
      console.error('[API Orders] Error sending notification email:', emailError)
      // On ne bloque pas la commande si l'envoi d'email échoue
    }

    return NextResponse.json({
      success: true,
      orderId: result.orderId
    })

  } catch (error: any) {
    console.error('[API Orders] Server error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erreur serveur lors de la création de la commande'
    }, { status: 500 })
  }
}
