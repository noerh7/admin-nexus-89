import { Router } from 'express';
import { 
  userService, 
  categoryService, 
  productService, 
  courseService, 
  rewardService, 
  notificationService, 
  announcementService, 
  testimonialService, 
  referralService, 
  transactionService, 
  activityService, 
  statsService,
  supabase 
} from '../supabase';

const router = Router();

// ============================================================================
// ROUTES UTILISATEURS (USERS)
// ============================================================================

// GET /api/users - Récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// GET /api/users/:id - Récupérer un utilisateur par ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
});

// POST /api/users - Créer un nouvel utilisateur
router.post('/users', async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    if (!user) {
      return res.status(400).json({ success: false, error: 'Erreur lors de la création de l\'utilisateur' });
    }
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// PUT /api/users/:id - Mettre à jour un utilisateur
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await userService.updateUser(id, updates);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await userService.deleteUser(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

// GET /api/users/search - Rechercher des utilisateurs
router.get('/users/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Paramètre de recherche requis' });
    }
    const users = await userService.searchUsers(q as string);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la recherche d\'utilisateurs' });
  }
});

// POST /api/users/:id/add-xp - Ajouter de l'XP à un utilisateur
router.post('/users/:id/add-xp', async (req, res) => {
  try {
    const { id } = req.params;
    const { xpAmount } = req.body;
    if (!xpAmount || xpAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Montant XP invalide' });
    }
    const success = await userService.addXP(id, xpAmount);
    if (!success) {
      return res.status(400).json({ success: false, error: 'Erreur lors de l\'ajout d\'XP' });
    }
    res.json({ success: true, message: 'XP ajouté avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout d\'XP' });
  }
});

// ============================================================================
// ROUTES CATÉGORIES (CATEGORIES)
// ============================================================================

// GET /api/categories - Récupérer toutes les catégories
router.get('/categories', async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des catégories' });
  }
});

// GET /api/categories/active - Récupérer les catégories actives
router.get('/categories/active', async (req, res) => {
  try {
    const categories = await categoryService.getActiveCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des catégories actives' });
  }
});

// GET /api/categories/:id - Récupérer une catégorie par ID
router.get('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Catégorie non trouvée' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération de la catégorie' });
  }
});

// GET /api/categories/slug/:slug - Récupérer une catégorie par slug
router.get('/categories/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Catégorie non trouvée' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération de la catégorie' });
  }
});

// POST /api/categories - Créer une nouvelle catégorie
router.post('/categories', async (req, res) => {
  try {
    const categoryData = req.body;
    const category = await categoryService.createCategory(categoryData);
    if (!category) {
      return res.status(400).json({ success: false, error: 'Erreur lors de la création de la catégorie' });
    }
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création de la catégorie' });
  }
});

// PUT /api/categories/:id - Mettre à jour une catégorie
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const category = await categoryService.updateCategory(id, updates);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Catégorie non trouvée' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de la catégorie' });
  }
});

// DELETE /api/categories/:id - Supprimer une catégorie
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await categoryService.deleteCategory(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Catégorie non trouvée' });
    }
    res.json({ success: true, message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de la catégorie' });
  }
});

// ============================================================================
// ROUTES PRODUITS (PRODUCTS)
// ============================================================================

// GET /api/products - Récupérer tous les produits
router.get('/products', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des produits' });
  }
});

// GET /api/products/active - Récupérer les produits actifs
router.get('/products/active', async (req, res) => {
  try {
    const products = await productService.getAllActiveProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des produits actifs' });
  }
});

// GET /api/products/category/:categoryId - Récupérer les produits d'une catégorie
router.get('/products/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await productService.getProductsByCategory(categoryId);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des produits de la catégorie' });
  }
});

// GET /api/products/:id - Récupérer un produit par ID
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Produit non trouvé' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération du produit' });
  }
});

