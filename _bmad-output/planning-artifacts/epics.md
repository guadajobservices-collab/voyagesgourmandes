---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: [VGE_PRD_v1.0.md, product-brief-voyagesgourmandes-2026-03-14.md, architecture.md]
status: complete
date: 2026-03-15
---

# voyagesgourmandes - Epic Breakdown

## Requirements Inventory

### Functional Requirements

FR1: Site vitrine digital brandé par restaurant (logo, couleurs, description)
FR2: Catalogue/menu digital avec photos et prix par restaurant
FR3: Système de commande en ligne (panier, personnalisation, créneaux de retrait)
FR4: Prépaiement en ligne (Stripe Connect, anti no-show)
FR5: Notification client "commande prête" (WhatsApp + Email)
FR6: Bot WhatsApp de commande conversationnelle
FR7: Programme de fidélisation (points par commande, récompenses configurables)
FR8: Dashboard restaurateur — commandes en temps réel
FR9: Dashboard restaurateur — gestion statuts (reçue → en préparation → prête)
FR10: Dashboard restaurateur — gestion catalogue/menu
FR11: Back-office Agence Club Créole — onboarding multi-restaurants
FR12: Back-office Agence Club Créole — gestion multi-tenants
FR13: Multi-tenancy par slug/sous-domaine (`chez-jc.vge.gp`)
FR14: PWA installable sans passer par les stores
FR15: Authentification restaurateur, client, et admin

### Non-Functional Requirements

NFR1: Performance < 2s de chargement sur 4G instable aux Antilles
NFR2: Résilience réseau — mode dégradé (cache local, retry automatique)
NFR3: RGPD — données auto-hébergées sur VPS
NFR4: DSP2 / 3D Secure obligatoire pour les paiements
NFR5: Scalabilité de 4 à 100+ restaurants sans changement d'infrastructure
NFR6: Uptime > 99.5%
NFR7: Déploiement Coolify + Docker sur VPS self-hosted
NFR8: Données isolées par restaurant (Row Level Security PostgreSQL)

### Additional Requirements (Architecture)

- Initialisation Next.js App Router déjà effectuée (projet en place)
- Supabase self-hosted existant sur le VPS (supabase.168.231.74.5.sslip.io)
- Single app Next.js avec routing dynamique par slug de restaurant
- Branding dynamique via CSS variables (logo, couleurs) stocké en base
- Stripe Connect pour reversements multi-vendeurs
- Meta Cloud API pour WhatsApp Business (webhooks via API routes)
- Tailwind CSS v4 avec `@tailwindcss/postcss` (pas de tailwind.config.js)
- TypeScript strict mode
- Path alias `@/*` → `./src/*`

### UX Design Requirements

UX-DR1: Design épuré et mobile-first — restauration antillaise, clientèle working mom + professionnel
UX-DR2: Commande client en < 3 minutes de l'ouverture au paiement
UX-DR3: Dashboard restaurateur lisible d'un coup d'œil (statuts visuels clairs)
UX-DR4: Interface restaurant brandée — le client doit percevoir l'identité du restaurant, pas VGE
UX-DR5: Onboarding restaurateur rapide — < 48h de la signature à la 1ère commande

### FR Coverage Map

FR1: Epic 2 — Branding & site vitrine restaurant
FR2: Epic 3 — Catalogue/menu digital
FR3: Epic 4 — Moteur de commande client
FR4: Epic 4 — Paiement Stripe Connect
FR5: Epic 5 — Notifications multi-canal
FR6: Epic 6 — Bot WhatsApp
FR7: Epic 7 — Programme fidélité
FR8: Epic 4 — Dashboard restaurateur commandes
FR9: Epic 4 — Gestion statuts commandes
FR10: Epic 3 — Gestion catalogue/menu dashboard
FR11: Epic 8 — Back-office Agence
FR12: Epic 8 — Back-office Agence multi-tenants
FR13: Epic 1 — Infrastructure multi-tenant
FR14: Epic 1 — PWA
FR15: Epic 2 — Authentification

## Epic List

### Epic 1: Infrastructure multi-tenant & fondations
Fondation technique : routing par slug de restaurant, base de données multi-tenant avec RLS, configuration Supabase, PWA, middleware tenant.
**FRs couverts :** FR13, FR14, NFR2, NFR3, NFR5, NFR7, NFR8

