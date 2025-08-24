import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Photo {
  id: string;
  file_path: string;
  photo_order: number;
}

export const useUserPhotos = (photos: Photo[]) => {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!photos || photos.length === 0) {
      setPhotoUrls([]);
      setLoading(false);
      return;
    }

    const loadPhotoUrls = async () => {
      try {
        setLoading(true);
        
        // Sort photos by order and get public URLs
        const sortedPhotos = [...photos].sort((a, b) => a.photo_order - b.photo_order);
        const urls = sortedPhotos.map(photo => {
          const { data: signedUrlData } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(photo.file_path);
          
          return signedUrlData.publicUrl;
        });

        setPhotoUrls(urls);
      } catch (error) {
        console.error('Error loading photo URLs:', error);
        setPhotoUrls([]);
      } finally {
        setLoading(false);
      }
    };

    loadPhotoUrls();
  }, [photos]);

  return { photoUrls, loading };
};