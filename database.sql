-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.analytics_events (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  event_name character varying NOT NULL,
  event_data jsonb,
  page_url text,
  user_agent text,
  ip_address inet,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT analytics_events_pkey PRIMARY KEY (id),
  CONSTRAINT analytics_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.announcements (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  content text NOT NULL,
  type character varying DEFAULT 'info'::character varying CHECK (type::text = ANY (ARRAY['info'::character varying, 'warning'::character varying, 'success'::character varying, 'error'::character varying]::text[])),
  priority integer DEFAULT 1,
  is_active boolean DEFAULT true,
  start_date timestamp with time zone DEFAULT now(),
  end_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT announcements_pkey PRIMARY KEY (id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  icon character varying NOT NULL,
  description text,
  avg_commission numeric NOT NULL,
  conversion_rate numeric NOT NULL,
  active_creators integer DEFAULT 0,
  avg_xp integer DEFAULT 0,
  badge_text character varying,
  badge_color character varying,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text NOT NULL,
  thumbnail_url text,
  xp_reward integer NOT NULL,
  revenue_impact character varying,
  duration_hours integer,
  difficulty_level character varying DEFAULT 'beginner'::character varying CHECK (difficulty_level::text = ANY (ARRAY['beginner'::character varying, 'intermediate'::character varying, 'advanced'::character varying]::text[])),
  is_premium boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT courses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.daily_streaks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  streak_date date NOT NULL,
  xp_earned integer DEFAULT 0,
  activities_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT daily_streaks_pkey PRIMARY KEY (id),
  CONSTRAINT daily_streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.navigation_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  item_id character varying NOT NULL UNIQUE,
  label character varying NOT NULL,
  icon_name character varying NOT NULL,
  route character varying NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  nav_type character varying DEFAULT 'main'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT navigation_items_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  title character varying NOT NULL,
  message text NOT NULL,
  type character varying NOT NULL CHECK (type::text = ANY (ARRAY['achievement'::character varying, 'milestone'::character varying, 'streak'::character varying, 'referral'::character varying, 'course'::character varying, 'general'::character varying]::text[])),
  is_read boolean DEFAULT false,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.product_categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  product_id uuid,
  category_id uuid,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_categories_pkey PRIMARY KEY (id),
  CONSTRAINT product_categories_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT product_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.product_reviews (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  product_id uuid,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT product_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  category_id uuid,
  name character varying NOT NULL,
  description text,
  commission_rate numeric NOT NULL,
  conversion_rate numeric NOT NULL,
  xp_reward integer NOT NULL,
  average_order_value numeric,
  affiliate_url text,
  product_url text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.referrals (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  referrer_id uuid,
  referred_email character varying NOT NULL,
  referral_code character varying NOT NULL UNIQUE,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'accepted'::character varying, 'completed'::character varying]::text[])),
  bonus_earned numeric DEFAULT 0.00,
  xp_earned integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  accepted_at timestamp with time zone,
  completed_at timestamp with time zone,
  CONSTRAINT referrals_pkey PRIMARY KEY (id),
  CONSTRAINT referrals_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES public.users(id)
);
CREATE TABLE public.rewards (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text NOT NULL,
  tier character varying NOT NULL CHECK (tier::text = ANY (ARRAY['bronze'::character varying, 'silver'::character varying, 'gold'::character varying, 'platinum'::character varying]::text[])),
  xp_required integer NOT NULL,
  earnings_required numeric,
  badge_icon character varying,
  badge_color character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rewards_pkey PRIMARY KEY (id)
);
CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  name character varying NOT NULL,
  handle character varying NOT NULL,
  tier character varying NOT NULL,
  tier_color character varying NOT NULL,
  earnings character varying NOT NULL,
  quote text NOT NULL,
  avatar_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id),
  CONSTRAINT testimonials_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.timeline_steps (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  step_number integer NOT NULL,
  title character varying NOT NULL,
  description text NOT NULL,
  benefit text NOT NULL,
  icon_name character varying NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT timeline_steps_pkey PRIMARY KEY (id)
);
CREATE TABLE public.trust_badges (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  icon_name character varying NOT NULL,
  text character varying NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trust_badges_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_achievements (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  achievement_type character varying NOT NULL,
  achievement_data jsonb,
  unlocked_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_achievements_pkey PRIMARY KEY (id),
  CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_activities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  activity_type character varying NOT NULL CHECK (activity_type::text = ANY (ARRAY['click'::character varying, 'conversion'::character varying, 'xp_earned'::character varying, 'streak_updated'::character varying, 'tier_upgraded'::character varying]::text[])),
  product_id uuid,
  category_id uuid,
  xp_earned integer DEFAULT 0,
  earnings numeric DEFAULT 0.00,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_activities_pkey PRIMARY KEY (id),
  CONSTRAINT user_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_activities_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT user_activities_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.user_announcement_views (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  announcement_id uuid,
  viewed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_announcement_views_pkey PRIMARY KEY (id),
  CONSTRAINT user_announcement_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_announcement_views_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id)
);
CREATE TABLE public.user_clicks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  product_id uuid,
  click_count integer DEFAULT 1,
  last_clicked_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_clicks_pkey PRIMARY KEY (id),
  CONSTRAINT user_clicks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_clicks_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.user_connections (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  connected_user_id uuid,
  connection_type character varying DEFAULT 'referral'::character varying CHECK (connection_type::text = ANY (ARRAY['referral'::character varying, 'friend'::character varying, 'colleague'::character varying]::text[])),
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'accepted'::character varying, 'declined'::character varying, 'blocked'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_connections_pkey PRIMARY KEY (id),
  CONSTRAINT user_connections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_connections_connected_user_id_fkey FOREIGN KEY (connected_user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_conversions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  product_id uuid,
  conversion_value numeric NOT NULL,
  commission_earned numeric NOT NULL,
  xp_earned integer NOT NULL,
  conversion_date timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_conversions_pkey PRIMARY KEY (id),
  CONSTRAINT user_conversions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_conversions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.user_course_progress (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  course_id uuid,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  is_completed boolean DEFAULT false,
  xp_earned integer DEFAULT 0,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_course_progress_pkey PRIMARY KEY (id),
  CONSTRAINT user_course_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_course_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.user_favorites (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  product_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_favorites_pkey PRIMARY KEY (id),
  CONSTRAINT user_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.user_goals (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  goal_type character varying NOT NULL,
  target_value numeric,
  current_value numeric DEFAULT 0,
  target_date date,
  is_achieved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_goals_pkey PRIMARY KEY (id),
  CONSTRAINT user_goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_preferences (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE,
  preferred_categories ARRAY,
  notification_frequency character varying DEFAULT 'daily'::character varying,
  timezone character varying DEFAULT 'UTC'::character varying,
  language character varying DEFAULT 'en'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_rewards (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  reward_id uuid,
  unlocked_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_rewards_pkey PRIMARY KEY (id),
  CONSTRAINT user_rewards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_rewards_reward_id_fkey FOREIGN KEY (reward_id) REFERENCES public.rewards(id)
);
CREATE TABLE public.user_sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  session_token character varying NOT NULL UNIQUE,
  ip_address inet,
  user_agent text,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_activity timestamp with time zone DEFAULT now(),
  CONSTRAINT user_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE,
  dark_mode boolean DEFAULT false,
  notifications_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_settings_pkey PRIMARY KEY (id),
  CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL UNIQUE,
  username character varying NOT NULL UNIQUE,
  full_name character varying NOT NULL,
  avatar_url text,
  tier character varying DEFAULT 'bronze'::character varying CHECK (tier::text = ANY (ARRAY['bronze'::character varying, 'silver'::character varying, 'gold'::character varying, 'platinum'::character varying]::text[])),
  total_xp integer DEFAULT 0,
  total_earnings numeric DEFAULT 0.00,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.wallet_transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  transaction_type character varying NOT NULL CHECK (transaction_type::text = ANY (ARRAY['earnings'::character varying, 'withdrawal'::character varying, 'bonus'::character varying, 'refund'::character varying]::text[])),
  amount numeric NOT NULL,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying, 'cancelled'::character varying]::text[])),
  description text,
  reference_id character varying,
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT wallet_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);