// POST /api/products - Créer un nouveau produit
router.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    const product = await productService.createProduct(productData);
    if (!product) {
      return res.status(400).json({ success: false, error: 'Erreur lors de la création du produit' });
    }
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création du produit' });
  }
});

// PUT /api/products/:id - Mettre à jour un produit
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await productService.updateProduct(id, updates);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Produit non trouvé' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du produit' });
  }
});

// DELETE /api/products/:id - Supprimer un produit
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await productService.deleteProduct(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Produit non trouvé' });
    }
    res.json({ success: true, message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du produit' });
  }
});

// GET /api/products/search - Rechercher des produits
router.get('/products/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Paramètre de recherche requis' });
    }
    const products = await productService.searchProducts(q as string);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la recherche de produits' });
  }
});

// ============================================================================
// ROUTES COURS (COURSES)
// ============================================================================

// GET /api/courses - Récupérer tous les cours
router.get('/courses', async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des cours' });
  }
});

// GET /api/courses/active - Récupérer les cours actifs
router.get('/courses/active', async (req, res) => {
  try {
    const courses = await courseService.getActiveCourses();
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des cours actifs' });
  }
});

// GET /api/courses/:id - Récupérer un cours par ID
router.get('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Cours non trouvé' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération du cours' });
  }
});

// GET /api/courses/user/:userId - Récupérer les cours d'un utilisateur
router.get('/courses/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const courses = await courseService.getUserCourses(userId);
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des cours de l\'utilisateur' });
  }
});

// POST /api/courses - Créer un nouveau cours
router.post('/courses', async (req, res) => {
  try {
    const courseData = req.body;
    const course = await courseService.createCourse(courseData);
    if (!course) {
      return res.status(400).json({ success: false, error: 'Erreur lors de la création du cours' });
    }
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création du cours' });
  }
});

// PUT /api/courses/:id - Mettre à jour un cours
router.put('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const course = await courseService.updateCourse(id, updates);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Cours non trouvé' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du cours' });
  }
});

// DELETE /api/courses/:id - Supprimer un cours
router.delete('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await courseService.deleteCourse(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Cours non trouvé' });
    }
    res.json({ success: true, message: 'Cours supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du cours' });
  }
});

// POST /api/courses/:courseId/progress - Mettre à jour le progrès d'un cours
router.post('/courses/:courseId/progress', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId, progress, isCompleted } = req.body;
    if (!userId || progress === undefined) {
      return res.status(400).json({ success: false, error: 'Données de progrès requises' });
    }
    const success = await courseService.updateCourseProgress(userId, courseId, progress, isCompleted);
    if (!success) {
      return res.status(400).json({ success: false, error: 'Erreur lors de la mise à jour du progrès' });
    }
    res.json({ success: true, message: 'Progrès mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du progrès' });
  }
});

// ============================================================================
// ROUTES RÉCOMPENSES (REWARDS)
// ============================================================================

// GET /api/rewards - Récupérer toutes les récompenses
router.get('/rewards', async (req, res) => {
  try {
    const rewards = await rewardService.getAllRewards();
    res.json({ success: true, data: rewards });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des récompenses' });
  }
});

// GET /api/rewards/:id - Récupérer une récompense par ID
router.get('/rewards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reward = await rewardService.getRewardById(id);
    if (!reward) {
      return res.status(404).json({ success: false, error: 'Récompense non trouvée' });
    }
    res.json({ success: true, data: reward });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération de la récompense' });
  }
});

// GET /api/rewards/user/:userId - Récupérer les récompenses d'un utilisateur
router.get('/rewards/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const rewards = await rewardService.getUserRewards(userId);
    res.json({ success: true, data: rewards });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des récompenses de l\'utilisateur' });
  }
});

// POST /api/rewards - Créer une nouvelle récompense
router.post('/rewards', async (req, res) => {
  try {
    const rewardData = req.body;
    const reward = await rewardService.createReward(rewardData);
    if (!reward) {
      return res.status(400).json({ success: false, error: 'Erreur lors de la création de la récompense' });
    }
    res.status(201).json({ success: true, data: reward });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création de la récompense' });
  }
});

