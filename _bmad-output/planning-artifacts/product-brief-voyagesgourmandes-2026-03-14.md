---
stepsCompleted: [1, 2, 3, 4, 5, 6]
status: complete
inputDocuments: [VGE_PRD_v1.0.md]
date: 2026-03-14
author: Laurent
---

# Product Brief: Voyage Gourmand Express

## Executive Summary

**Voyage Gourmand Express (VGE)** est une suite de services digitaux portée par l'Agence Club Créole, conçue pour digitaliser la commande et le retrait dans les restaurants des Antilles françaises. Face à un marché local où les restaurateurs gèrent encore leurs commandes par téléphone et WhatsApp — générant files d'attente, no-shows et pertes de temps — VGE propose trois niveaux de solutions combinables : un canal WhatsApp Business intelligent, des applications web/mobile dédiées (white-label ou sur mesure), et une marketplace locale de découverte culinaire. Le modèle repose sur un positionnement de prestataire digital spécialisé restauration, avec une tarification agressive et un déploiement rapide, pensés pour un marché peu digitalisé mais prêt pour la transition.

---

## Core Vision

### Problem Statement

Les restaurateurs antillais gèrent leurs commandes à emporter de manière artisanale — téléphone, cahier, bouche-à-oreille. Le résultat : des files d'attente interminables côté client, des no-shows sur les commandes téléphoniques côté restaurateur, et un temps considérable perdu des deux côtés. Les grandes plateformes (Uber Eats, Deliveroo) ne couvrent pas ou mal les DOM-TOM, et leurs commissions à 30% sont incompatibles avec les marges locales.

### Problem Impact

- **Clients** : temps perdu en déplacement et en attente, frustration, abandon de commandes
- **Restaurateurs** : gestion chaotique au rush, no-shows impayés, aucune donnée client, impossibilité de fidéliser efficacement
- **Marché** : un écosystème de restauration dynamique mais freiné par l'absence d'outils numériques adaptés et abordables

### Why Existing Solutions Fall Short

| Solution actuelle | Limitation |
|---|---|
| Téléphone | Interrompt le service, pas de prépaiement, no-shows fréquents |
| WhatsApp informel | Non structuré, pas de suivi, pas de paiement intégré |
| Uber Eats / Deliveroo | Commissions prohibitives (~30%), couverture DOM-TOM quasi inexistante |
| Solutions SaaS métropolitaines | Pas adaptées au contexte local (réseau, paiement, culture) |

### Proposed Solution

Une **suite de services digitaux à 3 niveaux**, combinables selon les besoins du restaurateur :

1. **VGE WhatsApp** — Canal de commande via WhatsApp Business. Zéro téléchargement côté client, déploiement immédiat. Idéal pour les restaurateurs peu digitalisés.
2. **VGE Pro** — Application web/mobile dédiée au restaurant, disponible en white-label (rapide, économique) ou sur mesure (personnalisée, premium). Le restaurateur a SA propre identité digitale.
3. **VGE Marketplace** — Plateforme d'agrégation et de découverte. Acquisition de nouveaux clients, visibilité locale, fidélisation croisée.

Toutes les solutions intègrent : prépaiement (anti no-show), notification de retrait, et tableau de bord restaurateur.

### Key Differentiators

- **Approche agence digitale spécialisée** — Pas un simple SaaS, mais un partenaire qui comprend le métier et le terrain
- **3 niveaux combinables** — Du WhatsApp gratuit à l'app sur mesure, chaque restaurateur trouve sa porte d'entrée
- **Ancrage local** — Conçu pour les réalités antillaises (réseau, habitudes, fiscalité DOM-TOM)
- **Anti no-show par design** — Le prépaiement élimine le problème à la racine
- **Tarification agressive** — Commission 5-8% vs 30% chez les géants, positionnement le moins cher du marché
- **Déploiement rapide** — Solution opérationnelle en jours, pas en semaines

---

## Target Users

### Primary Users

#### Persona 1 : Jean-Claude — Le Restaurateur Connecté (malgré lui)

