import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ighzyizvcvebqlhowikk.supabase.co'
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvdG9wZGpxcXFpaXpmc2xocGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTE3MTcsImV4cCI6MjA3NjEyNzcxN30.SJ_Y8Jmfp1Og1p0L39HzRJEqVl_HYXFSL8B9hvDKP5w
// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types TypeScript pour la base de données
export interface User {
  id: string
  email: string
  username: string
  full_name: string
  avatar_url?: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  total_xp: number
  total_earnings: number
  current_streak: number
  longest_streak: number
  last_activity_date?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description?: string
  avg_commission: number
  conversion_rate: number
  active_creators: number
  avg_xp: number
  badge_text?: string
  badge_color?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  description?: string
  commission_rate: number
  conversion_rate: number
  xp_reward: number
  average_order_value?: number
  affiliate_url?: string
  product_url?: string
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail_url?: string
  xp_reward: number
  revenue_impact?: string
  duration_hours?: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  is_premium: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface UserCourseProgress {
  id: string
  user_id: string
  course_id: string
  progress_percentage: number
  is_completed: boolean
  xp_earned: number
  started_at: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface Reward {
  id: string
  name: string
  description: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  xp_required: number
  earnings_required?: number
  badge_icon?: string
  badge_color?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserActivity {
  id: string
  user_id: string
  activity_type: 'click' | 'conversion' | 'xp_earned' | 'streak_updated' | 'tier_upgraded'
  product_id?: string
  category_id?: string
  xp_earned: number
  earnings: number
  metadata?: any
  created_at: string
}

export interface UserClick {
  id: string
  user_id: string
  product_id: string
  click_count: number
  last_clicked_at: string
  created_at: string
}

export interface UserConversion {
  id: string
  user_id: string
  product_id: string
  conversion_value: number
  commission_earned: number
  xp_earned: number
  conversion_date: string
  created_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referred_email: string
  referral_code: string
  status: 'pending' | 'accepted' | 'completed'
  bonus_earned: number
  xp_earned: number
  created_at: string
  accepted_at?: string
  completed_at?: string
}

export interface WaitlistEntry {
  id: string
  email: string
  status: 'pending' | 'notified' | 'converted'
  source: string
  metadata: any
  created_at: string
  updated_at: string
}

export interface DailyStreak {
  id: string
  user_id: string
  streak_date: string
  xp_earned: number
  activities_count: number
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'achievement' | 'milestone' | 'streak' | 'referral' | 'course' | 'general'
  is_read: boolean
  metadata?: any
  created_at: string
}

// Fonctions utilitaires pour interagir avec Supabase

// Fonctions pour les utilisateurs
export const userService = {
  // Récupérer tous les utilisateurs (pour l'admin)
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all users:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer un utilisateur par ID
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      
      // If user doesn't exist, try to create them from auth data
      if (error.code === 'PGRST116') {
        console.log('User not found in users table, attempting to create from auth data...')
        return await this.createUserFromAuth(id)
      }
      
      return null
    }
    
    return data
  },

  // Créer un utilisateur à partir des données d'authentification
  async createUserFromAuth(authUserId: string): Promise<User | null> {
    try {
      // Get auth user data
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser || authUser.id !== authUserId) {
        console.error('Error getting auth user:', authError)
        return null
      }

      // Create user record
      const userData = {
        id: authUser.id,
        email: authUser.email!,
        username: authUser.user_metadata?.username || authUser.email!.split('@')[0],
        full_name: authUser.user_metadata?.full_name || 
                  `${authUser.user_metadata?.first_name || ''} ${authUser.user_metadata?.last_name || ''}`.trim() ||
                  authUser.email!.split('@')[0],
        tier: 'bronze',
        total_xp: 0,
        total_earnings: 0,
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: new Date().toISOString()
      }

      return await this.createUser(userData)
    } catch (error) {
      console.error('Error creating user from auth:', error)
      return null
    }
  },