### Epic 2: Authentification & profils restaurant
Les restaurateurs, clients et admins peuvent s'inscrire, se connecter, et les restaurants peuvent configurer leur profil et leur branding (logo, couleurs, nom).
**FRs couverts :** FR1, FR15

### Epic 3: Catalogue & menu digital
Les restaurateurs peuvent créer et gérer leur menu (catégories, plats, photos, prix). Les clients peuvent consulter le catalogue brandé du restaurant.
**FRs couverts :** FR2, FR10

### Epic 4: Moteur de commande & paiement
Les clients peuvent commander en ligne, payer en prépaiement (Stripe Connect), et les restaurateurs peuvent gérer les commandes en temps réel avec gestion des statuts.
**FRs couverts :** FR3, FR4, FR8, FR9, NFR1, NFR4, UX-DR2, UX-DR3

### Epic 5: Notifications
Les clients reçoivent une notification "commande prête" par email et/ou WhatsApp. Les restaurateurs sont notifiés des nouvelles commandes.
**FRs couverts :** FR5, NFR2

### Epic 6: Bot WhatsApp
Les clients peuvent passer commande directement via WhatsApp Business (Meta Cloud API) avec le même catalogue et système de paiement.
**FRs couverts :** FR6

### Epic 7: Programme de fidélité
Les clients cumulent des points à chaque commande et peuvent les échanger contre des récompenses configurées par le restaurateur.
**FRs couverts :** FR7

### Epic 8: Back-office Agence Club Créole
L'Agence peut onboarder de nouveaux restaurants, gérer tous les tenants depuis une interface centralisée, et accéder aux analytics.
**FRs couverts :** FR11, FR12

---

## Epic 1: Infrastructure multi-tenant & fondations

Mettre en place les fondations techniques : schema DB multi-tenant avec RLS, middleware de résolution du tenant par slug, système de branding dynamique, et configuration PWA.

### Story 1.1: Schema base de données multi-tenant

As a developer,
I want a complete multi-tenant PostgreSQL schema with Row Level Security,
So that each restaurant's data is isolated and secure.

**Status:** draft

**Acceptance Criteria:**
- AC1: Tables `tenants`, `tenant_config`, `users`, `menus`, `menu_items`, `orders`, `order_items`, `loyalty_points`, `loyalty_rewards` créées
- AC2: RLS activé sur toutes les tables avec policies `tenant_id`
- AC3: Migrations Supabase versionnées dans `supabase/migrations/`
- AC4: Seed data avec 1 restaurant de démo (`slug: chez-demo`)
- AC5: Types TypeScript générés depuis le schema Supabase

**Tasks:**
- [ ] Créer fichier migration SQL initial dans `supabase/migrations/`
- [ ] Définir toutes les tables avec leurs colonnes et contraintes
- [ ] Activer RLS et créer les policies pour chaque table
- [ ] Créer seed data restaurant démo
- [ ] Générer les types TypeScript avec `supabase gen types typescript`
- [ ] Sauvegarder les types dans `src/types/database.types.ts`

---

### Story 1.2: Middleware de résolution du tenant

As a developer,
I want a Next.js middleware that resolves the current restaurant from the URL slug,
So that each request is properly scoped to its tenant.

**Status:** draft

**Acceptance Criteria:**
- AC1: Middleware lit le slug depuis l'URL (`/[slug]/...` ou sous-domaine)
- AC2: Tenant résolu et injecté dans les headers de la requête
- AC3: Tenant inexistant → 404 propre
- AC4: Routes admin et API exclues du middleware tenant
- AC5: Types TypeScript pour `TenantContext`

**Tasks:**
- [ ] Créer `src/middleware.ts` avec logique de résolution tenant
- [ ] Créer `src/lib/tenant.ts` — helper pour récupérer le tenant depuis headers/context
- [ ] Définir type `TenantContext` dans `src/types/tenant.ts`
- [ ] Tester avec tenant démo

---

### Story 1.3: Configuration PWA

As a customer,
I want to install the restaurant's app on my phone without going to an app store,
So that I can order quickly without friction.

**Status:** draft

**Acceptance Criteria:**
- AC1: `manifest.json` dynamique par restaurant (nom, icône, couleurs)
- AC2: Service worker basique pour cache offline des assets statiques
- AC3: Meta tags PWA dans le layout
- AC4: Score Lighthouse PWA > 90