- **Profil** : Propriétaire de restaurant, lolo ou établissement gastronomique. Critère unique : fait de la vente à emporter et/ou livraison.
- **Contexte** : Gère ses commandes par téléphone et WhatsApp informel. Submergé au rush, perd des commandes, subit des no-shows. N'a aucun outil pour connaître, fidéliser ou communiquer avec ses clients.
- **Motivation** : Fluidifier les commandes, éliminer les no-shows, et surtout **créer un lien direct avec ses clients** — fidélisation, promos, événements.
- **Frustration actuelle** : "Je ne connais même pas mes habitués. Je n'ai aucun moyen de leur envoyer une promo ou de les prévenir d'un événement."
- **Moment de succès** : Jean-Claude envoie une notification "Soirée spéciale langouste vendredi" → 30 réservations en 2h. Zéro appel téléphonique.

#### Persona 2 : Marlène — La Cliente Fidèle

- **Profil** : Tout client existant d'un restaurant partenaire VGE. Working mom, professionnel en pause déjeuner, habitué du weekend — le profil importe peu.
- **Contexte** : Déjà cliente du restaurant. Découvre VGE parce que **son restaurateur lui pousse la solution** (QR code, WhatsApp, bouche-à-oreille).
- **Motivation** : Gagner du temps, ne plus faire la queue, profiter des promos et du programme de fidélité.
- **Frustration actuelle** : "J'appelle pour commander, c'est toujours occupé. J'arrive et j'attends 20 minutes."
- **Moment de succès** : Marlène commande en 2 min, reçoit une notification "c'est prêt", passe récupérer sans attendre, et cumule des points fidélité.

### Secondary Users

#### L'Équipe du Restaurant
- Employés qui reçoivent et préparent les commandes via le dashboard
- Besoin : interface simple, notifications claires, pas de formation complexe

#### L'Agence Club Créole (Admin)
- Gère l'onboarding des restaurateurs, le support, le déploiement des apps white-label/sur mesure
- Besoin : back-office de gestion multi-restaurants, analytics, facturation

### User Journey

```
RESTAURATEUR (Jean-Claude)
Découverte → Démarchage Club Créole ou bouche-à-oreille
Onboarding → Choix du niveau (WhatsApp / White-label / Sur mesure)
Activation → Configuration menu, horaires, promos
Adoption   → Pousse ses clients existants vers la solution
Valeur     → Première semaine sans no-show, premiers messages promo envoyés
Routine    → Gère sa communauté clients, lance des événements, fidélise

CLIENT (Marlène)
Découverte → Son restaurant préféré lui dit "commandez ici"
Onboarding → Scan QR code ou lien WhatsApp — zéro friction
1ère cmd   → Commande + prépaiement en 2 min
Retrait    → Notification "c'est prêt", passage express
Fidélité   → Cumul de points, reçoit promos et événements
Routine    → Réflexe : "je commande toujours par là"
```

---

## Success Metrics

### Métriques Utilisateur (Restaurateur)

| Métrique | Cible | Délai |
|---|---|---|
| Taux de no-show post-adoption | < 5% (vs ~20-30% estimé actuellement) | Dès M1 |
| Temps moyen de traitement commande | Divisé par 2 vs téléphone | M3 |
| Taux d'utilisation des outils comm (promos/events) | > 60% des restaurants actifs | M6 |
| Satisfaction restaurateur (NPS) | > 40 | M6 |

### Métriques Utilisateur (Client)

