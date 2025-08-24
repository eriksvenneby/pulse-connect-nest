import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { HamburgerMenu } from "@/components/navigation/HamburgerMenu";
import { TokenDisplay } from "@/components/navigation/TokenDisplay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Save, Loader2 } from "lucide-react";

const Preferences = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const { toast } = useToast();

  const [preferences, setPreferences] = useState({
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
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('dating_preference, age_range_min, age_range_max, max_distance, latitude, longitude, location_name, interests')
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;

      if (data) {
        setPreferences({
          dating_preference: data.dating_preference || "both",
          age_range_min: data.age_range_min || 22,
          age_range_max: data.age_range_max || 35,
          max_distance: data.max_distance || 25,
          latitude: data.latitude,
          longitude: data.longitude,
          location_name: data.location_name || "",
          interests: data.interests || []
        });
      }
    } catch (error: any) {
      console.error('Error loading preferences:', error);
      toast({
        variant: "destructive",
        title: "Error loading preferences",
        description: "Could not load your current preferences.",
      });
    }
  };

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

      setPreferences(prev => ({
        ...prev,
        latitude,
        longitude,
        location_name: locationName
      }));

      toast({
        title: "Location updated!",
        description: `Set to ${locationName}`,
      });
    } catch (error) {
      console.error('Location error:', error);
      toast({
        variant: "destructive",
        title: "Location detection failed",
        description: "Please try again or enter your location manually.",
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(preferences)
        .eq('user_id', user!.id);

      if (error) throw error;

      toast({
        title: "Preferences saved!",
        description: "Your dating preferences have been updated.",
      });
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast({
        variant: "destructive",
        title: "Error saving preferences",
        description: error.message || "Could not save your preferences.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted pb-20 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 bg-gradient-card">
        <HamburgerMenu />
        
        <div className="text-center">
          <h1 className="bg-gradient-text bg-clip-text text-transparent text-xl font-bold">Preferences</h1>
          <div className="text-muted-foreground text-sm">Customize your dating experience</div>
        </div>

        <TokenDisplay />
      </div>

      <div className="container max-w-md mx-auto px-4 pt-6">

        <div className="space-y-6">
          {/* Dating Preferences */}
          <Card className="p-6">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-lg">Dating Preferences</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="space-y-3">
                <Label>I'm interested in</Label>
                <RadioGroup
                  value={preferences.dating_preference}
                  onValueChange={(value: "men" | "women" | "both") =>
                    setPreferences(prev => ({ ...prev, dating_preference: value }))
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
                <Label>Age Range: {preferences.age_range_min} - {preferences.age_range_max}</Label>
                <div className="px-2">
                  <Slider
                    value={[preferences.age_range_min, preferences.age_range_max]}
                    onValueChange={([min, max]) =>
                      setPreferences(prev => ({
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
                <Label>Maximum Distance: {preferences.max_distance} miles</Label>
                <div className="px-2">
                  <Slider
                    value={[preferences.max_distance]}
                    onValueChange={([distance]) =>
                      setPreferences(prev => ({ ...prev, max_distance: distance }))
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
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Current Location</Label>
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
                  {locationLoading ? "Detecting..." : "Update Location"}
                </Button>
              </div>
              
              <Input
                placeholder="Enter your city"
                value={preferences.location_name}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  location_name: e.target.value
                }))}
              />
            </CardContent>
          </Card>

          {/* Interests */}
          <Card className="p-6">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-lg">Interests</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div className="flex flex-wrap gap-2">
                {predefinedInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={preferences.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {preferences.interests.length}/8 selected
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            onClick={savePreferences} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Preferences
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Preferences;