  // Récupérer un utilisateur par email
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      console.error('Error fetching user by email:', error)
      return null
    }
    
    return data
  },

  // Créer un nouvel utilisateur
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user:', error)
      return null
    }
    
    return data
  },

  // Mettre à jour un utilisateur
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user:', error)
      return null
    }
    
    return data
  },

  // Ajouter de l'XP à un utilisateur
  async addXP(userId: string, xpAmount: number): Promise<boolean> {
    const { error } = await supabase.rpc('add_user_xp', {
      user_id: userId,
      xp_amount: xpAmount
    })
    
    if (error) {
      console.error('Error adding XP:', error)
      return false
    }
    
    return true
  },

  // Supprimer un utilisateur
  async deleteUser(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting user:', error)
      return false
    }
    
    return true
  },

  // Rechercher des utilisateurs
  async searchUsers(query: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`email.ilike.%${query}%,username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error searching users:', error)
      return []
    }
    
    return data || []
  }
}

// Fonctions pour les catégories
export const categoryService = {
  // Récupérer toutes les catégories (pour l'admin)
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
    
    if (error) {
      console.error('Error fetching all categories:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer toutes les catégories actives
  async getActiveCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    
    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer une catégorie par ID
  async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching category by ID:', error)
      return null
    }
    
    return data
  },

  // Récupérer une catégorie par slug
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    
    if (error) {
      console.error('Error fetching category by slug:', error)
      return null
    }
    
    return data
  },

  // Créer une nouvelle catégorie
  async createCategory(categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating category:', error)
      return null
    }
    
    return data
  },

  // Mettre à jour une catégorie
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating category:', error)
      return null
    }
    
    return data
  },

  // Supprimer une catégorie
  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting category:', error)
      return false
    }
    
    return true
  }
}

// Fonctions pour les produits
export const productService = {
  // Récupérer tous les produits (pour l'admin)
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug)
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all products:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer les produits d'une catégorie
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer tous les produits actifs
  async getAllActiveProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all products:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer un produit par ID
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching product by ID:', error)
      return null
    }
    
    return data
  },

  // Créer un nouveau produit
  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating product:', error)
      return null
    }
    
    return data
  },

  // Mettre à jour un produit
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating product:', error)
      return null
    }
    
    return data
  },

  // Supprimer un produit
  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting product:', error)
      return false
    }
    
    return true
  },

  // Rechercher des produits
  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, slug)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error searching products:', error)
      return []
    }
    
    return data || []
  }
}

// Fonctions pour les cours
export const courseService = {
  // Récupérer tous les cours (pour l'admin)
  async getAllCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('sort_order')
    
    if (error) {
      console.error('Error fetching all courses:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer tous les cours actifs
  async getActiveCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    
    if (error) {
      console.error('Error fetching courses:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer un cours par ID
  async getCourseById(id: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching course by ID:', error)
      return null
    }
    
    return data
  },

  // Récupérer les cours d'un utilisateur
  async getUserCourses(userId: string): Promise<(Course & { progress: UserCourseProgress | null })[]> {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        user_course_progress!left(*)
      `)
      .eq('is_active', true)
      .order('sort_order')
    
    if (error) {
      console.error('Error fetching user courses:', error)
      return []
    }
    
    return data?.map(course => ({
      ...course,
      progress: course.user_course_progress?.[0] || null
    })) || []
  },

  // Créer un nouveau cours
  async createCourse(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating course:', error)
      return null
    }
    
    return data
  },

  // Mettre à jour un cours
  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating course:', error)
      return null
    }
    
    return data
  },

  // Supprimer un cours
  async deleteCourse(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting course:', error)
      return false
    }
    
    return true
  },

  // Mettre à jour le progrès d'un cours
  async updateCourseProgress(
    userId: string, 
    courseId: string, 
    progress: number, 
    isCompleted: boolean = false
  ): Promise<boolean> {
    const { error } = await supabase
      .from('user_course_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        progress_percentage: progress,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null
      })
    
    if (error) {
      console.error('Error updating course progress:', error)
      return false
    }
    
    return true
  }
}

// Fonctions pour les activités utilisateur
export const activityService = {
  // Enregistrer une activité
  async logActivity(
    userId: string,
    activityType: UserActivity['activity_type'],
    xpEarned: number = 0,
    earnings: number = 0,
    productId?: string,
    categoryId?: string,
    metadata?: any
  ): Promise<boolean> {
    const { error } = await supabase
      .from('user_activities')
      .insert([{
        user_id: userId,
        activity_type: activityType,
        product_id: productId,
        category_id: categoryId,
        xp_earned: xpEarned,
        earnings: earnings,
        metadata: metadata
      }])
    
    if (error) {
      console.error('Error logging activity:', error)
      return false
    }
    
    return true
  },

  // Enregistrer un clic sur un produit
  async logProductClick(userId: string, productId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_clicks')
      .upsert({
        user_id: userId,
        product_id: productId,
        click_count: 1,
        last_clicked_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,product_id',
        ignoreDuplicates: false
      })
    
    if (error) {
      console.error('Error logging product click:', error)
      return false
    }
    
    return true
  },

  // Enregistrer une conversion
  async logConversion(
    userId: string,
    productId: string,
    conversionValue: number,
    commissionEarned: number,
    xpEarned: number
  ): Promise<boolean> {
    const { error } = await supabase
      .from('user_conversions')
      .insert([{
        user_id: userId,
        product_id: productId,
        conversion_value: conversionValue,
        commission_earned: commissionEarned,
        xp_earned: xpEarned
      }])
    
    if (error) {
      console.error('Error logging conversion:', error)
      return false
    }
    
    return true
  },

  // Récupérer toutes les activités (pour l'admin)
  async getAllActivities(): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_activities')
      .select(`
        *,
        users(full_name, username),
        products(name),
        categories(name)
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all activities:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer les activités d'un utilisateur
  async getUserActivities(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_activities')
      .select(`
        *,
        products(name),
        categories(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user activities:', error)
      return []
    }
    
    return data || []
  }
}

