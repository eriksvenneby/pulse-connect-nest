import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
  });

  useEffect(() => {
    if (user) {
      loadProfile();
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
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
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

      toast.success('Profile updated successfully!');
      navigate('/profile');
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

  const availableInterests = [
    "Photography", "Travel", "Art", "Coffee", "Hiking", "Music", 
    "Cooking", "Yoga", "Reading", "Movies", "Gaming", "Dancing",
    "Sports", "Technology", "Fashion", "Fitness", "Nature", "Pets"
  ];

  if (loading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-soft pb-20 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 bg-gradient-card">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <div className="text-center">
          <h1 className="bg-gradient-text bg-clip-text text-transparent text-xl font-bold">Edit Profile</h1>
        </div>

        <Button 
          variant="mystery" 
          size="sm"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="container max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* Basic Info */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
          <h3 className="font-semibold text-foreground mb-4">Basic Information</h3>
          
          <div className="space-y-4">
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

        {/* Interests */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
          <h3 className="font-semibold text-foreground mb-4">Interests</h3>
          
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

        {/* Dating Preferences */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
          <h3 className="font-semibold text-foreground mb-4">Dating Preferences</h3>
          
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

      </div>
    </div>
  );
}