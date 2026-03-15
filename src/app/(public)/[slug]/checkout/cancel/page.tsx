import Link from 'next/link'

export default async function CheckoutCancelPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="card">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement annulé</h1>
          <p className="text-gray-500 mb-6">
            Votre commande n&apos;a pas été validée. Votre panier a été conservé.
          </p>
          <Link
            href={`/${slug}/checkout`}
            className="btn-primary w-full mb-3 block"
            style={{ backgroundColor: 'var(--tenant-primary)' }}
          >
            Réessayer
          </Link>
          <Link href={`/${slug}`} className="text-sm text-gray-500 hover:text-gray-700">
            Retour au menu
          </Link>
        </div>
      </div>
    </div>
  )
}
