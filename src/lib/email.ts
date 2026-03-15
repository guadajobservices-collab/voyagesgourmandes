import { Resend } from 'resend'
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation'
import { OrderReadyEmail } from '@/emails/OrderReady'
import type { OrderWithItems } from '@/types/database.types'

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY ?? 're_placeholder')
}

export async function sendOrderConfirmation(order: OrderWithItems) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email')
    return
  }

  const resend = getResendClient()
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@vge.gp',
      to: order.customer_email,
      subject: `✅ Commande confirmée — ${order.id.slice(0, 8).toUpperCase()}`,
      react: OrderConfirmationEmail({ order }),
    })
  } catch (error) {
    console.error('Email send error (confirmation):', error)
  }
}

export async function sendOrderReady(order: OrderWithItems) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email')
    return
  }

  const resend = getResendClient()
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@vge.gp',
      to: order.customer_email,
      subject: `🍽️ Votre commande est prête !`,
      react: OrderReadyEmail({ order }),
    })
  } catch (error) {
    console.error('Email send error (ready):', error)
  }
}
