-- Fix infinite recursion by creating security definer functions
-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create security definer function to check user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Create security definer function to check if user exists
CREATE OR REPLACE FUNCTION public.current_user_exists()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE user_id = auth.uid());
$$;

-- Recreate the admin policy using security definer function
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT 
  USING (public.get_current_user_role() = 'admin');

-- Add birthday field and remove age field (we'll calculate age from birthday)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birthday DATE;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS age;

-- Update photos table to use file attachments instead of URLs
ALTER TABLE public.photos DROP COLUMN IF EXISTS photo_url;
ALTER TABLE public.photos ADD COLUMN IF NOT EXISTS file_path TEXT NOT NULL DEFAULT '';
ALTER TABLE public.photos ADD COLUMN IF NOT EXISTS file_size INTEGER;
ALTER TABLE public.photos ADD COLUMN IF NOT EXISTS mime_type TEXT;

-- Update RLS policies to use security definer functions to avoid recursion
DROP POLICY IF EXISTS "Users can view their own photos" ON public.photos;
DROP POLICY IF EXISTS "Users can insert their own photos" ON public.photos;
DROP POLICY IF EXISTS "Users can update their own photos" ON public.photos;
DROP POLICY IF EXISTS "Users can delete their own photos" ON public.photos;

-- Recreate photos policies with proper user_id check
CREATE POLICY "Users can view their own photos" ON public.photos
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own photos" ON public.photos
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own photos" ON public.photos
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own photos" ON public.photos
  FOR DELETE USING (user_id = auth.uid());