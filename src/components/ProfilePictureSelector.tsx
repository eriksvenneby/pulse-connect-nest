import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit3, Check } from "lucide-react";
import { useProfilePhoto } from "@/hooks/useProfilePhoto";

interface ProfilePictureSelectorProps {
  photos: any[];
  currentProfilePictureId?: string;
  onProfilePictureChange: (photoId: string) => void;
  children: React.ReactNode;
}

export const ProfilePictureSelector = ({ 
  photos, 
  currentProfilePictureId, 
  onProfilePictureChange,
  children 
}: ProfilePictureSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleSelectPhoto = async (photoId: string) => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('profiles')
        .update({ profile_picture_id: photoId })
        .eq('user_id', user.id);

      if (error) throw error;

      onProfilePictureChange(photoId);
      setIsOpen(false);
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error("Failed to update profile picture");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {photos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No photos uploaded yet. Add some photos first!
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => {
                const PhotoComponent = ({ photoId }: { photoId: string }) => {
                  const { photoUrl, loading } = useProfilePhoto(photoId);
                  
                  return (
                    <div className="aspect-square bg-gradient-primary overflow-hidden">
                      {loading ? (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                          Loading...
                        </div>
                      ) : photoUrl ? (
                        <img 
                          src={photoUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                          P
                        </div>
                      )}
                    </div>
                  );
                };

                return (
                  <Card 
                    key={photo.id} 
                    className={`relative overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                      currentProfilePictureId === photo.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSelectPhoto(photo.id)}
                  >
                    <PhotoComponent photoId={photo.id} />
                    {currentProfilePictureId === photo.id && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};