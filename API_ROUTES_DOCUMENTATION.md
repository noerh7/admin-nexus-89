# 📚 Documentation des Routes API - Admin Nexus

## 🎯 Vue d'ensemble

Cette documentation présente toutes les routes API disponibles pour l'application d'administration Admin Nexus. Chaque route suit les conventions RESTful et inclut la gestion complète des opérations CRUD.

## 🔧 Configuration

- **Base URL**: `http://localhost:3001/api`
- **Format**: JSON
- **Authentification**: À implémenter selon les besoins

## 📋 Tables de Base de Données Couvertes

### Tables Principales
- ✅ **users** - Utilisateurs
- ✅ **categories** - Catégories de produits
- ✅ **products** - Produits
- ✅ **courses** - Cours
- ✅ **rewards** - Récompenses
- ✅ **notifications** - Notifications
- ✅ **announcements** - Annonces
- ✅ **testimonials** - Témoignages
- ✅ **referrals** - Parrainages
- ✅ **wallet_transactions** - Transactions de portefeuille

### Tables de Liaison et Données
- ✅ **user_activities** - Activités utilisateur
- ✅ **user_clicks** - Clics sur produits
- ✅ **user_conversions** - Conversions
- ✅ **user_course_progress** - Progrès des cours
- ✅ **user_rewards** - Récompenses utilisateur
- ✅ **user_achievements** - Succès utilisateur
- ✅ **user_goals** - Objectifs utilisateur
- ✅ **user_preferences** - Préférences utilisateur
- ✅ **user_settings** - Paramètres utilisateur
- ✅ **user_sessions** - Sessions utilisateur
- ✅ **user_connections** - Connexions utilisateur
- ✅ **user_favorites** - Favoris utilisateur
- ✅ **user_announcement_views** - Vues d'annonces
- ✅ **daily_streaks** - Séquences quotidiennes
- ✅ **product_categories** - Relations produit-catégorie
- ✅ **product_reviews** - Avis produits
- ✅ **analytics_events** - Événements analytiques
- ✅ **navigation_items** - Éléments de navigation
- ✅ **timeline_steps** - Étapes de timeline
- ✅ **trust_badges** - Badges de confiance

---

## 👥 ROUTES UTILISATEURS (`/api/users`)

### GET `/api/users`
Récupérer tous les utilisateurs
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "full_name": "Nom Complet",
      "tier": "bronze|silver|gold|platinum",
      "total_xp": 1500,
      "total_earnings": 250.50,
      "current_streak": 5,
      "longest_streak": 15,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET `/api/users/:id`
Récupérer un utilisateur par ID

### POST `/api/users`
Créer un nouvel utilisateur
```json
{
  "email": "user@example.com",
  "username": "username",
  "full_name": "Nom Complet",
  "tier": "bronze"
}
```

### PUT `/api/users/:id`
Mettre à jour un utilisateur

### DELETE `/api/users/:id`
Supprimer un utilisateur

### GET `/api/users/search?q=query`
Rechercher des utilisateurs

### POST `/api/users/:id/add-xp`
Ajouter de l'XP à un utilisateur
```json
{
  "xpAmount": 100
}
```

---

## 📂 ROUTES CATÉGORIES (`/api/categories`)

### GET `/api/categories`
Récupérer toutes les catégories

### GET `/api/categories/active`
Récupérer les catégories actives

### GET `/api/categories/:id`
Récupérer une catégorie par ID

### GET `/api/categories/slug/:slug`
Récupérer une catégorie par slug

### POST `/api/categories`
Créer une nouvelle catégorie
```json
{
  "name": "Nom de la catégorie",
  "slug": "nom-categorie",
  "icon": "icon-name",
  "description": "Description",
  "avg_commission": 5.5,
  "conversion_rate": 2.3,
  "is_active": true
}
```

### PUT `/api/categories/:id`
Mettre à jour une catégorie

### DELETE `/api/categories/:id`
Supprimer une catégorie

---

## 🛍️ ROUTES PRODUITS (`/api/products`)

### GET `/api/products`
Récupérer tous les produits

### GET `/api/products/active`
Récupérer les produits actifs

### GET `/api/products/category/:categoryId`
Récupérer les produits d'une catégorie

### GET `/api/products/:id`
Récupérer un produit par ID