| Métrique | Cible | Délai |
|---|---|---|
| Taux de réutilisation (2ème commande dans les 30j) | > 50% | M3 |
| Fréquence de commande par client actif | > 2x/mois | M6 |
| Adoption programme fidélité | > 40% des clients ayant commandé | M6 |
| Temps commande (de l'ouverture au paiement) | < 3 minutes | M1 |

### Business Objectives

| Objectif | Cible | Délai |
|---|---|---|
| Restaurants actifs | 12 → 32 → 52 → 100 | M3 → M5 → M6 → M9 |
| Rythme d'acquisition | 4/mois → 10/mois → 20/mois | M1-3 → M4-5 → M6+ |
| Taux de churn restaurateur | < 10% mensuel | M6 |
| Mix offre (WhatsApp / White-label / Sur mesure) | Suivi mensuel, pas de cible imposée | Continu |

### Key Performance Indicators

**KPIs de croissance :**
- Nombre de restaurants actifs (commande reçue dans les 30 derniers jours)
- Volume de commandes mensuel (total et par restaurant)
- Nombre de clients uniques actifs par mois

**KPIs financiers :**
- Revenu mensuel récurrent (SaaS)
- Revenu transactionnel (commissions)
- Revenu projets sur mesure
- Panier moyen par commande
- Revenu moyen par restaurant (ARPR)

**KPIs d'engagement :**
- Taux de réutilisation client (2ème commande < 30j)
- Fréquence commande / client / mois
- Taux d'adoption fidélité
- Nombre de promos/events envoyés par restaurant/mois

**KPIs opérationnels :**
- Délai moyen d'onboarding restaurant (signature → 1ère commande reçue)
- Taux de no-show post-adoption
- Uptime plateforme (cible > 99.5%)

---

## MVP Scope

### Core Features (MVP — Phase 1)

**Par restaurant signé, VGE livre :**

1. **Site vitrine digital**
   - Page restaurant brandée (logo, couleurs, description)
   - Catalogue/menu digital avec photos et prix
   - Système de commande en ligne
   - Paiement en ligne intégré (prépaiement anti no-show)
   - Notification client "c'est prêt"

2. **App web white-label**
   - Progressive Web App brandée au nom du restaurant
   - Mêmes fonctionnalités que le site vitrine
   - Installable sur mobile sans passer par les stores

3. **Bot WhatsApp**
   - Prise de commande conversationnelle
   - Connecté au même catalogue et système de paiement
   - Notifications de statut commande

4. **Programme de fidélisation**
   - Système de points par commande
   - Récompenses configurables par le restaurateur

5. **Dashboard restaurateur (basique)**
   - Vue des commandes entrantes en temps réel
   - Gestion des statuts (reçue → en préparation → prête)
   - Gestion du catalogue/menu

6. **Back-office Agence Club Créole**
   - Onboarding et déploiement des restaurants
   - Gestion multi-tenants

### Out of Scope pour MVP

| Fonctionnalité | Phase | Raison |
|---|---|---|
| Promos / événements / communication client | Phase 2 | Valeur ajoutée forte mais non bloquante au lancement |
| Dashboard avancé (analytics, gestion clients) | Phase 2 | Le basique suffit pour les premiers adoptants |
| Marketplace VGE (agrégation multi-restaurants) | Phase 2 | Nécessite masse critique (~30-50 restaurants) |
| Apps sur mesure | Offre commerciale agence (hors scope produit) | Service sur devis, développement au cas par cas |

### MVP Success Criteria

| Critère | Seuil de validation |
|---|---|
| Restaurants onboardés | 12 en 3 mois (4/mois) |
| Commandes traitées sans incident | > 95% |
| Taux de no-show | < 5% |
| Adoption fidélité clients | > 40% des clients ayant commandé |
| Restaurateur actif (≥1 commande/semaine) | > 80% des restaurants signés |
| Temps d'onboarding restaurant | < 48h de la signature à la 1ère commande |

### Future Vision

**Phase 2 — Engagement & Marketplace (M4-M9)**
- Outils de communication directe (promos, événements, push notifications)
- Dashboard avancé avec analytics et connaissance client
- Marketplace VGE : plateforme de découverte multi-restaurants
- Mise en avant payante sur la marketplace

**Phase 3 — Croissance & Écosystème (M10+)**
- Expansion géographique (Martinique, Guyane, Réunion)
- Programme de fidélité cross-restaurants via marketplace
- API ouverte pour intégrations tierces (caisses, comptabilité)
- Intelligence artificielle (prédiction de demande, recommandations)

**Offre commerciale permanente (hors produit) :**
- Développement d'apps sur mesure pour restaurants premium
- Accompagnement digital personnalisé par l'Agence Club Créole
