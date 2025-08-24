-- Fix the remaining function with mutable search path
ALTER FUNCTION public.get_current_user_role() SET search_path = public;