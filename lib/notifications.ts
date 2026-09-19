export async function sendAdminPushNotification(orderData: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('[Push Notification] Skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing');
    return;
  }

  const { orderId, formData, totalPrice, cart } = orderData;
  const itemsText = cart.map((item: any) => `- ${item.quantity}x ${item.name} (${item.size || 'N/A'})`).join('\n');

  const message = `🛍️ *NOUVELLE COMMANDE SUR NOSTOPP !* 💸\n\n` +
    `*ID Commande:* #${orderId}\n` +
    `*Client:* ${formData.nom}\n` +
    `*Téléphone:* ${formData.telephone}\n` +
    `*Ville:* ${formData.ville}\n\n` +
    `*Articles:*\n${itemsText}\n\n` +
    `*Total:* ${totalPrice} $`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      console.error('[Push Notification] Telegram API Error:', await response.text());
    } else {
      console.log('[Push Notification] Telegram message sent successfully');
    }
  } catch (error) {
    console.error('[Push Notification] Failed to send Telegram message:', error);
  }
}
