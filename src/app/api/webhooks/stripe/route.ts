import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { sendOrderConfirmation } from '@/lib/email'
import type Stripe from 'stripe'
import type { OrderWithItems } from '@/types/database.types'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.order_id

        if (!orderId) break

        const { data: order } = await supabase
          .from('orders')
          .update({
            status: 'paid' as const,
            stripe_payment_id: session.payment_intent as string,
          })
          .eq('id', orderId)
          .select('*, order_items(*)')
          .single()

        if (order) {
          const points = Math.floor(Number(order.total_amount))
          if (order.customer_id) {
            await supabase.from('loyalty_points').insert({
              tenant_id: order.tenant_id,
              customer_id: order.customer_id,
              order_id: order.id,
              points,
              type: 'earned' as const,
              description: `Commande #${order.id.slice(0, 8)}`,
            })
          }

          await sendOrderConfirmation(order as OrderWithItems)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.order_id

        if (orderId) {
          await supabase
            .from('orders')
            .update({ status: 'cancelled' as const })
            .eq('id', orderId)
        }
        break
      }
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
