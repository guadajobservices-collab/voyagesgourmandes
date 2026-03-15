import Link from 'next/link'

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ order_id?: string }>
}) {
  const { slug } = await params
  const { order_id } = await searchParams

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="card">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-gray-500 mb-2">
            Votre paiement a été accepté. Vous recevrez un email de confirmation.
          </p>
          {order_id && (
            <p className="text-xs text-gray-400 mb-6">
              Référence : {order_id.slice(0, 8).toUpperCase()}
            </p>
          )}
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-orange-800">
              🔔 Vous serez notifié par email quand votre commande sera prête.
            </p>
          </div>
          <Link
            href={`/${slug}`}
            className="btn-primary w-full"
            style={{ backgroundColor: 'var(--tenant-primary)' }}
          >
            Retour au menu
          </Link>
        </div>
      </div>
    </div>
  )
}
