---
stepsCompleted: [1, 2, 3]
inputDocuments: [VGE_PRD_v1.0.md, product-brief-voyagesgourmandes-2026-03-14.md]
workflowType: 'architecture'
project_name: 'voyagesgourmandes'
user_name: 'Laurent'
date: '2026-03-15'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Divergences PRD vs Brief (Brief = source de vérité)

| Aspect | PRD v1.0 | Brief produit (source de vérité) |
|---|---|---|
| **Modèle** | 1 plateforme marketplace | Suite de services multi-niveaux |
| **App mobile** | Flutter (iOS + Android) | PWA white-label par restaurant + WhatsApp |
| **WhatsApp** | Phase 3 (SAV uniquement) | MVP canal de commande principal |
| **Scope MVP** | 1 marketplace + back-office | Site vitrine + PWA + Bot WhatsApp + Fidélité par restaurant |

### Requirements Overview

**Functional Requirements (MVP) :**

6 blocs fonctionnels par restaurant signé :
1. **Site vitrine / catalogue** — Pages brandées, menu digital avec photos/prix
2. **Commande en ligne** — Panier, personnalisation, créneaux de retrait
3. **Prépaiement** — Stripe/PayPlug, anti no-show
4. **Bot WhatsApp** — Commande conversationnelle, notifications
5. **Programme fidélité** — Points par commande, récompenses configurables
6. **Dashboard restaurateur basique** — Commandes temps réel, gestion statuts, gestion catalogue

Plus un **back-office agence** pour l'onboarding et la gestion multi-tenants.

**Non-Functional Requirements :**

- **Performance** : < 2s de chargement sur 4G instable aux Antilles
- **Résilience réseau** : mode dégradé obligatoire (cache local, retry)
- **Sécurité** : RGPD, DSP2/3D Secure, données auto-hébergées
- **Scalabilité** : de 4 à 100+ restaurants, chacun avec son instance brandée
- **Disponibilité** : uptime > 99.5%

### Scale & Complexity

- **Domaine principal** : Full-stack (web + API + WhatsApp + paiement)
- **Niveau de complexité** : Élevé — architecture multi-tenant white-label avec génération d'instances par restaurant
- **Composants architecturaux estimés** : ~8-10 (générateur white-label, moteur de commande, gateway paiement, bot WhatsApp, moteur fidélité, dashboard resto, back-office agence, notification service, CDN assets)

### Technical Constraints & Dependencies

- **Infrastructure** : self-hosted via Coolify sur VPS (OVH/Hostinger) — contrainte coût
- **Paiement DOM-TOM** : conformité zone euro + spécificités IBAN/fiscalité outre-mer
- **WhatsApp Business API** : nécessite un BSP (Business Solution Provider) ou Meta Cloud API — coût et approbation Meta
- **Multi-tenant** : chaque restaurant = instance brandée → besoin d'un moteur de génération/configuration

### Cross-Cutting Concerns

- **Multi-tenancy** : isolation des données par restaurant, branding dynamique
- **Authentification** : modèle à définir (compte unique VGE vs comptes isolés par restaurant)
- **Paiement** : Stripe Connect pour les reversements multi-comptes
- **Notifications** : WhatsApp + Push + Email — orchestration multi-canal
- **Observabilité** : monitoring de N instances simultanées

---

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web multi-tenant : Next.js (frontend white-label + dashboard) + Supabase self-hosted (backend/API/auth/realtime) + WhatsApp Cloud API (canal de commande).

### Architecture Multi-Tenant : Décision structurante

**Choix : Single app avec routing dynamique** — 1 seule app Next.js, le restaurant est résolu par sous-domaine ou slug (`chez-jc.vge.gp`). Branding par configuration (logo, couleurs, menu) stockée en base. Seule approche qui scale de 4 à 100+ restaurants sans exploser les coûts d'infrastructure sur VPS.

### Selected Starter

**Initialization Command:**

```bash
npx create-next-app@latest vge-app --typescript --tailwind --eslint --app --src-dir
```

### Stack technique retenue

| Couche | Technologie | Version | Rationale |
|---|---|---|---|
| **Framework web** | Next.js (App Router) | 16.1 | SSR/SSG pour SEO restaurants, React 19.2, React Compiler stable |
| **Langage** | TypeScript | strict mode | Sécurité de type, équipe maîtrise |
| **Styling** | Tailwind CSS | v4 (via @tailwindcss/postcss) | Léger, thémable dynamiquement (branding par resto) |
| **Backend** | Supabase self-hosted | PostgreSQL 15.8+ | Auth + DB + Realtime + Storage + Edge Functions, tout-en-un |
| **Multi-tenancy** | Single app + RLS PostgreSQL | — | 1 déploiement, isolation par données, scale à 100+ |
| **Paiement** | Stripe Connect | — | Multi-vendeur natif, reversements auto |
| **Paiement fallback** | PayPlug | — | Compatibilité DOM-TOM |
| **WhatsApp** | Meta Cloud API | — | Seule option supportée depuis 2025, webhooks via Edge Functions |
| **Déploiement** | Coolify + Docker sur VPS | — | Self-hosted, coût maîtrisé, Supabase natif |
| **Reverse proxy** | Traefik | — | SSL auto, routing sous-domaines |
| **Monitoring** | Uptime Kuma | — | Monitoring uptime plateforme |
| **PWA** | Next.js PWA config | — | Installable sans store, offline capable |
| **App mobile (Phase 2)** | Flutter | — | iOS + Android depuis codebase unique |

**Note :** L'initialisation du projet sera la première story d'implémentation.
