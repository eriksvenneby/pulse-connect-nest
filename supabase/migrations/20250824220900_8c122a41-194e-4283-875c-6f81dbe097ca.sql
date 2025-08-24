-- First drop the existing function
DROP FUNCTION IF EXISTS public.get_potential_matches(uuid, integer);

-- Recreate it with the new signature that includes photos
CREATE OR REPLACE FUNCTION public.get_potential_matches(requesting_user_id uuid, limit_count integer DEFAULT 10)
RETURNS TABLE(
  user_id uuid, 
  full_name text, 
  bio text, 
  birthday date, 
  age integer, 
  distance_km numeric, 
  personality_match integer, 
  profile_picture_id uuid, 
  occupation text, 
  education text, 
  interests text[], 
  location_name text,
  photos jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Return potential matches with all their photos
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
    p.location_name,
    -- Get all photos for this user as jsonb array
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', photos.id,
            'file_path', photos.file_path,
            'photo_order', photos.photo_order
          ) ORDER BY photos.photo_order ASC
        )
        FROM photos 
        WHERE photos.user_id = p.user_id 
        AND photos.status = 'approved'
      ), 
      '[]'::jsonb
    ) as photos
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
    -- Only show users who have at least one approved photo
    AND EXISTS (
      SELECT 1 FROM photos ph 
      WHERE ph.user_id = p.user_id 
      AND ph.status = 'approved'
    )
  ORDER BY 
    -- Prioritize by personality match (placeholder for now), then distance
    personality_match DESC,
    distance_km ASC NULLS LAST
  LIMIT limit_count;
END;
$function$