// PUT /api/rewards/:id - Mettre à jour une récompense
router.put('/rewards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const reward = await rewardService.updateReward(id, updates);
    if (!reward) {
      return res.status(404).json({ success: false, error: 'Récompense non trouvée' });
    }
    res.json({ success: true, data: reward });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de la récompense' });
  }
});

// DELETE /api/rewards/:id - Supprimer une récompense
router.delete('/rewards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await rewardService.deleteReward(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Récompense non trouvée' });
    }
    res.json({ success: true, message: 'Récompense supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de la récompense' });
  }
});

// POST /api/rewards/check/:userId - Vérifier et débloquer les récompenses
router.post('/rewards/check/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const rewards = await rewardService.checkAndUnlockRewards(userId);
    res.json({ success: true, data: rewards });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la vérification des récompenses' });
  }
});

// ============================================================================
// ROUTES NOTIFICATIONS (NOTIFICATIONS)
// ============================================================================

// GET /api/notifications - Récupérer toutes les notifications (admin)
router.get('/notifications', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        users(full_name, username, email)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des notifications' });
  }
});

// GET /api/notifications/user/:userId - Récupérer les notifications d'un utilisateur
router.get('/notifications/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { unreadOnly } = req.query;
    const notifications = await notificationService.getUserNotifications(
      userId, 
      unreadOnly === 'true'
    );
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des notifications' });
  }
});

// POST /api/notifications - Créer une notification
router.post('/notifications', async (req, res) => {
  try {
    const { userId, title, message, type, metadata } = req.body;
    if (!userId || !title || !message || !type) {
      return res.status(400).json({ success: false, error: 'Données de notification requises' });
    }
    const success = await notificationService.createNotification(userId, title, message, type, metadata);
    if (!success) {
      return res.status(400).json({ success: false, error: 'Erreur lors de la création de la notification' });
    }
    res.status(201).json({ success: true, message: 'Notification créée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création de la notification' });
  }
});

// PUT /api/notifications/:id/read - Marquer une notification comme lue
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await notificationService.markAsRead(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Notification non trouvée' });
    }
    res.json({ success: true, message: 'Notification marquée comme lue' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de la notification' });
  }
});

// DELETE /api/notifications/:id - Supprimer une notification
router.delete('/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true, message: 'Notification supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de la notification' });
  }
});

// ============================================================================
// ROUTES ANNONCES (ANNOUNCEMENTS)
// ============================================================================

// GET /api/announcements - Récupérer toutes les annonces
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await announcementService.getAllAnnouncements();
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des annonces' });
  }
});

// GET /api/announcements/active - Récupérer les annonces actives
router.get('/announcements/active', async (req, res) => {
  try {
    const announcements = await announcementService.getActiveAnnouncements();
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des annonces actives' });
  }
});

// GET /api/announcements/:id - Récupérer une annonce par ID
router.get('/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await announcementService.getAnnouncementById(id);
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Annonce non trouvée' });
    }
    res.json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération de l\'annonce' });
  }
});

// POST /api/announcements - Créer une nouvelle annonce
router.post('/announcements', async (req, res) => {
  try {
    const announcementData = req.body;
    const announcement = await announcementService.createAnnouncement(announcementData);
    if (!announcement) {
      return res.status(400).json({ success: false, error: 'Erreur lors de la création de l\'annonce' });
    }
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création de l\'annonce' });
  }
});

// PUT /api/announcements/:id - Mettre à jour une annonce
router.put('/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const announcement = await announcementService.updateAnnouncement(id, updates);
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Annonce non trouvée' });
    }
    res.json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de l\'annonce' });
  }
});

// DELETE /api/announcements/:id - Supprimer une annonce
router.delete('/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await announcementService.deleteAnnouncement(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Annonce non trouvée' });
    }
    res.json({ success: true, message: 'Annonce supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de l\'annonce' });
  }
});

