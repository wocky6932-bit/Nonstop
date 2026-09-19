import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_for_build')

const FROM_EMAIL = process.env.FROM_EMAIL || 'Nonstop <noreply@nonstopp.shop>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'Omarlae125678@icloud.com'

export interface OrderEmailData {
  orderId: string
  formData: {
    nom: string
    telephone: string
    email?: string
    adresse: string
    ville: string
    notes?: string
  }
  cart: Array<{
    name: string
    quantity: number
    price: number
    selectedSize?: string
    image?: string
  }>
  totalPrice: number
}

function renderItems(cart: OrderEmailData['cart']) {
  return cart
    .map((item) => {
      const imgUrl = item.image || 'https://nonstopp.shop/placeholder-logo.png'
      return `
        <tr>
          <td width="64" style="padding-bottom:16px;">
            <img src="${imgUrl}" style="width:64px; height:64px; border-radius:8px; background:#fff; object-fit:contain; border: 1px solid #e5e5e5;" />
          </td>
          <td style="padding-left:16px; padding-bottom:16px; vertical-align:middle;">
            <p style="color:#fff; font-size:15px; font-weight:600; margin:0 0 4px;">${item.name}</p>
            <p style="color:#a0a0ab; font-size:13px; margin:0;">Taille : ${item.selectedSize || 'Standard'}</p>
          </td>
          <td align="center" style="color:#a0a0ab; font-size:14px; padding-bottom:16px; vertical-align:middle;">x${item.quantity}</td>
          <td align="right" style="color:#fff; font-size:15px; font-weight:600; padding-bottom:16px; vertical-align:middle;">${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</td>
        </tr>`
    })
    .join('')
}

