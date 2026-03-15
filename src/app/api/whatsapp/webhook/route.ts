import { NextResponse } from 'next/server'
import { parseWhatsAppMessage } from '@/lib/whatsapp'
import { handleWhatsAppMessage } from '@/lib/whatsapp-bot'

// Vérification webhook Meta
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = parseWhatsAppMessage(body)

    if (message) {
      // Traitement asynchrone (ne pas bloquer le webhook)
      void handleWhatsAppMessage(message.from, message.text, message.phoneNumberId)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ status: 'ok' }) // Toujours retourner 200
  }
}