**Tasks:**
- [ ] Créer `src/app/[slug]/manifest.json/route.ts` — manifest dynamique
- [ ] Ajouter meta tags PWA dans `src/app/[slug]/layout.tsx`
- [ ] Configurer next.config.ts pour PWA headers

---

## Epic 2: Authentification & profils restaurant

Les acteurs du système peuvent s'authentifier et gérer leurs profils. Les restaurants peuvent configurer leur branding.

### Story 2.1: Authentification Supabase (restaurateur + client + admin)

As a user (restaurateur, client, or admin),
I want to register and log in securely,
So that I can access my personalized dashboard or order history.

**Status:** draft

**Acceptance Criteria:**
- AC1: Inscription par email/password pour clients et restaurateurs
- AC2: Connexion/déconnexion fonctionnelle
- AC3: Rôles `restaurateur`, `client`, `admin` gérés via Supabase Auth metadata
- AC4: Pages `/connexion` et `/inscription` responsive et brandées VGE
- AC5: Redirect post-login selon rôle (restaurateur → dashboard, client → restaurant home)
- AC6: Session persistée via Supabase client SSR

**Tasks:**
- [ ] Configurer Supabase client (SSR) dans `src/lib/supabase/`
- [ ] Créer `src/app/(auth)/connexion/page.tsx`
- [ ] Créer `src/app/(auth)/inscription/page.tsx`
- [ ] Créer server actions pour login/logout/register
- [ ] Middleware de protection des routes authentifiées
- [ ] Hook `useUser()` côté client

---

### Story 2.2: Profil & branding restaurant

As a restaurateur,
I want to configure my restaurant's branding (name, logo, colors, description),
So that customers see my identity when they order.

**Status:** draft

**Acceptance Criteria:**
- AC1: Page de configuration branding dans le dashboard restaurateur
- AC2: Upload logo (Supabase Storage)
- AC3: Sélecteur de couleur primaire et secondaire
- AC4: Prévisualisation live du branding
- AC5: Branding appliqué dynamiquement via CSS variables sur le site client
- AC6: Sous-domaine/slug configuré et lisible

**Tasks:**
- [ ] Créer `src/app/dashboard/settings/branding/page.tsx`
- [ ] Créer server action `updateRestaurantBranding`
- [ ] Configurer Supabase Storage pour logos
- [ ] Créer `src/components/TenantThemeProvider.tsx` — CSS variables dynamiques
- [ ] Appliquer ThemeProvider dans `src/app/[slug]/layout.tsx`

---

## Epic 3: Catalogue & menu digital

Les restaurateurs gèrent leur menu, les clients le consultent dans une interface brandée.

### Story 3.1: Gestion du menu — CRUD dashboard

As a restaurateur,
I want to create and manage my menu with categories and items (name, description, price, photo),
So that customers can see what I offer.

**Status:** draft

**Acceptance Criteria:**
- AC1: CRUD complet catégories de menu
- AC2: CRUD complet plats (nom, description, prix, photo, disponibilité)
- AC3: Upload photo via Supabase Storage
- AC4: Ordre d'affichage configurable (drag-and-drop ou champs de tri)
- AC5: Toggle disponibilité par plat (rupture de stock)
- AC6: Interface dashboard lisible et rapide

**Tasks:**
- [ ] Créer `src/app/dashboard/menu/page.tsx` — liste catégories + plats
- [ ] Créer `src/app/dashboard/menu/[categoryId]/page.tsx` — plats par catégorie
- [ ] Server actions: `createCategory`, `updateCategory`, `deleteCategory`
- [ ] Server actions: `createMenuItem`, `updateMenuItem`, `deleteMenuItem`, `toggleAvailability`
- [ ] Composant `MenuItemForm` avec upload photo
- [ ] Composant `CategoryCard` avec liste de plats

---

### Story 3.2: Vitrine catalogue client (site public)

As a customer,
I want to browse my restaurant's digital menu with photos and prices,
So that I can choose what to order before adding to cart.

**Status:** draft

**Acceptance Criteria:**
- AC1: Page catalogue accessible via `/{slug}` ou sous-domaine
- AC2: Affichage par catégories avec photos, noms, descriptions, prix
- AC3: Branding restaurant appliqué (couleurs, logo)
- AC4: Plats indisponibles marqués visuellement
- AC5: Chargement < 2s sur 4G (images optimisées Next.js)
- AC6: Design mobile-first

