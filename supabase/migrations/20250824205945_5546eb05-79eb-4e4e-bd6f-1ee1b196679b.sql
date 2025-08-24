-- Fix any remaining function search path issues
-- Check which functions still have mutable search paths
SELECT proname, prosecdef, proconfig 
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND (proconfig IS NULL OR NOT 'search_path=public' = ANY(proconfig))
  AND prosecdef = true;