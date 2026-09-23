import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_for_build')

const FROM_EMAIL = process.env.FROM_EMAIL || 'Nonstop <noreply@nonstopp.shop>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'omarba125678@gmail.com'

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
            <img src="${imgUrl}" style="width:64px; height:64px; border-radius:8px; background:#fff; object-fit:contain; border: 1px solid #27272a;" />
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

  const dateStr = new Date().toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0a0c" style="background-color:#0a0a0c; width:100%;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; margin:0 auto; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            
            <!-- Cover Image -->
            <tr>
              <td style="padding-bottom: 32px;">
                <img src="https://nonstopp.shop/images/nonstop_mac_wallpaper_v2.png" width="100%" style="display:block; width:100%; max-width:600px; border-radius:12px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);" alt="Cover" />
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="padding-bottom: 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="48" valign="top">
                      <div style="background:#18181b; border:1px solid #27272a; border-radius:12px; width:48px; height:48px; text-align:center; line-height:48px;">
                        <img src="https://api.iconify.design/lucide:shopping-bag.svg?color=white" width="24" height="24" style="vertical-align:middle;" />
                      </div>
                    </td>
                    <td style="padding-left:16px; vertical-align:middle;">
                      <h1 style="color:#fff; font-size:22px; font-weight:600; margin:0 0 8px; line-height:1.2;">${title}</h1>
                      <p style="color:#a0a0ab; font-size:15px; margin:0; line-height:1.5;">${intro}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Main Card -->
            <tr>
              <td style="background:#141416; border:1px solid #27272a; border-radius:12px; padding:24px;">
                
                <!-- Order ID & Date -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="50%" valign="top">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding-right:6px;"><img src="https://api.iconify.design/lucide:file-text.svg?color=%2371717a" width="14" height="14" style="vertical-align:middle;" /></td>
                          <td><p style="color:#71717a; font-size:13px; margin:0;">Numéro de commande</p></td>
                        </tr>
                      </table>
                      <p style="color:#fff; font-size:15px; font-weight:600; margin:4px 0 0;">#${orderId}</p>
                    </td>
                    <td width="50%" valign="top" style="border-left:1px solid #27272a; padding-left:20px;">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding-right:6px;"><img src="https://api.iconify.design/lucide:calendar.svg?color=%2371717a" width="14" height="14" style="vertical-align:middle;" /></td>
                          <td><p style="color:#71717a; font-size:13px; margin:0;">Date de commande</p></td>
                        </tr>
                      </table>
                      <p style="color:#fff; font-size:14px; margin:4px 0 0;">${dateStr}</p>
                    </td>
                  </tr>
                </table>

                <!-- Client Info -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px; border-top:1px solid #27272a;">
                  <tr>
                    <td style="padding-top:24px;">
                      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:4px;">
                        <tr>
                          <td style="padding-right:6px;"><img src="https://api.iconify.design/lucide:user.svg?color=%2371717a" width="14" height="14" style="vertical-align:middle;" /></td>
                          <td><p style="color:#71717a; font-size:13px; margin:0;">Client</p></td>
                        </tr>
                      </table>
                      <p style="color:#fff; font-size:15px; margin:0 0 16px;">${formData.nom}</p>
                      
                      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:4px;">
                        <tr>
                          <td style="padding-right:6px;"><img src="https://api.iconify.design/lucide:phone.svg?color=%2371717a" width="14" height="14" style="vertical-align:middle;" /></td>
                          <td><p style="color:#71717a; font-size:13px; margin:0;">Téléphone</p></td>
                        </tr>
                      </table>
                      <p style="margin:0 0 16px;"><a href="tel:${formData.telephone}" style="color:#fff; text-decoration:none; font-size:15px;">${formData.telephone}</a></p>
                      
                      <p style="color:#71717a; font-size:13px; margin:0 0 4px;">Adresse de livraison</p>
                      <p style="color:#fff; font-size:15px; margin:0; line-height:1.5;">${formData.adresse}, ${formData.ville}</p>
                    </td>
                  </tr>
                </table>

                <!-- Items -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px; border-top:1px solid #27272a;">
                  <tr>
                    <td style="padding-top:24px; padding-bottom:16px;">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding-right:8px;"><img src="https://api.iconify.design/lucide:package.svg?color=white" width="16" height="16" style="vertical-align:middle;" /></td>
                          <td><h3 style="color:#fff; font-size:15px; font-weight:600; margin:0;">Articles commandés</h3></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ${itemsRows}
                </table>

                <!-- Totals -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px; border-top:1px solid #27272a;">
                  <tr>
                    <td style="padding-top:24px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="color:#a0a0ab; font-size:14px; padding-bottom:8px;">Sous-total</td>
                          <td align="right" style="color:#fff; font-size:14px; padding-bottom:8px;">${Math.round(totalPrice).toLocaleString('fr-FR')} FCFA</td>
                        </tr>
                        <tr>
                          <td style="color:#a0a0ab; font-size:14px; padding-bottom:16px;">Livraison</td>
                          <td align="right" style="color:#fff; font-size:14px; padding-bottom:16px;">Au tarif en vigueur</td>
                        </tr>
                        <tr>
                          <td style="color:#fff; font-size:18px; font-weight:600;">Total</td>
                          <td align="right" style="color:#fff; font-size:18px; font-weight:600;">${Math.round(totalPrice).toLocaleString('fr-FR')} FCFA</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Notification Banner -->
            <tr>
              <td style="padding-top:24px;">
                <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background:#18181b; border-radius:8px;">
                  <tr>
                    <td width="24" valign="top">
                      <img src="https://api.iconify.design/lucide:bell.svg?color=white" width="20" height="20" />
                    </td>
                    <td style="padding-left:12px;">
                      <p style="color:#fff; font-size:14px; font-weight:600; margin:0 0 4px;">Merci d'utiliser Nonstop !</p>
                      <p style="color:#a0a0ab; font-size:13px; margin:0;">Nous vous tiendrons informé dès que le statut de la commande évoluera.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding-top:40px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #27272a; padding-top:24px;">
                  <tr>
                    <td>
                      <img src="https://nonstopp.shop/images/nonstop_mac_wallpaper_v2.png" width="80" style="border-radius:4px; opacity:0.8;" alt="Nonstop" />
                    </td>
                    <td align="right" style="color:#71717a; font-size:13px; font-style:italic;">
                      Style • Qualité • Nonstop
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
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
