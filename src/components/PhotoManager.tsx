import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Camera, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Photo {
  id: string;
  file_path: string;
  photo_order: number;
}

interface PhotoManagerProps {
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  maxPhotos?: number;
}

export const PhotoManager = ({ photos, onPhotosChange, maxPhotos = 6 }: PhotoManagerProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxPhotos - photos.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more photos (max ${maxPhotos} total)`);
    }

    await uploadPhotos(filesToUpload);
  };

  const uploadPhotos = async (files: File[]) => {
    setUploading(true);
    const newPhotos: Photo[] = [];

    try {
      for (const file of files) {
        // Upload to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user!.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Save to database
        const { data: photoData, error: dbError } = await supabase
          .from('photos')
          .insert({
            user_id: user!.id,
            file_path: fileName,
            photo_order: photos.length + newPhotos.length,
            status: 'approved' // Auto-approve for now
          })
          .select()
          .single();

        if (dbError) throw dbError;

        newPhotos.push(photoData);
      }

      onPhotosChange([...photos, ...newPhotos]);
      toast.success(`${newPhotos.length} photo(s) uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (photo: Photo) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('profile-photos')
        .remove([photo.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;

      const updatedPhotos = photos.filter(p => p.id !== photo.id);
      onPhotosChange(updatedPhotos);
      toast.success('Photo deleted successfully');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  const reorderPhotos = async (fromIndex: number, toIndex: number) => {
    const reorderedPhotos = [...photos];
    const [moved] = reorderedPhotos.splice(fromIndex, 1);
    reorderedPhotos.splice(toIndex, 0, moved);

    // Update photo_order for each photo
    const updates = reorderedPhotos.map((photo, index) => ({
      id: photo.id,
      photo_order: index
    }));

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from('photos')
          .update({ photo_order: update.photo_order })
          .eq('id', update.id);
        
        if (error) throw error;
      }

      onPhotosChange(reorderedPhotos);
    } catch (error) {
      console.error('Error reordering photos:', error);
      toast.error('Failed to reorder photos');
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderPhotos(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const getPhotoUrl = (photo: Photo) => {
    const { data } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(photo.file_path);
    return data.publicUrl;
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Photos ({photos.length}/{maxPhotos})</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || photos.length >= maxPhotos}
        >
          <Plus className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Add Photo'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="relative aspect-square bg-gradient-soft rounded-lg overflow-hidden cursor-move group"
          >
            <img
              src={getPhotoUrl(photo)}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={() => deletePhoto(photo)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {index === 0 && (
              <div className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded">
                Main
              </div>
            )}
          </div>
        ))}
        
        {/* Empty slots */}
        {Array.from({ length: Math.max(0, maxPhotos - photos.length) }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="aspect-square bg-gradient-soft rounded-lg border-2 border-dashed border-primary/20 flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-8 w-8 text-primary/40" />
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Drag photos to reorder. First photo will be your main profile picture.
      </p>
    </Card>
  );
};