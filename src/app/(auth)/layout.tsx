export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo VGE */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold">
            <span className="text-3xl">🌴</span>
            <span style={{ color: 'var(--color-coral)' }}>Voyage</span>
            <span style={{ color: 'var(--color-turquoise)' }}>Gourmand</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">La saveur antillaise connectée</p>
        </div>
        <div className="card">
          {children}
        </div>
      </div>
    </div>
  )
}
