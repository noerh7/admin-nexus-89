# Admin Nexus - Interface d'Administration

Cette application web d'administration vous permet de gérer complètement votre base de données Supabase à travers une interface utilisateur intuitive.

## 🚀 Fonctionnalités

### Gestion des Utilisateurs
- ✅ Voir tous les utilisateurs
- ✅ Créer de nouveaux utilisateurs
- ✅ Modifier les informations utilisateur
- ✅ Supprimer des utilisateurs
- ✅ Filtrer par niveau (bronze, silver, gold, platinum)
- ✅ Rechercher par nom, email ou nom d'utilisateur

### Gestion des Produits
- ✅ Voir tous les produits
- ✅ Créer de nouveaux produits
- ✅ Modifier les produits existants
- ✅ Supprimer des produits
- ✅ Activer/désactiver des produits
- ✅ Rechercher des produits
- ✅ Associer des produits à des catégories

### Gestion des Catégories
- ✅ Voir toutes les catégories
- ✅ Créer de nouvelles catégories
- ✅ Modifier les catégories existantes
- ✅ Supprimer des catégories
- ✅ Configurer les taux de commission
- ✅ Gérer les icônes et couleurs

### Gestion des Cours
- ✅ Voir tous les cours
- ✅ Créer de nouveaux cours
- ✅ Modifier les cours existants
- ✅ Supprimer des cours
- ✅ Configurer les niveaux de difficulté
- ✅ Gérer les cours premium/gratuits

### Tableau de Bord
- ✅ Statistiques en temps réel
- ✅ Nombre total d'utilisateurs, produits, catégories, cours
- ✅ Revenus totaux et XP total
- ✅ Activités récentes
- ✅ Graphiques de performance

## 🛠️ Configuration

### Variables d'environnement
Créez un fichier `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon
```

### Base de données
Assurez-vous que votre base de données Supabase contient toutes les tables nécessaires. Le fichier `database.sql` contient le schéma complet.

## 📦 Installation

1. Installez les dépendances :
```bash
npm install
```

2. Configurez vos variables d'environnement dans `.env.local`

3. Lancez l'application :
```bash
npm run dev
```

## 🗄️ Structure de la Base de Données

L'application gère les tables suivantes :

### Tables principales
- `users` - Utilisateurs du système
- `products` - Produits affiliés
- `categories` - Catégories de produits
- `courses` - Cours éducatifs
- `rewards` - Système de récompenses

### Tables de relations
- `product_categories` - Liaison produits-catégories
- `user_activities` - Activités des utilisateurs
- `user_clicks` - Clics sur les produits
- `user_conversions` - Conversions des utilisateurs
- `referrals` - Système de parrainage
- `notifications` - Notifications utilisateurs

### Tables de progression
- `user_course_progress` - Progression dans les cours
- `user_rewards` - Récompenses débloquées
- `daily_streaks` - Séries quotidiennes
- `wallet_transactions` - Transactions financières

## 🔧 Services Disponibles

### userService
- `getAllUsers()` - Récupérer tous les utilisateurs
- `getUserById(id)` - Récupérer un utilisateur par ID
- `createUser(userData)` - Créer un utilisateur
- `updateUser(id, updates)` - Mettre à jour un utilisateur
- `deleteUser(id)` - Supprimer un utilisateur
- `searchUsers(query)` - Rechercher des utilisateurs

### productService
- `getAllProducts()` - Récupérer tous les produits
- `getProductById(id)` - Récupérer un produit par ID
- `createProduct(productData)` - Créer un produit
- `updateProduct(id, updates)` - Mettre à jour un produit
- `deleteProduct(id)` - Supprimer un produit
- `searchProducts(query)` - Rechercher des produits

### categoryService
- `getAllCategories()` - Récupérer toutes les catégories
- `getCategoryById(id)` - Récupérer une catégorie par ID
- `createCategory(categoryData)` - Créer une catégorie
- `updateCategory(id, updates)` - Mettre à jour une catégorie
- `deleteCategory(id)` - Supprimer une catégorie

### courseService
- `getAllCourses()` - Récupérer tous les cours
- `getCourseById(id)` - Récupérer un cours par ID
- `createCourse(courseData)` - Créer un cours
- `updateCourse(id, updates)` - Mettre à jour un cours
- `deleteCourse(id)` - Supprimer un cours

### statsService
- `getGeneralStats()` - Statistiques générales
- `getUserStatsByTier()` - Statistiques par niveau utilisateur

## 🎨 Interface Utilisateur

L'interface utilise les composants shadcn/ui pour une expérience utilisateur moderne et cohérente :

- **Tableaux** avec tri et filtrage
- **Formulaires** de création/édition avec validation
- **Dialogs** modaux pour les actions
- **Badges** pour les statuts
- **Charts** pour les statistiques
- **Loading states** pour le feedback utilisateur

## 🔒 Sécurité

- Toutes les opérations passent par les services Supabase
- Validation des données côté client et serveur
- Gestion des erreurs avec messages utilisateur
- Confirmation avant suppression

## 📱 Responsive Design

L'interface s'adapte à tous les écrans :
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## 🚀 Déploiement

Pour déployer l'application :

1. Build de production :
```bash
npm run build
```

2. Les fichiers de build sont dans le dossier `dist/`

3. Déployez sur votre plateforme préférée (Vercel, Netlify, etc.)

## 📞 Support

Pour toute question ou problème, consultez la documentation Supabase ou contactez l'équipe de développement.