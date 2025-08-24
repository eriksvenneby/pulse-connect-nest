import LoadingScreen from "@/components/LoadingScreen";
import { Camera, Edit3, Settings, Heart, MapPin, Briefcase, GraduationCap, Calendar, Clock, Users, Pencil, LogOut, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HamburgerMenu } from "@/components/navigation/HamburgerMenu";
import { TokenDisplay } from "@/components/navigation/TokenDisplay";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { ProfilePictureSelector } from "@/components/ProfilePictureSelector";
import { PhotoManager } from "@/components/PhotoManager";
import { calculateAge, getDisplayAge } from "@/utils/ageCalculator";
import { handleSignOut } from "@/utils/authCleanup";
import { useProfilePhoto } from "@/hooks/useProfilePhoto";
import { useLogoCustomization } from "@/hooks/useLogoCustomization";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { photoUrl: profilePhotoUrl, loading: photoLoading } = useProfilePhoto(profile?.profile_picture_id);
  const { selectedColor, setSelectedColor, logoColors } = useLogoCustomization();

  const [formData, setFormData] = useState({
    bio: '',
    occupation: '',
    education: '',
    location_name: '',
    interests: [] as string[],
    dating_preference: '' as 'men' | 'women' | 'both' | '',
    age_range_min: 18,
    age_range_max: 99,
    max_distance: 50,
    full_name: '',
  });
  
  const availableInterests = [
    "Photography", "Travel", "Art", "Coffee", "Hiking", "Music", 
    "Cooking", "Yoga", "Reading", "Movies", "Gaming", "Dancing",
    "Sports", "Technology", "Fashion", "Fitness", "Nature", "Pets"
  ];
  
  useEffect(() => {
    if (user) {
      loadProfile();
      loadPhotos();
    }
  }, [user]);


  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();
      
      if (error) throw error;
      setProfile(data);
      
      // Initialize form data
      setFormData({
        bio: data.bio || '',
        occupation: data.occupation || '',
        education: data.education || '',
        location_name: data.location_name || '',
        interests: data.interests || [],
        dating_preference: data.dating_preference || '',
        age_range_min: data.age_range_min || 18,
        age_range_max: data.age_range_max || 99,
        max_distance: data.max_distance || 50,
        full_name: data.full_name || '',
      });
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


  const handleProfilePictureChange = (photoId: string) => {
    setProfile(prev => ({ ...prev, profile_picture_id: photoId }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Filter out empty values to avoid database constraints
      const updateData: any = { ...formData };
      if (updateData.dating_preference === '') {
        delete updateData.dating_preference;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user!.id);

      if (error) throw error;

      setProfile(prev => ({ ...prev, ...updateData }));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handlePhotosChange = (newPhotos: any[]) => {
    setPhotos(newPhotos);
    // If there's a main photo and no profile picture is set, set it as profile picture
    if (newPhotos.length > 0 && !profile?.profile_picture_id) {
      handleProfilePictureChange(newPhotos[0].id);
    }
  };

  if (!profile) {
    return <LoadingScreen message="Loading your profile..." />;
  }

  const userAge = profile.birthday ? getDisplayAge(profile.birthday) : '?';
  
  return (
    <div className="min-h-screen bg-gradient-soft pb-20 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 bg-gradient-card">
        <HamburgerMenu />
        
        <div className="text-center">
          <h1 className="bg-gradient-text bg-clip-text text-transparent text-xl font-bold">Masq Profile</h1>
          <div className="text-muted-foreground text-sm">Make a great first impression</div>
        </div>

        <TokenDisplay />
      </div>

      <div className="container max-w-md mx-auto px-4 pt-6">

        <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm border-white/20">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow overflow-hidden">
                {photoLoading ? (
                  <span className="text-white font-bold text-lg">Loading...</span>
                ) : profilePhotoUrl ? (
                  <img 
                    src={profilePhotoUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full"
                  />
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
              {(profile.interests || availableInterests).map((interest: string) => (
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

        {/* Masq Color Selection */}
        <Card className="p-4 mb-6 bg-white/80 backdrop-blur-sm border-white/20">
          <h3 className="font-semibold text-foreground mb-4">Masq Color</h3>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {logoColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color ? 'border-white shadow-lg scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">This color will be used for your Masq logo</p>
        </Card>

        {/* Edit Mode Toggle */}
        {isEditing && (
          <>
            {/* Photo Management */}
            <PhotoManager
              photos={photos}
              onPhotosChange={handlePhotosChange}
              maxPhotos={6}
            />

            {/* Basic Info Editing */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
              <h3 className="font-semibold text-foreground mb-4">Edit Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    placeholder="Your full name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell people what makes you unique..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    placeholder="Your job title"
                    value={formData.occupation}
                    onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    placeholder="Your education background"
                    value={formData.education}
                    onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Your city or location"
                    value={formData.location_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* Interests Editing */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
              <h3 className="font-semibold text-foreground mb-4">Edit Interests</h3>
              
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      formData.interests.includes(interest)
                        ? 'bg-primary text-white'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </Card>

            {/* Dating Preferences Editing */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
              <h3 className="font-semibold text-foreground mb-4">Edit Dating Preferences</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dating_preference">Looking For</Label>
                  <Select 
                    value={formData.dating_preference} 
                    onValueChange={(value: 'men' | 'women' | 'both') => setFormData(prev => ({ ...prev, dating_preference: value as any }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age_min">Min Age</Label>
                    <Input
                      id="age_min"
                      type="number"
                      min="18"
                      max="99"
                      value={formData.age_range_min}
                      onChange={(e) => setFormData(prev => ({ ...prev, age_range_min: parseInt(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age_max">Max Age</Label>
                    <Input
                      id="age_max"
                      type="number"
                      min="18"
                      max="99"
                      value={formData.age_range_max}
                      onChange={(e) => setFormData(prev => ({ ...prev, age_range_max: parseInt(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="max_distance">Maximum Distance (km)</Label>
                  <Input
                    id="max_distance"
                    type="number"
                    min="1"
                    max="500"
                    value={formData.max_distance}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_distance: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>
          </>
        )}

        <div className="space-y-3">
          {isEditing ? (
            <div className="flex gap-3">
              <Button 
                variant="mystery" 
                className="flex-1" 
                size="lg"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                size="lg"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    bio: profile.bio || '',
                    occupation: profile.occupation || '',
                    education: profile.education || '',
                    location_name: profile.location_name || '',
                    interests: profile.interests || [],
                    dating_preference: profile.dating_preference || '',
                    age_range_min: profile.age_range_min || 18,
                    age_range_max: profile.age_range_max || 99,
                    max_distance: profile.max_distance || 50,
                    full_name: profile.full_name || '',
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button 
              variant="mystery" 
              className="w-full" 
              size="lg"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="h-5 w-5 mr-2" />
              Edit Profile & Photos
            </Button>
          )}
          
          <Button variant="masq" className="w-full" size="lg">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-red-500/20 text-red-600 hover:bg-red-500/10 hover:text-red-700" 
            size="lg"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
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