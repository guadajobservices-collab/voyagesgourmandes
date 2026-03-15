import Link from 'next/link'
import RegisterForm from '@/components/auth/RegisterForm'

export default function InscriptionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Créer un compte</h1>
      <p className="text-sm text-gray-500 mb-6">
        Déjà inscrit ?{' '}
        <Link href="/connexion" className="font-medium" style={{ color: 'var(--color-coral)' }}>
          Se connecter
        </Link>
      </p>
      <RegisterForm />
    </div>
  )
}
