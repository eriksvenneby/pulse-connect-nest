-- Fix search path security issues for the functions created in previous migration

-- Update check_and_create_match function with proper search_path
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only check for matches if the current swipe is a like
  IF NEW.is_like = true THEN
    -- Check if the target user has also liked the current user
    IF EXISTS (
      SELECT 1 FROM public.swipes 
      WHERE user_id = NEW.target_user_id 
      AND target_user_id = NEW.user_id 
      AND is_like = true
    ) THEN
      -- Create a match (ensure user1_id < user2_id for uniqueness)
      INSERT INTO public.matches (user1_id, user2_id)
      VALUES (
        LEAST(NEW.user_id, NEW.target_user_id),
        GREATEST(NEW.user_id, NEW.target_user_id)
      )
      ON CONFLICT (user1_id, user2_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;