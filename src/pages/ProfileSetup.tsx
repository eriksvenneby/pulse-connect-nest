import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Camera, Plus, X, MapPin, Heart, Loader2 } from "lucide-react";

const ProfileSetup = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Photo upload state
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // Profile data
  const [profileData, setProfileData] = useState({
    birthday: "",
    bio: "",
    occupation: "",
    education: "",
    dating_preference: "both" as "men" | "women" | "both",
    age_range_min: 22,
    age_range_max: 35,
    max_distance: 25,
    latitude: null as number | null,
    longitude: null as number | null,
    location_name: "",
    interests: [] as string[]
  });

  const predefinedInterests = [
    "Photography", "Travel", "Art", "Coffee", "Hiking", "Music", "Cooking", "Yoga",
    "Reading", "Dancing", "Sports", "Gaming", "Movies", "Fashion", "Fitness", "Animals"
  ];

  useEffect(() => {
    if (user) {
      // Auto-detect location on component mount
      detectLocation();
    }
  }, [user]);

  const detectLocation = async () => {
    setLocationLoading(true);
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation not supported");
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get location name
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      
      const locationName = `${data.city || data.locality || ''}, ${data.principalSubdivision || ''}`.replace(/^, |, $/, '') || 'Unknown Location';

      setProfileData(prev => ({
        ...prev,
        latitude,
        longitude,
        location_name: locationName
      }));

      toast({
        title: "Location detected!",
        description: `Set to ${locationName}`,
      });
    } catch (error) {
      console.error('Location error:', error);
      toast({
        variant: "destructive",
        title: "Location detection failed",
        description: "You can set your location manually later.",
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (photos.length + files.length > 6) {
      toast({
        variant: "destructive",
        title: "Too many photos",
        description: "You can upload a maximum of 6 photos.",
      });
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType || !isValidSize) {
        toast({
          variant: "destructive",
          title: "Invalid file",
          description: `${file.name} must be JPEG, PNG, or WebP and under 5MB.`,
        });
        return false;
      }
      return true;
    });

    const newPhotos = [...photos, ...validFiles];
    setPhotos(newPhotos);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleInterest = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    if (photos.length === 0) {
      toast({
        variant: "destructive",
        title: "Photos required",
        description: "Please upload at least 1 photo.",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload photos to storage
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user!.id}/${Date.now()}_${i}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Insert photo record with file attachment info
        const { error: photoError } = await supabase
          .from('photos')
          .insert({
            user_id: user!.id,
            file_path: fileName,
            file_size: file.size,
            mime_type: file.type,
            photo_order: i + 1,
            status: 'approved'
          });

        if (photoError) throw photoError;
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          profile_complete: true
        })
        .eq('user_id', user!.id);

      if (profileError) throw profileError;

      toast({
        title: "Profile created successfully!",
        description: "Welcome to Masq! Let's find your perfect match.",
      });

      navigate('/');
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast({
        variant: "destructive",
        title: "Error creating profile",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="container max-w-md mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              {step === 1 && "Add Your Photos"}
              {step === 2 && "About You"}
              {step === 3 && "Dating Preferences"}
              {step === 4 && "Location & Interests"}
            </CardTitle>
            <div className="flex justify-center space-x-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Upload 1-6 photos to show your best self (minimum 1 required)
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={preview}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {photos.length < 6 && (
                    <label className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birthday">Date of Birth</Label>
                  <Input
                    id="birthday"
                    type="date"
                    max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    value={profileData.birthday}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      birthday: e.target.value
                    }))}
                    required
                  />
                  {profileData.birthday && (
                    <p className="text-sm text-muted-foreground">
                      Age: {Math.floor((Date.now() - new Date(profileData.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years old
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    placeholder="e.g., Software Engineer"
                    value={profileData.occupation}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      occupation: e.target.value
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    placeholder="e.g., Stanford University"
                    value={profileData.education}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      education: e.target.value
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">About Me</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell people what makes you unique..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      bio: e.target.value
                    }))}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {profileData.bio.length}/500
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>I'm interested in</Label>
                  <RadioGroup
                    value={profileData.dating_preference}
                    onValueChange={(value: "men" | "women" | "both") =>
                      setProfileData(prev => ({ ...prev, dating_preference: value }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="men" id="men" />
                      <Label htmlFor="men">Men</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="women" id="women" />
                      <Label htmlFor="women">Women</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both">Both</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Age Range: {profileData.age_range_min} - {profileData.age_range_max}</Label>
                  <div className="px-2">
                    <Slider
                      value={[profileData.age_range_min, profileData.age_range_max]}
                      onValueChange={([min, max]) =>
                        setProfileData(prev => ({
                          ...prev,
                          age_range_min: min,
                          age_range_max: max
                        }))
                      }
                      min={18}
                      max={80}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>18</span>
                      <span>80</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Maximum Distance: {profileData.max_distance} miles</Label>
                  <div className="px-2">
                    <Slider
                      value={[profileData.max_distance]}
                      onValueChange={([distance]) =>
                        setProfileData(prev => ({ ...prev, max_distance: distance }))
                      }
                      min={1}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 mile</span>
                      <span>100+ miles</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Location</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={detectLocation}
                      disabled={locationLoading}
                    >
                      {locationLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <MapPin className="h-4 w-4 mr-2" />
                      )}
                      {locationLoading ? "Detecting..." : "Detect Location"}
                    </Button>
                  </div>
                  
                  <Input
                    placeholder="Enter your city"
                    value={profileData.location_name}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      location_name: e.target.value
                    }))}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Your Interests (select up to 8)</Label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedInterests.map((interest) => (
                      <Badge
                        key={interest}
                        variant={profileData.interests.includes(interest) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {profileData.interests.length}/8 selected
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              
              <div className="ml-auto">
                {step < 4 ? (
                  <Button onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="min-w-[100px]"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;