**Tasks:**
- [ ] Créer `src/app/[slug]/page.tsx` — page catalogue
- [ ] Créer `src/components/catalog/MenuSection.tsx`
- [ ] Créer `src/components/catalog/MenuItemCard.tsx`
- [ ] Créer `src/lib/menu.ts` — fetching menu avec cache
- [ ] Optimisation images via `next/image`

---

## Epic 4: Moteur de commande & paiement

Les clients commandent et paient, les restaurateurs gèrent les commandes en temps réel.

### Story 4.1: Panier et formulaire de commande

As a customer,
I want to add items to my cart and specify pickup time and notes,
So that I can complete my order.

**Status:** draft

**Acceptance Criteria:**
- AC1: Bouton "Ajouter au panier" sur chaque plat
- AC2: Panier persisté (localStorage + état React)
- AC3: Récapitulatif panier avec quantités modifiables
- AC4: Champ notes de commande
- AC5: Sélecteur créneau de retrait (horaires configurés par le restaurant)
- AC6: Récapitulatif total clair avant paiement

**Tasks:**
- [ ] Créer `src/lib/cart.ts` — state management panier (Zustand ou Context)
- [ ] Créer `src/components/cart/CartDrawer.tsx`
- [ ] Créer `src/components/cart/CartItem.tsx`
- [ ] Créer `src/app/[slug]/checkout/page.tsx`
- [ ] Créer `src/components/checkout/TimeSlotPicker.tsx`

---

### Story 4.2: Paiement Stripe Connect

As a customer,
I want to pay securely online with my card,
So that my order is confirmed without risk of no-show.

**Status:** draft

**Acceptance Criteria:**
- AC1: Stripe Checkout Session créée via API route
- AC2: Paiement 3D Secure / DSP2 conforme
- AC3: Webhook Stripe traite les événements `payment_intent.succeeded`
- AC4: Commande créée en base après confirmation paiement
- AC5: Email de confirmation envoyé au client
- AC6: Reversement automatique vers le compte Stripe Connect du restaurant

**Tasks:**
- [ ] Configurer Stripe Connect (`src/lib/stripe.ts`)
- [ ] Créer `src/app/api/checkout/route.ts` — création session Stripe
- [ ] Créer `src/app/api/webhooks/stripe/route.ts` — webhook handler
- [ ] Créer `src/app/[slug]/checkout/success/page.tsx`
- [ ] Créer `src/app/[slug]/checkout/cancel/page.tsx`
- [ ] Ajouter variables env Stripe dans `.env.example`

---

### Story 4.3: Dashboard commandes temps réel

As a restaurateur,
I want to see incoming orders in real-time on my dashboard,
So that I can prepare them in the right order.

**Status:** draft

**Acceptance Criteria:**
- AC1: Liste des commandes en temps réel (Supabase Realtime)
- AC2: Chaque commande affiche : heure, client, plats commandés, total, créneau retrait
- AC3: Notifications sonores/visuelles pour nouvelles commandes
- AC4: Filtre par statut (toutes, en attente, en préparation, prêtes)
- AC5: Vue mobile utilisable en cuisine

**Tasks:**
- [ ] Créer `src/app/dashboard/commandes/page.tsx`
- [ ] Créer `src/components/dashboard/OrderCard.tsx`
- [ ] Créer `src/components/dashboard/OrderList.tsx`
- [ ] Hook `useRealtimeOrders()` avec Supabase Realtime
- [ ] Son de notification (Web Audio API)

---

### Story 4.4: Gestion des statuts de commande

As a restaurateur,
I want to update order statuses (received → preparing → ready),
So that customers are notified when to pick up.

**Status:** draft

**Acceptance Criteria:**
- AC1: Boutons d'action clairs sur chaque commande (passer au statut suivant)
- AC2: Historique des changements de statut
- AC3: Notification déclenchée automatiquement au statut "prête"
- AC4: Confirmation avant annulation de commande
- AC5: Motif de refus requis si commande annulée

**Tasks:**
- [ ] Server action `updateOrderStatus`
- [ ] Composant `OrderStatusButtons.tsx`
- [ ] Intégration notification (trigger vers Epic 5)
- [ ] Page `src/app/dashboard/commandes/[orderId]/page.tsx` — détail commande

---

## Epic 5: Notifications

