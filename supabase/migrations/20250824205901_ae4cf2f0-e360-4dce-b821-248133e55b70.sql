-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS set_default_profile_picture_trigger ON public.photos;

-- Fix search path issues for existing functions
ALTER FUNCTION public.user_has_completed_test(user_uuid UUID) SET search_path = public;

-- Fix and recreate the profile picture function with proper search path
DROP FUNCTION IF EXISTS public.set_default_profile_picture();
CREATE OR REPLACE FUNCTION public.set_default_profile_picture()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the user's first photo and they don't have a profile picture set
  IF (SELECT COUNT(*) FROM public.photos WHERE user_id = NEW.user_id) = 1 AND
     (SELECT profile_picture_id FROM public.profiles WHERE user_id = NEW.user_id) IS NULL THEN
    UPDATE public.profiles 
    SET profile_picture_id = NEW.id 
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to set first uploaded photo as default profile picture
CREATE TRIGGER set_default_profile_picture_trigger
AFTER INSERT ON public.photos
FOR EACH ROW
EXECUTE FUNCTION public.set_default_profile_picture();