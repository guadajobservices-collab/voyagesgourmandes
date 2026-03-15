'use client'

import { useEffect } from 'react'
import type { TenantConfig } from '@/types/database.types'

interface TenantThemeProviderProps {
  config: TenantConfig | null
  children: React.ReactNode
}

export default function TenantThemeProvider({ config, children }: TenantThemeProviderProps) {
  useEffect(() => {
    if (!config) return

    const root = document.documentElement
    root.style.setProperty('--tenant-primary', config.primary_color)
    root.style.setProperty('--tenant-secondary', config.secondary_color)
    root.style.setProperty('--tenant-accent', config.accent_color)
  }, [config])

  const style = config
    ? ({
        '--tenant-primary': config.primary_color,
        '--tenant-secondary': config.secondary_color,
        '--tenant-accent': config.accent_color,
      } as React.CSSProperties)
    : {}

  return (
    <div style={style} className="min-h-screen">
      {children}
    </div>
  )
}
