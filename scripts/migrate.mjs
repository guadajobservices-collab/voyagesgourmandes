/**
 * Script de migration via Supabase REST API
 * Usage: node scripts/migrate.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = 'https://supabase.168.231.74.5.sslip.io'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTEwMDAwMDAsImV4cCI6MTkwODc2NjQwMH0.SOXZfiPRt-AFi-unWVaYs32z_QFB3NtW8QD3TdtdRBg'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Test de connexion
async function testConnection() {
  console.log('Testing Supabase connection...')
  const { data, error } = await supabase.from('tenants').select('count').limit(1)
  if (error && error.code === 'PGRST116') {
    console.log('Connection OK (table may not exist yet)')
    return true
  }
  if (error) {
    console.error('Connection error:', error.message, error.code)
    return false
  }
  console.log('Connection OK, tenants table exists')
  return true
}

testConnection().then(ok => {
  if (ok) {
    console.log('\n✅ Supabase accessible')
    console.log('\nNOTE: Pour appliquer les migrations SQL, utilisez:')
    console.log('1. Supabase Studio → SQL Editor → coller le contenu des migrations')
    console.log('2. Ou configurer pg_meta API access')
    console.log('\nFichiers de migration:')
    console.log('  - supabase/migrations/20260315000001_initial_schema.sql')
    console.log('  - supabase/migrations/20260315000002_seed_demo.sql')
  }
})
