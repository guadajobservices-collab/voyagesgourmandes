const WHATSAPP_API_URL = 'https://graph.facebook.com/v20.0'

export async function sendWhatsAppMessage(
  to: string,
  text: string,
  phoneNumberId: string
) {
  const token = process.env.WHATSAPP_TOKEN
  if (!token) {
    console.warn('WHATSAPP_TOKEN not set')
    return
  }

  const response = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('WhatsApp API error:', error)
  }

  return response
}

export function parseWhatsAppMessage(body: WhatsAppWebhookBody): ParsedMessage | null {
  const entry = body.entry?.[0]
  const change = entry?.changes?.[0]
  const message = change?.value?.messages?.[0]

  if (!message) return null

  return {
    from: message.from,
    text: message.text?.body ?? '',
    messageId: message.id,
    phoneNumberId: change.value.metadata.phone_number_id,
  }
}

interface WhatsAppWebhookBody {
  entry?: Array<{
    changes?: Array<{
      value: {
        metadata: { phone_number_id: string }
        messages?: Array<{
          from: string
          id: string
          text?: { body: string }
        }>
      }
    }>
  }>
}

interface ParsedMessage {
  from: string
  text: string
  messageId: string
  phoneNumberId: string
}
