import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export default function ConnexionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Connexion</h1>
      <p className="text-sm text-gray-500 mb-6">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="font-medium" style={{ color: 'var(--color-coral)' }}>
          Créer un compte
        </Link>
      </p>
      <LoginForm />
    </div>
  )
}