### POST `/api/products`
Créer un nouveau produit
```json
{
  "category_id": "uuid",
  "name": "Nom du produit",
  "description": "Description",
  "commission_rate": 5.5,
  "conversion_rate": 2.3,
  "xp_reward": 100,
  "affiliate_url": "https://...",
  "is_active": true
}
```

### PUT `/api/products/:id`
Mettre à jour un produit

### DELETE `/api/products/:id`
Supprimer un produit

### GET `/api/products/search?q=query`
Rechercher des produits

---

## 🎓 ROUTES COURS (`/api/courses`)

### GET `/api/courses`
Récupérer tous les cours

### GET `/api/courses/active`
Récupérer les cours actifs

### GET `/api/courses/:id`
Récupérer un cours par ID

### GET `/api/courses/user/:userId`
Récupérer les cours d'un utilisateur

### POST `/api/courses`
Créer un nouveau cours
```json
{
  "title": "Titre du cours",
  "description": "Description",
  "xp_reward": 500,
  "difficulty_level": "beginner|intermediate|advanced",
  "is_premium": false,
  "is_active": true
}
```

### PUT `/api/courses/:id`
Mettre à jour un cours

### DELETE `/api/courses/:id`
Supprimer un cours

### POST `/api/courses/:courseId/progress`
Mettre à jour le progrès d'un cours
```json
{
  "userId": "uuid",
  "progress": 75,
  "isCompleted": false
}
```

---

## 🏆 ROUTES RÉCOMPENSES (`/api/rewards`)

### GET `/api/rewards`
Récupérer toutes les récompenses

### GET `/api/rewards/:id`
Récupérer une récompense par ID

### GET `/api/rewards/user/:userId`
Récupérer les récompenses d'un utilisateur

### POST `/api/rewards`
Créer une nouvelle récompense
```json
{
  "name": "Nom de la récompense",
  "description": "Description",
  "tier": "bronze|silver|gold|platinum",
  "xp_required": 1000,
  "earnings_required": 100.0,
  "is_active": true
}
```

### PUT `/api/rewards/:id`
Mettre à jour une récompense

### DELETE `/api/rewards/:id`
Supprimer une récompense

### POST `/api/rewards/check/:userId`
Vérifier et débloquer les récompenses

---

## 🔔 ROUTES NOTIFICATIONS (`/api/notifications`)

### GET `/api/notifications`
Récupérer toutes les notifications (admin)

### GET `/api/notifications/user/:userId`
Récupérer les notifications d'un utilisateur
- `?unreadOnly=true` - Seulement les non lues

### POST `/api/notifications`
Créer une notification
```json
{
  "userId": "uuid",
  "title": "Titre",
  "message": "Message",
  "type": "achievement|milestone|streak|referral|course|general",
  "metadata": {}
}
```

### PUT `/api/notifications/:id/read`
Marquer une notification comme lue

### DELETE `/api/notifications/:id`
Supprimer une notification

---

## 📢 ROUTES ANNONCES (`/api/announcements`)

### GET `/api/announcements`
Récupérer toutes les annonces

### GET `/api/announcements/active`
Récupérer les annonces actives

### GET `/api/announcements/:id`
Récupérer une annonce par ID

### POST `/api/announcements`
Créer une nouvelle annonce
```json
{
  "title": "Titre de l'annonce",
  "content": "Contenu",
  "type": "info|warning|success|error",
  "priority": 1,
  "is_active": true,
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-12-31T23:59:59Z"
}
```

### PUT `/api/announcements/:id`
Mettre à jour une annonce

### DELETE `/api/announcements/:id`
Supprimer une annonce

---

## 💬 ROUTES TÉMOIGNAGES (`/api/testimonials`)

### GET `/api/testimonials`
Récupérer tous les témoignages

### GET `/api/testimonials/active`
Récupérer les témoignages actifs
- `?limit=10` - Limiter le nombre de résultats

### GET `/api/testimonials/:id`
Récupérer un témoignage par ID

### POST `/api/testimonials`
Créer un nouveau témoignage
```json
{
  "user_id": "uuid",
  "name": "Nom",
  "handle": "@handle",
  "tier": "gold",
  "tier_color": "#FFD700",
  "earnings": "$2,500",
  "quote": "Témoignage...",
  "is_active": true
}
```

### PUT `/api/testimonials/:id`
Mettre à jour un témoignage

### DELETE `/api/testimonials/:id`
Supprimer un témoignage

---

## 🤝 ROUTES PARRAINAGES (`/api/referrals`)