// ============================================================================
// ROUTES TÉMOIGNAGES (TESTIMONIALS)
// ============================================================================

// GET /api/testimonials - Récupérer tous les témoignages
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await testimonialService.getAllTestimonials();
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des témoignages' });
  }
});

// GET /api/testimonials/active - Récupérer les témoignages actifs
router.get('/testimonials/active', async (req, res) => {
  try {
    const { limit } = req.query;
    const testimonials = await testimonialService.getActiveTestimonials(
      limit ? parseInt(limit as string) : 10
    );
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des témoignages actifs' });
  }
});

// GET /api/testimonials/:id - Récupérer un témoignage par ID
router.get('/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await testimonialService.getTestimonialById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Témoignage non trouvé' });
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération du témoignage' });
  }
});

// POST /api/testimonials - Créer un nouveau témoignage
router.post('/testimonials', async (req, res) => {
  try {
    const testimonialData = req.body;
    const testimonial = await testimonialService.createTestimonial(testimonialData);
    if (!testimonial) {
      return res.status(400).json({ success: false, error: 'Erreur lors de la création du témoignage' });
    }
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création du témoignage' });
  }
});

// PUT /api/testimonials/:id - Mettre à jour un témoignage
router.put('/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const testimonial = await testimonialService.updateTestimonial(id, updates);
    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Témoignage non trouvé' });
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du témoignage' });
  }
});

// DELETE /api/testimonials/:id - Supprimer un témoignage
router.delete('/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await testimonialService.deleteTestimonial(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Témoignage non trouvé' });
    }
    res.json({ success: true, message: 'Témoignage supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du témoignage' });
  }
});

// ============================================================================
// ROUTES PARRAINAGES (REFERRALS)
// ============================================================================

// GET /api/referrals - Récupérer tous les parrainages
router.get('/referrals', async (req, res) => {
  try {
    const referrals = await referralService.getAllReferrals();
    res.json({ success: true, data: referrals });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des parrainages' });
  }
});

// GET /api/referrals/user/:userId - Récupérer les parrainages d'un utilisateur
router.get('/referrals/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const referrals = await referralService.getUserReferrals(userId);
    res.json({ success: true, data: referrals });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des parrainages de l\'utilisateur' });
  }
});

// PUT /api/referrals/:id/status - Mettre à jour le statut d'un parrainage
router.put('/referrals/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Statut requis' });
    }
    const success = await referralService.updateReferralStatus(id, status);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Parrainage non trouvé' });
    }
    res.json({ success: true, message: 'Statut du parrainage mis à jour' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du statut du parrainage' });
  }
});

// ============================================================================
// ROUTES TRANSACTIONS (WALLET_TRANSACTIONS)
// ============================================================================

// GET /api/transactions - Récupérer toutes les transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des transactions' });
  }
});

// GET /api/transactions/user/:userId - Récupérer les transactions d'un utilisateur
router.get('/transactions/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await transactionService.getUserTransactions(userId);
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des transactions de l\'utilisateur' });
  }
});

// POST /api/transactions - Créer une nouvelle transaction
router.post('/transactions', async (req, res) => {
  try {
    const transactionData = req.body;
    const transaction = await transactionService.createTransaction(transactionData);
    if (!transaction) {
      return res.status(400).json({ success: false, error: 'Erreur lors de la création de la transaction' });
    }
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création de la transaction' });
  }
});

// PUT /api/transactions/:id/status - Mettre à jour le statut d'une transaction
router.put('/transactions/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Statut requis' });
    }
    const success = await transactionService.updateTransactionStatus(id, status);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Transaction non trouvée' });
    }
    res.json({ success: true, message: 'Statut de la transaction mis à jour' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du statut de la transaction' });
  }
});

// ============================================================================
// ROUTES ACTIVITÉS (USER_ACTIVITIES)
// ============================================================================

// GET /api/activities - Récupérer toutes les activités
router.get('/activities', async (req, res) => {
  try {
    const activities = await activityService.getAllActivities();
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des activités' });
  }
});

