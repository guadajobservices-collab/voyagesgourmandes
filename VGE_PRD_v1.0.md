# 🍽 Voyage Gourmand Express
## Product Requirements Document (PRD)

> **L'innovation au service de la tradition antillaise.**

| Champ | Valeur |
|---|---|
| **Document** | Product Requirements Document (PRD) |
| **Version** | 1.0 — Mars 2026 |
| **Statut** | Draft — En cours de validation |
| **Auteur** | Équipe Produit — Agence Club Créole |
| **Marché cible** | Guadeloupe, Martinique, Saint-Martin |
| **Lancement cible** | T3 2026 |

---

## Table des matières

1. [Résumé Exécutif](#1-résumé-exécutif)
2. [Contexte & Problématique](#2-contexte--problématique)
3. [Objectifs du Projet](#3-objectifs-du-projet)
4. [Utilisateurs Cibles & Personas](#4-utilisateurs-cibles--personas)
5. [Fonctionnalités & Spécifications](#5-fonctionnalités--spécifications)
6. [Architecture Technique](#6-architecture-technique)
7. [Expérience Utilisateur & Parcours Clés](#7-expérience-utilisateur--parcours-clés)
8. [Modèle Économique](#8-modèle-économique)
9. [Roadmap & Phases de Développement](#9-roadmap--phases-de-développement)
10. [Risques & Mitigations](#10-risques--mitigations)
11. [Contraintes & Hypothèses](#11-contraintes--hypothèses)
12. [Glossaire](#12-glossaire)

---

## 1. Résumé Exécutif

Voyage Gourmand Express est une plateforme **B2B2C de services numériques** dédiée aux restaurants antillais. Elle permet aux restaurateurs de proposer la commande en ligne avec prépaiement, la gestion de la fidélité client, et l'analyse des données de vente — le tout depuis une interface unifiée.

Face à l'essor des commandes à distance et à la demande croissante de digitalisation dans la restauration caribéenne, Voyage Gourmand Express se positionne comme la **solution locale de référence**, pensée pour valoriser l'authenticité culinaire antillaise tout en optimisant la rentabilité des établissements partenaires.

### Vision produit

Devenir la plateforme incontournable de la gastronomie caribéenne connectée, en offrant aux restaurants une suite complète de services digitaux accessibles, rentables et culturellement ancrés.

### Proposition de valeur

- **Pour les clients** : commander leurs plats antillais préférés en quelques clics, sans attente, avec paiement sécurisé.
- **Pour les restaurateurs** : sécuriser leurs revenus grâce au prépaiement, anticiper la production, et fidéliser leur clientèle avec des outils data-driven.
- **Pour l'écosystème** : valoriser et préserver le savoir-faire culinaire antillais à l'ère du numérique.

---

## 2. Contexte & Problématique

### 2.1 Contexte de marché

La restauration en Guadeloupe et dans les Antilles françaises fait face à une **transformation numérique accélérée** post-COVID. Les consommateurs, de plus en plus connectés, attendent des expériences fluides et digitales que les solutions généralistes (Uber Eats, Deliveroo) ne parviennent pas à couvrir avec sensibilité culturelle et ancrage local.

### 2.2 Problèmes identifiés

**Côté client**
- Longues files d'attente aux comptoirs, surtout le midi
- Manque de visibilité sur les menus, disponibilités et horaires
- Absence de moyens de paiement dématérialisés chez de nombreux restaurateurs
- Expérience d'achat fragmentée et peu fidélisante

**Côté restaurateur**
- Difficultés à planifier la production (gaspillage alimentaire élevé)
- Pertes financières liées aux no-shows et désistements
- Manque d'outils d'analyse client pour adapter les menus
- Faible présence digitale face aux géants de la livraison

### 2.3 Opportunité

Le marché caribéen de la restauration reste **peu digitalisé mais en forte demande**. Une plateforme locale, adaptée aux spécificités culturelles et opérationnelles des restaurants antillais, représente une opportunité stratégique avec peu de concurrence directe sur le segment B2B2C de services (hors livraison pure).

---

## 3. Objectifs du Projet

### 3.1 Objectifs business

- Onboarder **50 restaurants partenaires** en Guadeloupe dans les 6 premiers mois post-lancement
- Atteindre **5 000 utilisateurs actifs mensuels** en fin d'année 1
- Générer un chiffre d'affaires récurrent (SaaS + commissions) couvrant les coûts opérationnels dès le mois 9
- S'étendre à la Martinique et Saint-Martin en année 2

### 3.2 Objectifs produit

- Livrer une **application mobile** (iOS + Android) et une interface web pour les clients finaux
- Fournir un **back-office complet** pour les restaurateurs partenaires
- Intégrer un système de **paiement sécurisé** avec prépaiement
- Déployer un **moteur de fidélité** et de recommandations personnalisées
- Offrir des **tableaux de bord analytiques** en temps réel aux restaurateurs

### 3.3 Indicateurs clés de succès (KPIs)

| KPI | Objectif M6 | Objectif M12 |
|---|---|---|
| Restaurants partenaires | 50 | 150 |
| Utilisateurs actifs mensuels | 2 000 | 5 000 |
| Taux de rétention (restaurateurs) | > 80% | > 85% |
| Note satisfaction (NPS) | > 40 | > 55 |
| Valeur panier moyen | > 12 € | > 15 € |

---

## 4. Utilisateurs Cibles & Personas

### 4.1 Persona 1 — Le Client Final : Marlène, 34 ans

> Secrétaire médicale à Pointe-à-Pitre. Pause déjeuner de 45 minutes. Fan de cuisine créole mais ne supporte plus les files d'attente. Elle utilise son smartphone pour tout gérer.

- **Besoin** : Commander à l'avance depuis le bureau et récupérer son plat sans attendre
- **Frustration** : Arriver et apprendre que le plat est épuisé
- **Valeur attendue** : Gain de temps, confirmation en temps réel, paiement sans contact

### 4.2 Persona 2 — Le Restaurateur : Jean-Claude, 52 ans

> Propriétaire d'un restaurant créole à Abymes depuis 15 ans. Excellent cuisinier, peu à l'aise avec le numérique. Souffre du gaspillage alimentaire et des no-shows.

- **Besoin** : Un outil simple pour gérer les commandes à l'avance et sécuriser ses recettes
- **Frustration** : Préparer trop ou trop peu, sans visibilité sur la demande
- **Valeur attendue** : Interface intuitive, prépaiement automatique, tableau de bord lisible

### 4.3 Persona 3 — L'Administrateur Plateforme

> Membre de l'équipe Voyage Gourmand Express. Gère l'onboarding des restaurants, supervise les transactions, modère les avis et pilote la croissance.

- **Besoin** : Back-office puissant pour gérer les partenaires et monitorer la plateforme
- **Valeur attendue** : Accès aux KPIs en temps réel, gestion des comptes et du support

---

## 5. Fonctionnalités & Spécifications

> Légende priorités : 🔴 Haute · 🟡 Moyenne · 🟢 Basse  
> Légende effort : XS · S · M · L · XL

### 5.1 Application Mobile Client (iOS + Android)

| Fonctionnalité | Description | Priorité | Effort |
|---|---|---|---|
| Catalogue restaurants | Recherche et filtres par cuisine, localisation, disponibilité | 🔴 Haute | M |
| Commande en ligne | Ajout au panier, personnalisation, confirmation temps réel | 🔴 Haute | L |
| Prépaiement sécurisé | Stripe / PayPlug, Apple Pay, Google Pay, paiement CB | 🔴 Haute | L |
| Suivi de commande | Statuts en temps réel : reçue, en préparation, prête | 🔴 Haute | M |
| Programme fidélité | Points accumulés par commande, niveaux, récompenses | 🔴 Haute | M |
| Notifications push | Confirmation, prêt à récupérer, offres personnalisées | 🔴 Haute | S |
| Historique commandes | Re-commander en 1 clic, suivi des dépenses | 🟡 Moyenne | S |
| Avis & notes | Notation restaurant et plat après récupération | 🟡 Moyenne | S |
| Offres personnalisées | Promotions basées sur l'historique et les préférences | 🟡 Moyenne | M |
| Profil utilisateur | Préférences alimentaires, adresses, moyens de paiement | 🔴 Haute | S |
| Mode invité | Commande sans création de compte obligatoire | 🟡 Moyenne | S |
| Partage social | Partager un restaurant ou un plat avec ses contacts | 🟢 Basse | XS |

### 5.2 Back-Office Restaurateur (Web App)

| Fonctionnalité | Description | Priorité | Effort |
|---|---|---|---|
| Gestion du menu | Création, modification, activation/désactivation des plats | 🔴 Haute | M |
| Tableau de bord | CA du jour, commandes, plats populaires, tendances | 🔴 Haute | M |
| Gestion des commandes | File d'attente, changement de statut, notifications | 🔴 Haute | L |
| Gestion des créneaux | Slots de retrait, capacité par créneau, fermetures | 🔴 Haute | M |
| Rapports financiers | Export des ventes, réconciliation, historique | 🔴 Haute | M |
| Gestion de la fidélité | Paramétrage des points, création d'offres spéciales | 🟡 Moyenne | M |
| Analytics clients | Segmentation, fréquence de visite, plats favoris | 🟡 Moyenne | L |
| Notifications clients | Envoi de messages push ciblés (nouveautés, promos) | 🟡 Moyenne | S |
| Gestion des photos | Upload et organisation des visuels des plats | 🔴 Haute | S |
| Profil établissement | Informations, horaires, description, contact | 🔴 Haute | S |

### 5.3 Super Back-Office Administrateur

| Fonctionnalité | Description | Priorité | Effort |
|---|---|---|---|
| Gestion des partenaires | Onboarding, validation, suspension des restaurants | 🔴 Haute | M |
| Monitoring transactions | Vue globale des paiements, remontées d'anomalies | 🔴 Haute | M |
| Dashboard global | KPIs plateforme : GMV, MAU, rétention, croissance | 🔴 Haute | L |
| Support client | Gestion des tickets, remboursements, litiges | 🔴 Haute | M |
| Gestion des promotions | Campagnes globales, codes promo, événements | 🟡 Moyenne | M |
| Configuration commission | Taux par restaurant, facturation, exports comptables | 🔴 Haute | M |

---

## 6. Architecture Technique

### 6.1 Vue d'ensemble

L'architecture de Voyage Gourmand Express repose sur une stack moderne, scalable et maîtrisée en interne, en cohérence avec l'écosystème Club Créole existant.

### 6.2 Stack technique recommandée

**Frontend client mobile**
- Framework : **Flutter** (iOS + Android depuis une seule codebase)
- State management : Riverpod
- Push notifications : Firebase Cloud Messaging (FCM)

**Web App restaurateur & admin**
- Framework : **Next.js 14** (App Router) + TypeScript
- UI : Tailwind CSS + shadcn/ui
- State : Zustand / React Query

**Backend & API**
- Backend principal : **Supabase** (self-hosted sur VPS Coolify)
- API REST + Realtime : Supabase Edge Functions (Deno)
- Authentification : Supabase Auth (JWT, OAuth Google/Apple)
- File storage : Supabase Storage (photos de plats, logos)

**Paiement**
- Processeur principal : **Stripe** (cartes, Apple Pay, Google Pay)
- Alternative locale : **PayPlug** (compatible DOM-TOM)
- Modèle : Prépaiement avec reversement J+2 aux restaurateurs

**Infrastructure**
- Hébergement : VPS OVH / Hostinger via **Coolify**
- Reverse proxy : Traefik (gestion automatique SSL)
- CI/CD : GitHub Actions → Coolify webhook
- Monitoring : Uptime Kuma + Coolify logs

### 6.3 Modèle de données — Entités principales

```
users              id, email, phone, preferences, loyalty_points, created_at
restaurants        id, name, description, address, hours, stripe_account_id, active
menu_items         id, restaurant_id, name, description, price, category, available, image_url
orders             id, user_id, restaurant_id, status, total_amount, pickup_time, paid_at
order_items        id, order_id, menu_item_id, quantity, unit_price, notes
loyalty_tx         id, user_id, order_id, points, type (earn/redeem)
promotions         id, restaurant_id, type, discount, conditions, valid_from, valid_until
reviews            id, user_id, restaurant_id, order_id, rating, comment, created_at
```

### 6.4 Schéma d'architecture simplifié

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTS                               │
│   App Flutter (iOS/Android)    Web Next.js               │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────────────────┐
│              TRAEFIK (Reverse Proxy / SSL)               │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                SUPABASE (self-hosted)                    │
│  ┌────────────┐ ┌──────────┐ ┌────────┐ ┌───────────┐  │
│  │  PostgREST │ │ Realtime │ │  Auth  │ │  Storage  │  │
│  └────────────┘ └──────────┘ └────────┘ └───────────┘  │
│  ┌─────────────────────────────────────────────────┐    │
│  │              PostgreSQL                          │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   ┌────▼────┐           ┌────▼────┐
   │ Stripe  │           │   FCM   │
   │(paiement│           │(notifs) │
   └─────────┘           └─────────┘
```

---

## 7. Expérience Utilisateur & Parcours Clés

### 7.1 Parcours client — Commande & Retrait

1. L'utilisateur ouvre l'app et voit les restaurants disponibles près de lui
2. Il sélectionne un restaurant et consulte le menu avec photos et prix
3. Il ajoute ses plats au panier et choisit un créneau de retrait
4. Il procède au paiement sécurisé (CB, Apple Pay, Google Pay)
5. Il reçoit une confirmation push et par email
6. Le restaurateur voit la commande apparaître dans son tableau de bord
7. À l'heure choisie, l'utilisateur arrive et retire son plat **sans attendre**
8. Il reçoit des points de fidélité automatiquement

### 7.2 Parcours restaurateur — Gestion quotidienne

1. Le restaurateur ouvre le back-office le matin
2. Il consulte les commandes du jour et planifie sa production
3. Il met à jour les disponibilités des plats en temps réel
4. Il marque les commandes comme "prêtes" → le client est notifié
5. En fin de journée, il consulte le bilan du CA et les plats les plus vendus
6. Il programme une notification pour ses abonnés (promo, nouveauté)

### 7.3 Principes UX

- **Mobile-first** : priorité absolue à l'expérience mobile
- **Simplicité** : maximum 3 étapes pour passer une commande
- **Rapidité** : temps de chargement < 2s sur 4G
- **Accessibilité** : contraste élevé, tailles de police adaptables
- **Ancrage culturel** : visuels, tonalité et UX writing en français créole

---

## 8. Modèle Économique

### 8.1 Sources de revenus

**Commission par transaction**

La plateforme prélève une commission de **5% à 8%** sur chaque commande passée via Voyage Gourmand Express. Ce modèle est transparent et aligné sur la performance.

**Abonnement mensuel restaurateur (SaaS)**

| Plan | Prix | Inclus |
|---|---|---|
| Starter | Gratuit | Commande en ligne, tableau de bord basique |
| Pro | 29 €/mois | Analytics avancés, notifications push illimitées, exports |
| Premium | 59 €/mois | Tout le Pro + account manager dédié, mise en avant |

**Mise en avant & publicité locale**

Les restaurants peuvent payer pour être mis en avant dans les recherches, bénéficier de bannières promotionnelles ou d'emails dédiés aux clients de la zone.

### 8.2 Structure de coûts

- Infrastructure VPS : ~120 €/mois (Coolify, Hostinger, OVH)
- Services tiers : Stripe fees (~1.4% + 0.25€ par transaction), FCM (gratuit jusqu'à seuil)
- Développement & maintenance : équipe interne agence
- Marketing & acquisition : budget commercial terrain + digital
- Support & onboarding : 1 chargé de compte dédié

---

## 9. Roadmap & Phases de Développement

### Phase 1 — MVP (Mois 1–3)

> **Objectif** : valider le concept avec 10 restaurants pilotes et les premières commandes réelles.

- [ ] Authentification client (email, Google, Apple)
- [ ] Catalogue restaurants et menus (CRUD complet)
- [ ] Commande avec prépaiement Stripe
- [ ] Statuts de commande en temps réel (Supabase Realtime)
- [ ] Notifications push basiques (FCM)
- [ ] Back-office restaurateur : commandes + tableau de bord simple
- [ ] App mobile Flutter (iOS + Android)

### Phase 2 — Fidélité & Analytics (Mois 4–6)

> **Objectif** : améliorer la rétention client et fournir de la valeur data aux restaurateurs.

- [ ] Programme de fidélité complet (points, niveaux, récompenses)
- [ ] Offres personnalisées basées sur l'historique
- [ ] Analytics restaurateur : rapports de ventes, plats populaires, segmentation
- [ ] Système d'avis et de notations
- [ ] Notifications push marketing ciblées
- [ ] Abonnement SaaS Pro pour les restaurateurs

### Phase 3 — Croissance & Extension (Mois 7–12)

> **Objectif** : scale sur d'autres îles et enrichir la plateforme.

- [ ] Extension Martinique et Saint-Martin
- [ ] Module promotions avancé (codes promo, campagnes événementielles)
- [ ] Intégration WhatsApp Business pour confirmation et SAV
- [ ] API partenaires (intégration caisses enregistreuses, sites web restaurants)
- [ ] Dashboard admin global avec monitoring plateforme
- [ ] Programme d'affiliation et parrainage

---

## 10. Risques & Mitigations

| Risque | Niveau | Impact | Mitigation |
|---|---|---|---|
| Résistance des restaurateurs au digital | 🔴 Élevé | Faible adoption, décrochage des partenaires | Programme d'onboarding accompagné, formation sur site |
| Concurrence Uber Eats / Deliveroo | 🟡 Moyen | Pression sur les marges, benchmarking défavorable | Positionnement local et culturel, commission plus basse |
| Défaillance technique en heure de pointe | 🟡 Moyen | Perte de confiance, commandes ratées | VPS redondants, monitoring Uptime Kuma 24/7 |
| RGPD et conformité données personnelles | 🔴 Élevé | Sanctions CNIL, perte de confiance utilisateurs | Supabase auto-hébergé, politique de confidentialité, DPO |
| Faible pénétration du paiement dématérialisé | 🟡 Moyen | Frein à l'adoption client | Intégration PayPlug DOM-TOM, pédagogie utilisateur |
| Dépendance à un seul prestataire paiement | 🟢 Faible | Interruption de service en cas de panne Stripe | Fallback PayPlug, alertes monitoring |

---

## 11. Contraintes & Hypothèses

### 11.1 Contraintes techniques

- La connectivité mobile en Guadeloupe peut être instable : l'app doit fonctionner en **mode dégradé** (cache local, retry automatique)
- Les paiements doivent être conformes aux **réglementations de la zone euro**
- L'infrastructure doit être **auto-hébergée** pour maîtriser les coûts et la souveraineté des données

### 11.2 Contraintes légales & réglementaires

- **RGPD** : collecte minimale de données, droit à l'oubli, consentement explicite
- **DSP2** : authentification forte pour les paiements en ligne (3D Secure)
- Mentions légales, CGV et CGU adaptées au droit français

### 11.3 Hypothèses de travail

- Les restaurateurs partenaires disposent d'un smartphone Android ou iOS récent
- La majorité des clients finaux ont accès à un moyen de paiement numérique
- Le marché est suffisamment mature pour adopter la commande en avance sans livraison
- L'équipe de développement dispose d'une maîtrise complète de la stack (Flutter, Next.js, Supabase, Coolify)

---

## 12. Glossaire

| Terme | Définition |
|---|---|
| **MVP** | Minimum Viable Product — version minimale fonctionnelle du produit |
| **B2B2C** | Business-to-Business-to-Consumer — modèle où la plateforme sert les restaurants (B2B) qui servent leurs clients (B2C) |
| **GMV** | Gross Merchandise Value — volume total des transactions traitées par la plateforme |
| **MAU** | Monthly Active Users — utilisateurs actifs sur 30 jours glissants |
| **NPS** | Net Promoter Score — indicateur de satisfaction et de recommandation (de -100 à +100) |
| **SaaS** | Software as a Service — modèle d'abonnement logiciel |
| **Prépaiement** | Paiement effectué au moment de la commande, avant récupération du plat |
| **Realtime** | Technologie de mise à jour instantanée des données sans rechargement de page |
| **FCM** | Firebase Cloud Messaging — service d'envoi de notifications push Google |
| **KPI** | Key Performance Indicator — indicateur clé de performance |
| **DSP2** | Directive sur les Services de Paiement 2 — réglementation européenne imposant le 3D Secure |
| **DOM-TOM** | Départements et Territoires d'Outre-Mer — statut administratif de la Guadeloupe et Martinique |

---

---

*Voyage Gourmand Express — PRD v1.0 — Mars 2026*
*Ce document est vivant. Il sera mis à jour à chaque sprint en fonction des retours terrain, des tests utilisateurs et des décisions d'équipe.*
