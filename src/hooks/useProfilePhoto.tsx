import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProfilePhoto = (photoId: string | null) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!photoId) {
      setPhotoUrl(null);
      setLoading(false);
      return;
    }

    const loadPhotoUrl = async () => {
      try {
        setLoading(true);
        
        // Get photo details from database
        const { data: photo, error: photoError } = await supabase
          .from('photos')
          .select('file_path')
          .eq('id', photoId)
          .single();

        if (photoError) throw photoError;

        if (photo?.file_path) {
          // Get signed URL for the photo
          const { data: signedUrlData } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(photo.file_path);

          setPhotoUrl(signedUrlData.publicUrl);
        }
      } catch (error) {
        console.error('Error loading photo:', error);
        setPhotoUrl(null);
      } finally {
        setLoading(false);
      }
    };

    loadPhotoUrl();
  }, [photoId]);

  return { photoUrl, loading };
};