// GET /api/activities/user/:userId - Récupérer les activités d'un utilisateur
router.get('/activities/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const activities = await activityService.getUserActivities(userId);
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des activités de l\'utilisateur' });
  }
});

// POST /api/activities/log - Enregistrer une activité
router.post('/activities/log', async (req, res) => {
  try {
    const { userId, activityType, xpEarned, earnings, productId, categoryId, metadata } = req.body;
    if (!userId || !activityType) {
      return res.status(400).json({ success: false, error: 'Données d\'activité requises' });
    }
    const success = await activityService.logActivity(
      userId, 
      activityType, 
      xpEarned || 0, 
      earnings || 0, 
      productId, 
      categoryId, 
      metadata
    );
    if (!success) {
      return res.status(400).json({ success: false, error: 'Erreur lors de l\'enregistrement de l\'activité' });
    }
    res.status(201).json({ success: true, message: 'Activité enregistrée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de l\'enregistrement de l\'activité' });
  }
});

// POST /api/activities/click - Enregistrer un clic sur un produit
router.post('/activities/click', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ success: false, error: 'userId et productId requis' });
    }
    const success = await activityService.logProductClick(userId, productId);
    if (!success) {
      return res.status(400).json({ success: false, error: 'Erreur lors de l\'enregistrement du clic' });
    }
    res.status(201).json({ success: true, message: 'Clic enregistré avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de l\'enregistrement du clic' });
  }
});

// POST /api/activities/conversion - Enregistrer une conversion
router.post('/activities/conversion', async (req, res) => {
  try {
    const { userId, productId, conversionValue, commissionEarned, xpEarned } = req.body;
    if (!userId || !productId || !conversionValue || !commissionEarned || !xpEarned) {
      return res.status(400).json({ success: false, error: 'Données de conversion requises' });
    }
    const success = await activityService.logConversion(userId, productId, conversionValue, commissionEarned, xpEarned);
    if (!success) {
      return res.status(400).json({ success: false, error: 'Erreur lors de l\'enregistrement de la conversion' });
    }
    res.status(201).json({ success: true, message: 'Conversion enregistrée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de l\'enregistrement de la conversion' });
  }
});

// ============================================================================
// ROUTES STATISTIQUES (STATS)
// ============================================================================

// GET /api/stats/general - Récupérer les statistiques générales
router.get('/stats/general', async (req, res) => {
  try {
    const stats = await statsService.getGeneralStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des statistiques' });
  }
});

// GET /api/stats/users-by-tier - Récupérer les statistiques des utilisateurs par tier
router.get('/stats/users-by-tier', async (req, res) => {
  try {
    const stats = await statsService.getUserStatsByTier();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des statistiques par tier' });
  }
});

// ============================================================================
// ROUTES SUPPLÉMENTAIRES POUR LES TABLES DE LIAISON
// ============================================================================

// ROUTES PRODUIT-CATÉGORIES (PRODUCT_CATEGORIES)
// GET /api/product-categories - Récupérer toutes les relations produit-catégorie
router.get('/product-categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select(`
        *,
        products(name, description),
        categories(name, slug)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des relations produit-catégorie' });
  }
});

// POST /api/product-categories - Créer une relation produit-catégorie
router.post('/product-categories', async (req, res) => {
  try {
    const { productId, categoryId, isPrimary } = req.body;
    if (!productId || !categoryId) {
      return res.status(400).json({ success: false, error: 'productId et categoryId requis' });
    }
    
    const { data, error } = await supabase
      .from('product_categories')
      .insert([{ product_id: productId, category_id: categoryId, is_primary: isPrimary || false }])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création de la relation produit-catégorie' });
  }
});

// DELETE /api/product-categories/:id - Supprimer une relation produit-catégorie
router.delete('/product-categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('product_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true, message: 'Relation produit-catégorie supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de la relation produit-catégorie' });
  }
});

