-- Add profile_picture_id field to profiles table
ALTER TABLE public.profiles ADD COLUMN profile_picture_id UUID REFERENCES public.photos(id);

-- Create trigger to set first uploaded photo as default profile picture
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
$$ LANGUAGE plpgsql SECURITY DEFINER;