function renderEmailTemplate(data: OrderEmailData, isForAdmin: boolean) {
  const { orderId, formData, cart, totalPrice } = data
  const itemsRows = renderItems(cart)
  
  const title = isForAdmin ? 'Nouvelle commande reçue !' : 'Confirmation de commande'
  const intro = isForAdmin 
    ? 'Bonjour,<br/>Vous venez de recevoir une nouvelle commande sur votre boutique <strong>Nonstop</strong>.'
    : `Bonjour <strong>${formData.nom}</strong>,<br/>Merci pour votre commande ! Nous l'avons bien reçue et nous la préparons avec soin.`

  return `
    <div style="background-color:#0f0f11; padding:40px 20px; font-family:'Inter', 'Helvetica Neue', Arial, sans-serif; color:#fff;">
      <div style="max-width:600px; margin:0 auto;">
        
        <!-- Cover Image -->
        <img src="https://nonstopp.shop/images/nonstop_mac_wallpaper_v2.png" style="width:100%; border-radius:12px; margin-bottom:32px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);" />

        <!-- Title -->
        <table width="100%" style="margin-bottom:24px;">
          <tr>
            <td width="48" style="vertical-align:top;">
              <div style="background:#18181b; border:1px solid #27272a; border-radius:12px; width:48px; height:48px; text-align:center; line-height:48px; font-size:20px;">🛍️</div>
            </td>
            <td style="padding-left:16px; vertical-align:middle;">
              <h1 style="color:#fff; font-size:24px; font-weight:600; margin:0 0 8px;">${title}</h1>
              <p style="color:#a0a0ab; font-size:15px; margin:0; line-height:1.5;">${intro}</p>
            </td>
          </tr>
        </table>

        <!-- Main Card -->
        <div style="background:#141416; border:1px solid #27272a; border-radius:12px; padding:24px;">
          
          <!-- Order ID & Date -->
          <table width="100%">
            <tr>
              <td>
                <p style="color:#71717a; font-size:13px; margin:0; display:flex; align-items:center;">📄 Numéro de commande</p>
                <p style="color:#fff; font-size:15px; font-weight:600; margin:4px 0 0;">#${orderId}</p>
              </td>
              <td align="right" style="border-left:1px solid #27272a; padding-left:24px;">
                <p style="color:#71717a; font-size:13px; margin:0;">📅 Date de commande</p>
                <p style="color:#fff; font-size:14px; margin:4px 0 0;">${new Date().toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
              </td>
            </tr>
          </table>

          <!-- Client Info -->
          <div style="margin-top:24px; padding-top:24px; border-top:1px solid #27272a;">
            <p style="color:#71717a; font-size:13px; margin:0;">👤 Client</p>
            <p style="color:#fff; font-size:15px; margin:4px 0 16px;">${formData.nom}</p>
            
            <p style="color:#71717a; font-size:13px; margin:0;">📞 Téléphone</p>
            <p style="color:#fff; font-size:15px; margin:4px 0 16px;">${formData.telephone}</p>
            
            <p style="color:#71717a; font-size:13px; margin:0;">📍 Adresse de livraison</p>
            <p style="color:#fff; font-size:15px; margin:4px 0 0; line-height:1.5;">${formData.adresse}, ${formData.ville}</p>
          </div>

          <!-- Items -->
          <div style="margin-top:24px; padding-top:24px; border-top:1px solid #27272a;">
            <h3 style="color:#fff; font-size:16px; margin:0 0 16px;">📦 Articles commandés</h3>
            <table width="100%">
              ${itemsRows}
            </table>
          </div>

          <!-- Totals -->
          <div style="margin-top:16px; padding-top:24px; border-top:1px solid #27272a;">
            <table width="100%">
              <tr>
                <td style="color:#a0a0ab; font-size:14px; padding-bottom:8px;">Sous-total</td>
                <td align="right" style="color:#fff; font-size:14px; padding-bottom:8px;">${Math.round(totalPrice).toLocaleString('fr-FR')} FCFA</td>
              </tr>
              <tr>
                <td style="color:#a0a0ab; font-size:14px; padding-bottom:16px;">Livraison</td>
                <td align="right" style="color:#fff; font-size:14px; padding-bottom:16px;">Variable (ou Incluse)</td>
              </tr>
              <tr>
                <td style="color:#fff; font-size:18px; font-weight:bold;">Total</td>
                <td align="right" style="color:#fff; font-size:18px; font-weight:bold;">${Math.round(totalPrice).toLocaleString('fr-FR')} FCFA</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Notification Banner -->
        <table width="100%" style="margin-top:24px; padding:16px; background:#18181b; border-radius:8px;">
          <tr>
            <td width="32" style="font-size:20px;">🔔</td>
            <td style="padding-left:12px;">
              <p style="color:#fff; font-size:14px; font-weight:600; margin:0 0 4px;">Merci d'utiliser Nonstop !</p>
              <p style="color:#a0a0ab; font-size:13px; margin:0;">Nous vous tiendrons informé dès que le statut de la commande évoluera.</p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <div style="margin-top:40px; padding-top:24px; border-top:1px solid #27272a;">
          <table width="100%">
            <tr>
              <td>
                <img src="https://nonstopp.shop/images/nonstop_mac_wallpaper_v2.png" width="100" style="border-radius:4px;" />
              </td>
              <td align="right" style="color:#71717a; font-size:13px; font-style:italic;">
                Style • Qualité • Nonstop
              </td>
            </tr>
          </table>
        </div>

      </div>
    </div>
  `
}

// ──────────────────────────────────────────────────────────────────────────────
// Email admin — nouvelle commande
// ──────────────────────────────────────────────────────────────────────────────
export async function sendAdminOrderNotification(data: OrderEmailData) {
  const html = renderEmailTemplate(data, true)

  return resend.emails.send({
    from: FROM_EMAIL,
    to: [ADMIN_EMAIL],
    subject: `🛍️ Nouvelle commande #${data.orderId} — ${data.formData.nom}`,
    html,
  })
}

// ──────────────────────────────────────────────────────────────────────────────
// Email client — confirmation de commande
// ──────────────────────────────────────────────────────────────────────────────
export async function sendClientOrderConfirmation(data: OrderEmailData) {
  if (!data.formData.email) return null

  const html = renderEmailTemplate(data, false)

  return resend.emails.send({
    from: FROM_EMAIL,
    to: [data.formData.email],
    subject: `Confirmation de votre commande #${data.orderId} — Nonstop`,
    html,
  })
}
