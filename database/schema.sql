-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_number text NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  pickup_date date NOT NULL,
  return_date date NOT NULL,
  pickup_location text DEFAULT 'Cebu City'::text,
  return_location text DEFAULT 'Cebu City'::text,
  total_days integer NOT NULL,
  base_price numeric NOT NULL,
  extras_price numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  total_price numeric NOT NULL,
  deposit_paid numeric DEFAULT 0,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'active'::text, 'completed'::text, 'cancelled'::text])),
  payment_status text DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'partial'::text, 'paid'::text, 'refunded'::text])),
  extras jsonb DEFAULT '{}'::jsonb,
  notes text,
  cancelled_at timestamp with time zone,
  cancellation_reason text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT bookings_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE TABLE public.contact_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new'::text CHECK (status = ANY (ARRAY['new'::text, 'read'::text, 'replied'::text, 'closed'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_inquiries_pkey PRIMARY KEY (id)
);
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT favorites_pkey PRIMARY KEY (id),
  CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT favorites_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL,
  amount numeric NOT NULL,
  payment_method text NOT NULL,
  payment_reference text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text])),
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  phone text,
  address text,
  city text DEFAULT 'Cebu City'::text,
  avatar_url text,
  driver_license_number text,
  driver_license_expiry date,
  date_of_birth date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES public.users(id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid UNIQUE,
  user_id uuid NOT NULL,
  vehicle_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  is_verified boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT reviews_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'customer'::text CHECK (role = ANY (ARRAY['customer'::text, 'staff'::text, 'admin'::text])),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.vehicle_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vehicle_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.vehicles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  license_plate text NOT NULL UNIQUE,
  color text,
  transmission text DEFAULT 'automatic'::text CHECK (transmission = ANY (ARRAY['automatic'::text, 'manual'::text])),
  fuel_type text DEFAULT 'gasoline'::text CHECK (fuel_type = ANY (ARRAY['gasoline'::text, 'diesel'::text, 'electric'::text, 'hybrid'::text])),
  seats integer DEFAULT 5,
  doors integer DEFAULT 4,
  luggage_capacity integer DEFAULT 2,
  features jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  thumbnail text,
  price_per_day numeric NOT NULL,
  price_per_week numeric,
  price_per_month numeric,
  deposit_amount numeric DEFAULT 0,
  mileage integer DEFAULT 0,
  status text DEFAULT 'available'::text CHECK (status = ANY (ARRAY['available'::text, 'rented'::text, 'maintenance'::text, 'retired'::text])),
  location text DEFAULT 'Cebu City'::text,
  is_featured boolean DEFAULT false,
  average_rating numeric DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vehicles_pkey PRIMARY KEY (id),
  CONSTRAINT vehicles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.vehicle_categories(id)
);