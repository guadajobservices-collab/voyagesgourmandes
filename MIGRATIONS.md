# 🗄️ Appliquer les migrations SQL

## Méthode via Supabase Studio (recommandée)

1. Ouvrir `https://supabase.168.231.74.5.sslip.io`
2. Se connecter → **SQL Editor**
3. Copier-coller et exécuter dans l'ordre :

### Migration 1 — Schema initial
```
supabase/migrations/20260315000001_initial_schema.sql
```
Contient : tables, RLS, triggers, indexes, helper functions.

### Migration 2 — Données de démo
```
supabase/migrations/20260315000002_seed_demo.sql
```
Contient : restaurant "Chez Démo" avec menu antillais complet.

## Vérification

Après migration, vérifier dans Studio → Table Editor :
- ✅ `tenants` — 1 ligne (Chez Démo)
- ✅ `tenant_config` — 1 ligne (config couleurs)
- ✅ `menus` — 4 catégories
- ✅ `menu_items` — 11 plats

## Storage buckets à créer

Dans Supabase Studio → Storage :
- `logos` (public)
- `menu-photos` (public)

## Configuration Stripe Webhook

```
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

Événements à écouter :
- `checkout.session.completed`
- `payment_intent.payment_failed`
