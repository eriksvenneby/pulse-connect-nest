-- Update sex field constraint to only allow male, female, or non-binary
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_sex_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_sex_check CHECK (sex IN ('male', 'female', 'non-binary'));