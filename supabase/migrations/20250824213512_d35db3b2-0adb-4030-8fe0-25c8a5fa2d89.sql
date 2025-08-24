-- Create swipes table to track user interactions
CREATE TABLE public.swipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  is_like BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one swipe per user pair
  UNIQUE(user_id, target_user_id)
);

-- Enable RLS on swipes
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;

-- Create policies for swipes
CREATE POLICY "Users can view their own swipes" 
ON public.swipes 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own swipes" 
ON public.swipes 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Create matches table for mutual likes
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Ensure one match per user pair (ordered by UUID to prevent duplicates)
  CONSTRAINT matches_user_pair_unique CHECK (user1_id < user2_id),
  UNIQUE(user1_id, user2_id)
);

-- Enable RLS on matches
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Create policies for matches
CREATE POLICY "Users can view their own matches" 
ON public.matches 
FOR SELECT 
USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Add indexes for performance
CREATE INDEX idx_swipes_user_id ON public.swipes(user_id);
CREATE INDEX idx_swipes_target_user_id ON public.swipes(target_user_id);
CREATE INDEX idx_matches_user1_id ON public.matches(user1_id);
CREATE INDEX idx_matches_user2_id ON public.matches(user2_id);

-- Function to check for mutual likes and create matches
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically check for matches
CREATE TRIGGER trigger_check_match
  AFTER INSERT ON public.swipes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_create_match();

-- Function to get potential matches for a user
CREATE OR REPLACE FUNCTION public.get_potential_matches(
  requesting_user_id UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  bio TEXT,
  birthday DATE,
  age INTEGER,
  distance_km NUMERIC,
  personality_match INTEGER,
  profile_picture_id UUID,
  occupation TEXT,
  education TEXT,
  interests TEXT[],
  location_name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_lat NUMERIC;
  user_lng NUMERIC;
  user_age_min INTEGER;
  user_age_max INTEGER;
  user_max_distance INTEGER;
  user_dating_pref dating_preference;
BEGIN
  -- Get requesting user's preferences and location
  SELECT 
    latitude, longitude, age_range_min, age_range_max, 
    max_distance, dating_preference
  INTO 
    user_lat, user_lng, user_age_min, user_age_max,
    user_max_distance, user_dating_pref
  FROM profiles 
  WHERE profiles.user_id = requesting_user_id;
  
  -- Return potential matches
  RETURN QUERY
  SELECT 
    p.user_id,
    p.full_name,
    p.bio,
    p.birthday,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.birthday))::INTEGER as age,
    -- Calculate distance using Haversine formula approximation
    CASE 
      WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL 
      THEN (
        6371 * acos(
          cos(radians(user_lat)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians(user_lng)) + 
          sin(radians(user_lat)) * sin(radians(p.latitude))
        )
      )::NUMERIC
      ELSE NULL
    END as distance_km,
    0 as personality_match, -- Placeholder for now
    p.profile_picture_id,
    p.occupation,
    p.education,
    p.interests,
    p.location_name
  FROM profiles p
  WHERE 
    -- Exclude self
    p.user_id != requesting_user_id
    -- Exclude users already swiped on
    AND NOT EXISTS (
      SELECT 1 FROM swipes s 
      WHERE s.user_id = requesting_user_id 
      AND s.target_user_id = p.user_id
    )
    -- Age filter
    AND (
      p.birthday IS NULL OR 
      EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.birthday)) BETWEEN user_age_min AND user_age_max
    )
    -- Distance filter
    AND (
      user_lat IS NULL OR user_lng IS NULL OR 
      p.latitude IS NULL OR p.longitude IS NULL OR
      user_max_distance IS NULL OR
      (
        6371 * acos(
          cos(radians(user_lat)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians(user_lng)) + 
          sin(radians(user_lat)) * sin(radians(p.latitude))
        )
      ) <= user_max_distance
    )
    -- Only show profiles that are complete
    AND p.profile_complete = true
  ORDER BY 
    -- Prioritize by personality match (placeholder for now), then distance
    personality_match DESC,
    distance_km ASC NULLS LAST
  LIMIT limit_count;
END;
$$;