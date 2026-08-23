import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

// ──────────────────────────────────────────────────────────────────────────────
// Email admin — nouvelle commande
// ──────────────────────────────────────────────────────────────────────────────
export async function sendAdminOrderNotification(data: OrderEmailData) {
  const { orderId, formData, cart, totalPrice } = data

  const itemsRows = cart
    .map((item) => {
      const size = item.selectedSize ? ` <em style="color:#888">(Taille: ${item.selectedSize})</em>` : ''
      return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0">
            <strong>${item.quantity}×</strong> ${item.name}${size}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;white-space:nowrap">
            ${(item.price * item.quantity).toLocaleString('fr-FR')} CFA
          </td>
        </tr>`
    })
    .join('')

  const html = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <!-- Header -->
      <div style="background:#000;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:0.05em">NONSTOP</h1>
        <p style="color:#aaa;margin:4px 0 0;font-size:13px">Nouvelle commande reçue</p>
      </div>

      <!-- Body -->
      <div style="background:#fafafa;padding:32px;border:1px solid #e8e8e8;border-top:none">
        <h2 style="margin:0 0 4px;font-size:18px">Commande <span style="color:#555">#${orderId}</span></h2>
        <p style="margin:0 0 24px;color:#777;font-size:13px">
          Reçue le ${new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}
        </p>

        <!-- Client info -->
        <div style="background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:16px 20px;margin-bottom:20px">
          <h3 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#555">Client</h3>
          <table style="width:100%;font-size:14px;border-collapse:collapse">
            <tr><td style="color:#888;padding:3px 0;width:110px">Nom</td><td><strong>${formData.nom}</strong></td></tr>
            <tr><td style="color:#888;padding:3px 0">Téléphone</td><td>${formData.telephone}</td></tr>
            ${formData.email ? `<tr><td style="color:#888;padding:3px 0">Email</td><td>${formData.email}</td></tr>` : ''}
            <tr><td style="color:#888;padding:3px 0">Adresse</td><td>${formData.adresse}</td></tr>
            <tr><td style="color:#888;padding:3px 0">Ville</td><td>${formData.ville}</td></tr>
            ${formData.notes ? `<tr><td style="color:#888;padding:3px 0">Notes</td><td style="color:#d97706"><em>${formData.notes}</em></td></tr>` : ''}
          </table>
        </div>

        <!-- Items -->
        <div style="background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:16px 20px;margin-bottom:20px">
          <h3 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#555">Articles</h3>
          <table style="width:100%;font-size:14px;border-collapse:collapse">${itemsRows}</table>
          <table style="width:100%;font-size:15px;margin-top:12px">
            <tr>
              <td><strong>Total</strong></td>
              <td style="text-align:right"><strong>${Math.round(totalPrice).toLocaleString('fr-FR')} CFA</strong></td>
            </tr>
          </table>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-top:28px">
          <a href="https://nonstopp.shop/admin/orders"
             style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:12px 28px;border-radius:4px;font-size:14px;letter-spacing:0.04em">
            Gérer la commande →
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:16px 32px;text-align:center;color:#aaa;font-size:11px">
        Nonstop &nbsp;·&nbsp; nonstopp.shop
      </div>
    </div>
  `

  return resend.emails.send({
    from: FROM_EMAIL,
    to: [ADMIN_EMAIL],
    subject: `🛍️ Nouvelle commande #${orderId} — ${formData.nom}`,
    html,
  })
}

// ──────────────────────────────────────────────────────────────────────────────
// Email client — confirmation de commande
// ──────────────────────────────────────────────────────────────────────────────
export async function sendClientOrderConfirmation(data: OrderEmailData) {
  const { orderId, formData, cart, totalPrice } = data

  if (!formData.email) return null

  const itemsRows = cart
    .map((item) => {
      const size = item.selectedSize
        ? `<br/><span style="color:#888;font-size:12px">Taille : ${item.selectedSize}</span>`
        : ''
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0">
            <strong>${item.name}</strong>${size}
            <br/><span style="color:#888;font-size:12px">Qté : ${item.quantity}</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;white-space:nowrap;vertical-align:top">
            ${(item.price * item.quantity).toLocaleString('fr-FR')} CFA
          </td>
        </tr>`
    })
    .join('')

  const html = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <!-- Header -->
      <div style="background:#000;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:0.05em">NONSTOP</h1>
        <p style="color:#aaa;margin:4px 0 0;font-size:13px">Confirmation de commande</p>
      </div>

      <!-- Body -->
      <div style="background:#fafafa;padding:32px;border:1px solid #e8e8e8;border-top:none">
        <p style="margin:0 0 20px;font-size:15px">Bonjour <strong>${formData.nom}</strong>,</p>
        <p style="margin:0 0 28px;font-size:14px;color:#555;line-height:1.6">
          Merci pour votre commande ! Nous l'avons bien reçue et la préparons avec soin.
          Votre numéro de commande est <strong>#${orderId}</strong>.
        </p>

        <!-- Items -->
        <div style="background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:16px 20px;margin-bottom:20px">
          <h3 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#555">Votre commande</h3>
          <table style="width:100%;font-size:14px;border-collapse:collapse">${itemsRows}</table>
          <table style="width:100%;font-size:15px;margin-top:12px">
            <tr>
              <td><strong>Total</strong></td>
              <td style="text-align:right"><strong>${Math.round(totalPrice).toLocaleString('fr-FR')} CFA</strong></td>
            </tr>
          </table>
        </div>

        <!-- Livraison -->
        <div style="background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:16px 20px;margin-bottom:28px">
          <h3 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#555">Livraison</h3>
          <p style="margin:0;font-size:14px;line-height:1.8;color:#444">
            ${formData.nom}<br/>
            ${formData.adresse}<br/>
            ${formData.ville}<br/>
            <span style="color:#888">Tél : ${formData.telephone}</span>
          </p>
        </div>

        <p style="font-size:13px;color:#888;line-height:1.6;margin:0">
          Pour toute question concernant votre commande, répondez directement à cet email.
          Nous vous contacterons prochainement pour confirmer la livraison.
        </p>

        <p style="margin-top:24px;font-size:14px"><strong>À très bientôt sur Nonstop ! 🖤</strong></p>
      </div>

      <!-- Footer -->
      <div style="padding:16px 32px;text-align:center;color:#aaa;font-size:11px">
        Nonstop &nbsp;·&nbsp; nonstopp.shop &nbsp;·&nbsp; Ce message a été envoyé automatiquement.
      </div>
    </div>
  `

  return resend.emails.send({
    from: FROM_EMAIL,
    to: [formData.email],
    subject: `Confirmation de votre commande #${orderId} — Nonstop`,
    html,
  })
}
