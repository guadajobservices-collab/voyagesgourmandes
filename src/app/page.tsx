import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🌴</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          <span style={{ color: '#FF6B35' }}>Voyage</span>{' '}
          <span style={{ color: '#2EC4B6' }}>Gourmand</span>{' '}
          <span style={{ color: '#3D8B37' }}>Express</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          La saveur antillaise connectée
        </p>
        <p className="text-gray-500 max-w-lg mx-auto mb-10">
          Commandez vos plats antillais favoris en ligne, payez en toute sécurité
          et récupérez votre repas au créneau choisi.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/chez-demo"
            className="btn-primary text-lg px-8 py-3"
            style={{ backgroundColor: '#FF6B35' }}
          >
            🍽️ Voir le restaurant démo
          </a>
          <Link
            href="/connexion"
            className="px-8 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 transition inline-flex items-center justify-center"
          >
            Espace restaurateur
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { emoji: '📱', title: 'PWA installable', desc: 'Comme une app, sans passer par les stores' },
            { emoji: '🔒', title: 'Paiement sécurisé', desc: 'Stripe 3D Secure — anti no-show' },
            { emoji: '⭐', title: 'Programme fidélité', desc: 'Points par commande, récompenses exclusives' },
          ].map(f => (
            <div key={f.title} className="card text-center">
              <div className="text-3xl mb-2">{f.emoji}</div>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