### GET `/api/referrals`
Récupérer tous les parrainages

### GET `/api/referrals/user/:userId`
Récupérer les parrainages d'un utilisateur

### PUT `/api/referrals/:id/status`
Mettre à jour le statut d'un parrainage
```json
{
  "status": "pending|accepted|completed"
}
```

---

## 💰 ROUTES TRANSACTIONS (`/api/transactions`)

### GET `/api/transactions`
Récupérer toutes les transactions

### GET `/api/transactions/user/:userId`
Récupérer les transactions d'un utilisateur

### POST `/api/transactions`
Créer une nouvelle transaction
```json
{
  "user_id": "uuid",
  "transaction_type": "earnings|withdrawal|bonus|refund",
  "amount": 100.50,
  "status": "pending|completed|failed|cancelled",
  "description": "Description"
}
```

### PUT `/api/transactions/:id/status`
Mettre à jour le statut d'une transaction
```json
{
  "status": "completed"
}
```

---

## 📊 ROUTES ACTIVITÉS (`/api/activities`)

### GET `/api/activities`
Récupérer toutes les activités

### GET `/api/activities/user/:userId`
Récupérer les activités d'un utilisateur

### POST `/api/activities/log`
Enregistrer une activité
```json
{
  "userId": "uuid",
  "activityType": "click|conversion|xp_earned|streak_updated|tier_upgraded",
  "xpEarned": 50,
  "earnings": 10.0,
  "productId": "uuid",
  "categoryId": "uuid",
  "metadata": {}
}
```

### POST `/api/activities/click`
Enregistrer un clic sur un produit
```json
{
  "userId": "uuid",
  "productId": "uuid"
}
```

### POST `/api/activities/conversion`
Enregistrer une conversion
```json
{
  "userId": "uuid",
  "productId": "uuid",
  "conversionValue": 100.0,
  "commissionEarned": 5.0,
  "xpEarned": 50
}
```

---

## 📈 ROUTES STATISTIQUES (`/api/stats`)

### GET `/api/stats/general`
Récupérer les statistiques générales
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalProducts": 89,
    "totalCategories": 12,
    "totalCourses": 25,
    "totalEarnings": 125000.50,
    "totalXP": 2500000
  }
}
```

### GET `/api/stats/users-by-tier`
Récupérer les statistiques des utilisateurs par tier

---

## 🔗 ROUTES DE LIAISON

### Relations Produit-Catégorie (`/api/product-categories`)
- `GET` - Récupérer toutes les relations
- `POST` - Créer une relation
- `DELETE /:id` - Supprimer une relation

### Avis Produits (`/api/product-reviews`)
- `GET` - Récupérer tous les avis
- `GET /product/:productId` - Avis d'un produit
- `POST` - Créer un avis
- `PUT /:id` - Mettre à jour un avis
- `DELETE /:id` - Supprimer un avis

### Étapes Timeline (`/api/timeline-steps`)
- `GET` - Récupérer toutes les étapes
- `POST` - Créer une étape
- `PUT /:id` - Mettre à jour une étape
- `DELETE /:id` - Supprimer une étape

### Badges de Confiance (`/api/trust-badges`)
- `GET` - Récupérer tous les badges
- `POST` - Créer un badge
- `PUT /:id` - Mettre à jour un badge
- `DELETE /:id` - Supprimer un badge

### Éléments de Navigation (`/api/navigation-items`)
- `GET` - Récupérer tous les éléments
- `POST` - Créer un élément
- `PUT /:id` - Mettre à jour un élément
- `DELETE /:id` - Supprimer un élément

---

## 🚨 Codes de Statut HTTP

- **200** - Succès
- **201** - Créé avec succès
- **400** - Données invalides
- **404** - Ressource non trouvée
- **500** - Erreur serveur

## 📝 Format des Réponses

### Succès
```json
{
  "success": true,
  "data": { ... },
  "message": "Message optionnel"
}
```

### Erreur
```json
{
  "success": false,
  "error": "Message d'erreur",
  "path": "/api/endpoint" // En cas d'erreur 404
}
```

## 🔒 Sécurité

- Toutes les routes sont protégées par CORS
- Headers de sécurité avec Helmet
- Validation des données d'entrée
- Gestion d'erreurs centralisée
- Logging des requêtes avec Morgan

## 🚀 Démarrage

```bash
npm run dev
```

Le serveur sera disponible sur `http://localhost:3001` avec l'interface de santé sur `/health`.