// Fonctions pour les récompenses
export const rewardService = {
  // Récupérer toutes les récompenses (pour l'admin)
  async getAllRewards(): Promise<Reward[]> {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .order('xp_required')
    
    if (error) {
      console.error('Error fetching all rewards:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer une récompense par ID
  async getRewardById(id: string): Promise<Reward | null> {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching reward by ID:', error)
      return null
    }
    
    return data
  },

  // Créer une nouvelle récompense
  async createReward(rewardData: Omit<Reward, 'id' | 'created_at' | 'updated_at'>): Promise<Reward | null> {
    const { data, error } = await supabase
      .from('rewards')
      .insert([rewardData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating reward:', error)
      return null
    }
    
    return data
  },

  // Mettre à jour une récompense
  async updateReward(id: string, updates: Partial<Reward>): Promise<Reward | null> {
    const { data, error } = await supabase
      .from('rewards')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating reward:', error)
      return null
    }
    
    return data
  },

  // Supprimer une récompense
  async deleteReward(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('rewards')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting reward:', error)
      return false
    }
    
    return true
  },

  // Récupérer les récompenses d'un utilisateur
  async getUserRewards(userId: string): Promise<Reward[]> {
    const { data, error } = await supabase
      .from('user_rewards')
      .select(`
        *,
        rewards(*)
      `)
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error fetching user rewards:', error)
      return []
    }
    
    return data?.map(item => item.rewards).filter(Boolean) || []
  },

  // Vérifier et débloquer les récompenses
  async checkAndUnlockRewards(userId: string): Promise<Reward[]> {
    const { data, error } = await supabase.rpc('check_user_rewards', {
      user_id: userId
    })
    
    if (error) {
      console.error('Error checking rewards:', error)
      return []
    }
    
    return data || []
  }
}

// Fonctions pour les notifications
export const notificationService = {
  // Récupérer les notifications d'un utilisateur
  async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (unreadOnly) {
      query = query.eq('is_read', false)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
    
    return data || []
  },

  // Marquer une notification comme lue
  async markAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
    
    if (error) {
      console.error('Error marking notification as read:', error)
      return false
    }
    
    return true
  },

  // Créer une notification
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: Notification['type'],
    metadata?: any
  ): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        title,
        message,
        type,
        metadata
      }])
    
    if (error) {
      console.error('Error creating notification:', error)
      return false
    }
    
    return true
  }
}

// Fonctions pour les témoignages
export const testimonialService = {
  // Récupérer tous les témoignages (pour l'admin)
  async getAllTestimonials(): Promise<any[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select(`
        *,
        users(full_name, username)
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all testimonials:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer tous les témoignages actifs
  async getActiveTestimonials(limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching testimonials:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer un témoignage par ID
  async getTestimonialById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('testimonials')
      .select(`
        *,
        users(full_name, username)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching testimonial by ID:', error)
      return null
    }
    
    return data
  },

  // Créer un nouveau témoignage
  async createTestimonial(testimonialData: any): Promise<any | null> {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonialData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating testimonial:', error)
      return null
    }
    
    return data
  },

  // Mettre à jour un témoignage
  async updateTestimonial(id: string, updates: any): Promise<any | null> {
    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating testimonial:', error)
      return null
    }
    
    return data
  },

  // Supprimer un témoignage
  async deleteTestimonial(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting testimonial:', error)
      return false
    }
    
    return true
  }
}

