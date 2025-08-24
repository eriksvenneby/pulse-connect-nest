import { Camera, Edit3, Settings, Heart, MapPin, Briefcase, GraduationCap, Calendar, Clock, Users, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HamburgerMenu } from "@/components/navigation/HamburgerMenu";
import { TokenDisplay } from "@/components/navigation/TokenDisplay";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { ProfilePictureSelector } from "@/components/ProfilePictureSelector";
import { calculateAge, getDisplayAge } from "@/utils/ageCalculator";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  
  const interests = ["Photography", "Travel", "Art", "Coffee", "Hiking", "Music", "Cooking", "Yoga"];
  
  useEffect(() => {
    if (user) {
      loadProfile();
      loadPhotos();
    }
  }, [user]);

  useEffect(() => {
    if (profile?.profile_picture_id) {
      loadProfilePhoto();
    }
  }, [profile?.profile_picture_id]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('user_id', user!.id)
        .order('photo_order');
      
      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const loadProfilePhoto = async () => {
    if (!profile?.profile_picture_id) return;
    
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('id', profile.profile_picture_id)
        .single();
      
      if (error) throw error;
      setProfilePhoto(data);
    } catch (error) {
      console.error('Error loading profile photo:', error);
    }
  };

  const handleProfilePictureChange = (photoId: string) => {
    setProfile(prev => ({ ...prev, profile_picture_id: photoId }));
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-soft pb-20 pt-0">
        <div className="flex items-center justify-center h-full">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const userAge = profile.birthday ? getDisplayAge(profile.birthday) : '?';
  
  return (
    <div className="min-h-screen bg-gradient-soft pb-20 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 bg-gradient-card">
        <HamburgerMenu />
        
        <div className="text-center">
          <h1 className="bg-gradient-text bg-clip-text text-transparent text-xl font-bold">Profile</h1>
          <div className="text-muted-foreground text-sm">Make a great first impression</div>
        </div>

        <TokenDisplay />
      </div>

      <div className="container max-w-md mx-auto px-4 pt-6">

        <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm border-white/20">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow overflow-hidden">
                {profilePhoto ? (
                  <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white font-bold text-4xl">
                    {/* Placeholder - replace with actual photo when storage is set up */}
                    {profile.full_name?.charAt(0) || 'A'}
                  </div>
                ) : (
                  <span className="text-white font-bold text-4xl">
                    {profile.full_name?.charAt(0) || 'A'}
                  </span>
                )}
              </div>
              <ProfilePictureSelector
                photos={photos}
                currentProfilePictureId={profile?.profile_picture_id}
                onProfilePictureChange={handleProfilePictureChange}
              >
                <Button 
                  size="icon" 
                  variant="mystery" 
                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-glow"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </ProfilePictureSelector>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">{profile.full_name || 'Your Name'}, {userAge}</h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4" />
              <span>{profile.location_name || 'Your Location'}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gradient-soft rounded-lg">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{profile.occupation || 'Add occupation'}</p>
                <p className="text-sm text-muted-foreground">Your job title</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gradient-soft rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{profile.education || 'Add education'}</p>
                <p className="text-sm text-muted-foreground">Your education</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-3">About Me</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {profile.bio || "Tell people what makes you unique..."}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {(profile.interests || interests).map((interest: string) => (
                <span 
                  key={interest}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Calendar Settings */}
        <Card className="p-4 mb-6 bg-white/80 backdrop-blur-sm border-white/20">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Dating Availability
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Preferred Times</label>
              <div className="grid grid-cols-2 gap-2">
                {["Morning", "Afternoon", "Evening", "Late Night"].map((time) => (
                  <button
                    key={time}
                    className="p-2 text-xs rounded-lg border border-primary/20 hover:bg-primary/10 text-foreground transition-all"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Available Days</label>
              <div className="grid grid-cols-4 gap-1 text-xs">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <button
                    key={day}
                    className="p-2 rounded border border-primary/20 hover:bg-primary/10 text-foreground transition-all"
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gradient-soft rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground text-sm">Call Duration Preference</p>
                <p className="text-xs text-muted-foreground">6-15 minutes ideal</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Button variant="mystery" className="w-full" size="lg">
            <Edit3 className="h-5 w-5 mr-2" />
            Edit Profile
          </Button>
          
          <Button variant="masq" className="w-full" size="lg">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
        </div>

        <Card className="p-4 mt-6 bg-gradient-primary text-center">
          <Heart className="h-8 w-8 text-white mx-auto mb-2 animate-float" />
          <h3 className="font-semibold text-white mb-1">Get More Matches</h3>
          <p className="text-white/80 text-sm mb-3">
            Upgrade to Premium for unlimited likes
          </p>
          <Button variant="masq" size="sm">
            Upgrade Now
          </Button>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}