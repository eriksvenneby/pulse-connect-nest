-- Add sex field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN sex TEXT CHECK (sex IN ('male', 'female', 'non-binary', 'prefer-not-to-say'));