// ROUTES AVIS PRODUITS (PRODUCT_REVIEWS)
// GET /api/product-reviews - Récupérer tous les avis produits
router.get('/product-reviews', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select(`
        *,
        users(full_name, username),
        products(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des avis produits' });
  }
});

// GET /api/product-reviews/product/:productId - Récupérer les avis d'un produit
router.get('/product-reviews/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { data, error } = await supabase
      .from('product_reviews')
      .select(`
        *,
        users(full_name, username)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des avis du produit' });
  }
});

// POST /api/product-reviews - Créer un avis produit
router.post('/product-reviews', async (req, res) => {
  try {
    const reviewData = req.body;
    const { data, error } = await supabase
      .from('product_reviews')
      .insert([reviewData])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création de l\'avis produit' });
  }
});

// PUT /api/product-reviews/:id - Mettre à jour un avis produit
router.put('/product-reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('product_reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Avis produit non trouvé' });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de l\'avis produit' });
  }
});

// DELETE /api/product-reviews/:id - Supprimer un avis produit
router.delete('/product-reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('product_reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true, message: 'Avis produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de l\'avis produit' });
  }
});

// ROUTES ÉTAPES TIMELINE (TIMELINE_STEPS)
// GET /api/timeline-steps - Récupérer toutes les étapes de timeline
router.get('/timeline-steps', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('timeline_steps')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des étapes de timeline' });
  }
});

// POST /api/timeline-steps - Créer une étape de timeline
router.post('/timeline-steps', async (req, res) => {
  try {
    const stepData = req.body;
    const { data, error } = await supabase
      .from('timeline_steps')
      .insert([stepData])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création de l\'étape de timeline' });
  }
});

// PUT /api/timeline-steps/:id - Mettre à jour une étape de timeline
router.put('/timeline-steps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('timeline_steps')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Étape de timeline non trouvée' });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de l\'étape de timeline' });
  }
});

// DELETE /api/timeline-steps/:id - Supprimer une étape de timeline
router.delete('/timeline-steps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('timeline_steps')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true, message: 'Étape de timeline supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de l\'étape de timeline' });
  }
});

// ROUTES BADGES DE CONFIANCE (TRUST_BADGES)
// GET /api/trust-badges - Récupérer tous les badges de confiance
router.get('/trust-badges', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('trust_badges')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des badges de confiance' });
  }
});

// POST /api/trust-badges - Créer un badge de confiance
router.post('/trust-badges', async (req, res) => {
  try {
    const badgeData = req.body;
    const { data, error } = await supabase
      .from('trust_badges')
      .insert([badgeData])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création du badge de confiance' });
  }
});

// PUT /api/trust-badges/:id - Mettre à jour un badge de confiance
router.put('/trust-badges/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('trust_badges')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Badge de confiance non trouvé' });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour du badge de confiance' });
  }
});

// DELETE /api/trust-badges/:id - Supprimer un badge de confiance
router.delete('/trust-badges/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('trust_badges')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true, message: 'Badge de confiance supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du badge de confiance' });
  }
});

// ROUTES ÉLÉMENTS DE NAVIGATION (NAVIGATION_ITEMS)
// GET /api/navigation-items - Récupérer tous les éléments de navigation
router.get('/navigation-items', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des éléments de navigation' });
  }
});

// POST /api/navigation-items - Créer un élément de navigation
router.post('/navigation-items', async (req, res) => {
  try {
    const itemData = req.body;
    const { data, error } = await supabase
      .from('navigation_items')
      .insert([itemData])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création de l\'élément de navigation' });
  }
});

// PUT /api/navigation-items/:id - Mettre à jour un élément de navigation
router.put('/navigation-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('navigation_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Élément de navigation non trouvé' });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de l\'élément de navigation' });
  }
});

// DELETE /api/navigation-items/:id - Supprimer un élément de navigation
router.delete('/navigation-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('navigation_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true, message: 'Élément de navigation supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de l\'élément de navigation' });
  }
});

export default router;