// Fonctions pour les annonces
export const announcementService = {
  // Récupérer toutes les annonces (pour l'admin)
  async getAllAnnouncements(): Promise<any[]> {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all announcements:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer les annonces actives
  async getActiveAnnouncements(): Promise<any[]> {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching active announcements:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer une annonce par ID
  async getAnnouncementById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching announcement by ID:', error)
      return null
    }
    
    return data
  },

  // Créer une nouvelle annonce
  async createAnnouncement(announcementData: any): Promise<any | null> {
    const { data, error } = await supabase
      .from('announcements')
      .insert([announcementData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating announcement:', error)
      return null
    }
    
    return data
  },

  // Mettre à jour une annonce
  async updateAnnouncement(id: string, updates: any): Promise<any | null> {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating announcement:', error)
      return null
    }
    
    return data
  },

  // Supprimer une annonce
  async deleteAnnouncement(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting announcement:', error)
      return false
    }
    
    return true
  }
}

// Fonctions pour les opportunités top
export const opportunityService = {
  // Récupérer les top opportunités depuis la vue top_opportunities
  async getTopOpportunities(limit: number = 3): Promise<any[]> {
    const { data, error } = await supabase
      .from('top_opportunities')
      .select('*')
      .limit(limit)
      .order('rank')
    
    if (error) {
      console.error('Error fetching top opportunities:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer les statistiques des opportunités pour une catégorie
  async getCategoryOpportunityStats(categoryId: string): Promise<any> {
    const { data, error } = await supabase
      .from('top_opportunities')
      .select('*')
      .eq('id', categoryId)
      .single()
    
    if (error) {
      console.error('Error fetching category opportunity stats:', error)
      return null
    }
    
    return data
  }
}

// Fonctions pour les étapes de timeline
export const timelineService = {
  // Récupérer toutes les étapes de timeline actives
  async getActiveTimelineSteps(): Promise<any[]> {
    const { data, error } = await supabase
      .from('timeline_steps')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    
    if (error) {
      console.error('Error fetching timeline steps:', error)
      return []
    }
    
    return data || []
  }
}

// Fonctions pour les badges de confiance
export const trustBadgeService = {
  // Récupérer tous les badges de confiance actifs
  async getActiveTrustBadges(): Promise<any[]> {
    const { data, error } = await supabase
      .from('trust_badges')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    
    if (error) {
      console.error('Error fetching trust badges:', error)
      return []
    }
    
    return data || []
  }
}

// Fonctions pour les configurations de l'application
export const configService = {
  // Récupérer les seuils XP pour les badges
  async getBadgeXPThresholds(): Promise<Record<string, number>> {
    // Pour l'instant, retourner des valeurs par défaut
    // Dans une vraie application, ces valeurs seraient stockées en base
    return {
      bronze: 1000,
      silver: 2000,
      gold: 5000,
      platinum: 10000
    }
  },

  // Récupérer les configurations de commission
  async getCommissionConfig(): Promise<Record<string, number>> {
    return {
      defaultLifetimeCommission: 5,
      referralBonus: 100,
      milestoneTarget: 50
    }
  },

  // Récupérer les textes de tooltip
  async getTooltipTexts(): Promise<Record<string, string>> {
    return {
      metricCard: 'Based on last 30 days',
      opportunityTile: 'Lifetime commission',
      referralCard: 'Referral rewards will decrease once Freenzy opens publicly — share now to lock your lifetime rate'
    }
  }
}

// Fonctions d'authentification
export const authService = {
  // S'inscrire avec email et mot de passe
  async signUp(email: string, password: string, userData: Partial<User>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    return { data, error }
  },

  // Se connecter avec email et mot de passe
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    return { data, error }
  },

  // Se déconnecter
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Récupérer l'utilisateur actuel
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Écouter les changements d'authentification
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Fonctions pour les transactions
export const transactionService = {
  // Récupérer toutes les transactions (pour l'admin)
  async getAllTransactions(): Promise<any[]> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select(`
        *,
        users(full_name, username, email)
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all transactions:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer les transactions d'un utilisateur
  async getUserTransactions(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user transactions:', error)
      return []
    }
    
    return data || []
  },

  // Créer une nouvelle transaction
  async createTransaction(transactionData: any): Promise<any | null> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert([transactionData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating transaction:', error)
      return null
    }
    
    return data
  },

  // Mettre à jour le statut d'une transaction
  async updateTransactionStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('wallet_transactions')
      .update({ 
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating transaction status:', error)
      return false
    }
    
    return true
  }
}


// Fonctions pour les parrainages
export const referralService = {
  // Récupérer tous les parrainages (pour l'admin)
  async getAllReferrals(): Promise<any[]> {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        users!referrals_referrer_id_fkey(full_name, username, email)
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all referrals:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer les parrainages d'un utilisateur
  async getUserReferrals(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user referrals:', error)
      return []
    }
    
    return data || []
  },

  // Mettre à jour le statut d'un parrainage
  async updateReferralStatus(id: string, status: string): Promise<boolean> {
    const updateData: any = { status }
    
    if (status === 'accepted') {
      updateData.accepted_at = new Date().toISOString()
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('referrals')
      .update(updateData)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating referral status:', error)
      return false
    }
    
    return true
  }
}

// Fonctions pour les statistiques globales
export const statsService = {
  // Récupérer les statistiques générales
  async getGeneralStats(): Promise<any> {
    const [usersResult, productsResult, categoriesResult, coursesResult] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('products').select('id', { count: 'exact' }),
      supabase.from('categories').select('id', { count: 'exact' }),
      supabase.from('courses').select('id', { count: 'exact' })
    ])

    const [totalEarningsResult, totalXPResult] = await Promise.all([
      supabase.from('users').select('total_earnings').not('total_earnings', 'is', null),
      supabase.from('users').select('total_xp').not('total_xp', 'is', null)
    ])

    const totalEarnings = totalEarningsResult.data?.reduce((sum, user) => sum + (user.total_earnings || 0), 0) || 0
    const totalXP = totalXPResult.data?.reduce((sum, user) => sum + (user.total_xp || 0), 0) || 0

    return {
      totalUsers: usersResult.count || 0,
      totalProducts: productsResult.count || 0,
      totalCategories: categoriesResult.count || 0,
      totalCourses: coursesResult.count || 0,
      totalEarnings,
      totalXP
    }
  },

  // Récupérer les statistiques des utilisateurs par tier
  async getUserStatsByTier(): Promise<any[]> {
    const { data, error } = await supabase
      .from('users')
      .select('tier')
      .not('tier', 'is', null)
    
    if (error) {
      console.error('Error fetching user stats by tier:', error)
      return []
    }

    const tierCounts = data?.reduce((acc, user) => {
      acc[user.tier] = (acc[user.tier] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    return Object.entries(tierCounts).map(([tier, count]) => ({
      tier,
      count
    }))
  }
}

// Fonctions pour la waitlist
export const waitlistService = {
  // Récupérer toutes les entrées de waitlist
  async getAllWaitlistEntries(): Promise<WaitlistEntry[]> {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all waitlist entries:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer une entrée de waitlist par ID
  async getWaitlistEntryById(id: string): Promise<WaitlistEntry | null> {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching waitlist entry:', error)
      return null
    }
    
    return data
  },

  // Récupérer une entrée de waitlist par email
  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | null> {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      console.error('Error fetching waitlist entry by email:', error)
      return null
    }
    
    return data
  },

  // Créer une nouvelle entrée de waitlist
  async createWaitlistEntry(entryData: Omit<WaitlistEntry, 'id' | 'created_at' | 'updated_at'>): Promise<WaitlistEntry | null> {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([entryData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating waitlist entry:', error)
      return null
    }
    
    return data
  },

  // Mettre à jour une entrée de waitlist
  async updateWaitlistEntry(id: string, updates: Partial<WaitlistEntry>): Promise<WaitlistEntry | null> {
    const { data, error } = await supabase
      .from('waitlist')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating waitlist entry:', error)
      return null
    }
    
    return data
  },

  // Mettre à jour le statut d'une entrée de waitlist
  async updateWaitlistStatus(id: string, status: 'pending' | 'notified' | 'converted'): Promise<boolean> {
    const { error } = await supabase
      .from('waitlist')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating waitlist status:', error)
      return false
    }
    
    return true
  },

  // Supprimer une entrée de waitlist
  async deleteWaitlistEntry(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('waitlist')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting waitlist entry:', error)
      return false
    }
    
    return true
  },

  // Rechercher des entrées de waitlist
  async searchWaitlistEntries(query: string): Promise<WaitlistEntry[]> {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .ilike('email', `%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error searching waitlist entries:', error)
      return []
    }
    
    return data || []
  },

  // Récupérer les statistiques de la waitlist
  async getWaitlistStats(): Promise<any> {
    const { data, error } = await supabase
      .from('waitlist')
      .select('status')
    
    if (error) {
      console.error('Error fetching waitlist stats:', error)
      return { total: 0, pending: 0, notified: 0, converted: 0 }
    }

    const stats = data?.reduce((acc, entry) => {
      acc.total++
      acc[entry.status]++
      return acc
    }, { total: 0, pending: 0, notified: 0, converted: 0 }) || { total: 0, pending: 0, notified: 0, converted: 0 }

    return stats
  }
}

// Export par défaut
export default supabase