Les clients et restaurateurs reçoivent des notifications pertinentes via email et WhatsApp.

### Story 5.1: Notifications email (Resend)

As a customer,
I want to receive an email when my order is confirmed and when it's ready,
So that I know when to come pick it up.

**Status:** draft

**Acceptance Criteria:**
- AC1: Email de confirmation de commande envoyé immédiatement après paiement
- AC2: Email "commande prête" envoyé quand le statut passe à "prête"
- AC3: Emails brandés avec le nom et logo du restaurant
- AC4: Templates React Email
- AC5: Envoi via Resend API

**Tasks:**
- [ ] Installer `resend` et `@react-email/components`
- [ ] Créer `src/lib/email.ts` — client Resend
- [ ] Créer `src/emails/OrderConfirmation.tsx` — template email
- [ ] Créer `src/emails/OrderReady.tsx` — template email
- [ ] Intégrer envoi dans webhook Stripe et action updateOrderStatus

---

## Epic 6: Bot WhatsApp

Les clients peuvent commander via WhatsApp Business avec le même système.

### Story 6.1: Webhook WhatsApp Meta Cloud API

As a customer,
I want to place an order via WhatsApp conversation,
So that I can order without downloading an app or opening a website.

**Status:** draft

**Acceptance Criteria:**
- AC1: Webhook Meta Cloud API reçoit et traite les messages entrants
- AC2: Bot répond avec le menu du restaurant
- AC3: Client peut sélectionner des plats par numéro
- AC4: Bot génère un lien de paiement Stripe
- AC5: Confirmation de commande envoyée via WhatsApp
- AC6: Gestion des erreurs et messages incompris

**Tasks:**
- [ ] Créer `src/app/api/whatsapp/webhook/route.ts`
- [ ] Créer `src/lib/whatsapp.ts` — client Meta Cloud API
- [ ] Créer `src/lib/whatsapp-bot.ts` — logique conversationnelle (machine à états)
- [ ] Intégrer avec catalogue menu et système de commande
- [ ] Variables env WhatsApp dans `.env.example`

---

## Epic 7: Programme de fidélité

Les clients cumulent et échangent des points.

### Story 7.1: Système de points fidélité

As a customer,
I want to earn loyalty points on every order and redeem them for rewards,
So that I'm incentivized to come back to my favorite restaurant.

**Status:** draft

**Acceptance Criteria:**
- AC1: Points crédités automatiquement après commande complétée (configurable : X points par euro)
- AC2: Historique des points visible par le client
- AC3: Catalogue de récompenses configurable par le restaurateur
- AC4: Récompense applicable comme réduction sur une commande
- AC5: Dashboard restaurateur — configuration du programme fidélité

**Tasks:**
- [ ] Créer tables `loyalty_points` et `loyalty_rewards` (déjà dans schema Epic 1)
- [ ] Server action `creditLoyaltyPoints` (déclenchée après commande)
- [ ] Créer `src/app/[slug]/fidelite/page.tsx` — espace fidélité client
- [ ] Créer `src/app/dashboard/fidelite/page.tsx` — config restaurateur
- [ ] Intégrer réduction fidélité dans checkout

---

## Epic 8: Back-office Agence Club Créole

L'Agence peut gérer tous les restaurants depuis une interface centralisée.

### Story 8.1: Back-office admin — gestion multi-restaurants

As an Agency admin (Club Créole),
I want a back-office to onboard new restaurants and manage all tenants,
So that I can scale from 4 to 100+ restaurants efficiently.

**Status:** draft

**Acceptance Criteria:**
- AC1: Liste de tous les restaurants (nom, slug, statut, date création, nb commandes)
- AC2: Création d'un nouveau tenant restaurant (nom, slug, email restaurateur)
- AC3: Accès en tant que restaurateur (impersonation) pour support
- AC4: Analytics globaux (commandes totales, revenus, restaurants actifs)
- AC5: Interface protégée par rôle `admin`

**Tasks:**
- [ ] Créer `src/app/admin/page.tsx` — dashboard admin
- [ ] Créer `src/app/admin/restaurants/page.tsx` — liste restaurants
- [ ] Créer `src/app/admin/restaurants/new/page.tsx` — création restaurant
- [ ] Server actions admin : `createTenant`, `getTenantStats`
- [ ] Middleware protection route `/admin` (rôle admin uniquement)
