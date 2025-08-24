import { Heart, X, Star, Shield, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HamburgerMenu } from "@/components/navigation/HamburgerMenu";
import { TokenDisplay } from "@/components/navigation/TokenDisplay";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { calculateAge } from "@/utils/ageCalculator";
import { useMatching } from "@/hooks/useMatching";
import { useUserPhotos } from "@/hooks/useUserPhotos";
import { useState, useMemo, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const { currentMatch, hasMoreMatches, loading, isSwipeProcessing, handleSwipe, handleUndo } = useMatching();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Memoize photos array to prevent infinite re-renders
  const matchPhotos = useMemo(() => {
    return currentMatch?.photos || [];
  }, [currentMatch?.photos]);
  
  // Get all photos for the current match
  const { photoUrls, loading: photosLoading } = useUserPhotos(matchPhotos);
  const photos = photoUrls.length > 0 ? photoUrls : [];
  
  // Reset photo index when match changes
  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [currentMatch?.user_id]);
  
  const totalPhotos = photos.length;

  const handleSwipeLeft = () => handleSwipe(false);
  const handleSwipeRight = () => handleSwipe(true);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % totalPhotos);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  if (loading) {
    return <LoadingScreen message="Finding your perfect matches..." />;
  }

  if (!currentMatch || !hasMoreMatches) {
    return (
      <div className="min-h-screen bg-background pb-20 pt-0">
        {/* Header */}  
        <div className="flex items-center justify-between p-4 pt-12 bg-gradient-card">
          <HamburgerMenu />
          
          <div className="text-center">
            <h1 className="bg-gradient-text bg-clip-text text-transparent text-xl font-bold">Masq</h1>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Shield className="h-3 w-3" />
              <span>Personality first</span>
            </div>
          </div>

          <TokenDisplay />
        </div>

        <div className="container max-w-md mx-auto px-4 py-8">
          <Card className="w-full h-96 bg-gradient-card rounded-3xl shadow-glow-mystery overflow-hidden border-primary/20 flex items-center justify-center">
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">No more matches!</h2>
              <p className="text-muted-foreground mb-4">Check back later for new people to connect with.</p>
              <Button onClick={() => window.location.reload()} className="bg-gradient-primary text-white">
                Refresh
              </Button>
            </div>
          </Card>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  // Calculate age from birthday
  const age = currentMatch.birthday ? calculateAge(currentMatch.birthday) : currentMatch.age || 'Unknown';

  return (
    <div className="min-h-screen bg-background pb-20 pt-0">
      {/* Header */}  
      <div className="flex items-center justify-between p-4 pt-12 bg-gradient-card">
        <HamburgerMenu />
        
        <div className="text-center">
          <h1 className="bg-gradient-text bg-clip-text text-transparent text-xl font-bold">Masq</h1>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Shield className="h-3 w-3" />
            <span>Personality first</span>
          </div>
        </div>

        <TokenDisplay />
      </div>

      <div className="container max-w-md mx-auto px-4">
        {/* Match Card */}
        <div className="relative h-[calc(100vh-180px)] flex items-center justify-center mb-6">
          <Card className="w-full h-full bg-gradient-card rounded-3xl shadow-glow-mystery overflow-hidden border-primary/20">
            {/* Photo Section */}
            <div className="h-[70%] relative overflow-hidden">
              {photos.length > 0 ? (
                <img 
                  src={photos[currentPhotoIndex]} 
                  alt={`${currentMatch.full_name || 'User'} photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-card flex items-center justify-center">
                  <p className="text-muted-foreground">No photos available</p>
                </div>
              )}
              
              {/* Photo Navigation Overlay - only show if there are photos */}
              {photos.length > 0 && (
                <>
                  <div className="absolute inset-0 flex">
                    {photos.map((_, index) => (
                      <div 
                        key={index}
                        className="flex-1 cursor-pointer"
                        onClick={index < currentPhotoIndex ? prevPhoto : nextPhoto}
                      />
                    ))}
                  </div>
                  
                  {/* Photo Indicators - only show if more than 1 photo */}
                  {photos.length > 1 && (
                    <div className="absolute top-3 left-3 right-3 flex gap-1">
                      {photos.map((_, index) => (
                        <div 
                          key={index}
                          className={`flex-1 h-1 rounded-full transition-colors ${
                            index === currentPhotoIndex ? 'bg-white' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Distance/Location */}
              {(currentMatch.distance_km || currentMatch.location_name) && (
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm font-medium">
                    {currentMatch.distance_km ? `${Math.round(currentMatch.distance_km)} km away` : currentMatch.location_name}
                  </span>
                </div>
              )}
              
              {/* Basic Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pb-2">
                <h2 className="text-white text-2xl font-bold mb-1">
                  {currentMatch.full_name || 'Anonymous'}, {age}
                </h2>
                
                {/* Heart and X buttons */}
                <div className="flex justify-between items-center mt-4">
                  <Button 
                    size="icon" 
                    className="h-14 w-14 rounded-full bg-white/90 hover:bg-white shadow-lg relative"
                    onClick={handleSwipeLeft}
                    disabled={isSwipeProcessing}
                  >
                    <div className="h-10 w-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <X className="h-8 w-8 text-white" />
                    </div>
                  </Button>
                  <Button 
                    size="icon" 
                    className="h-14 w-14 rounded-full bg-white/90 hover:bg-white shadow-lg relative"
                    onClick={handleSwipeRight}
                    disabled={isSwipeProcessing}
                  >
                    <div className="h-10 w-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="h-8 w-8 text-white fill-white" />
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-4 h-[30%] overflow-y-auto pt-6">
              {/* Job & Education */}
              {(currentMatch.occupation || currentMatch.education) && (
                <div className="mb-3">
                  {currentMatch.occupation && (
                    <div className="text-sm font-medium text-foreground">{currentMatch.occupation}</div>
                  )}
                  {currentMatch.education && (
                    <div className="text-xs text-muted-foreground">{currentMatch.education}</div>
                  )}
                </div>
              )}

              {/* Bio */}
              {currentMatch.bio && (
                <div className="mb-3">
                  <div className="text-sm text-foreground">{currentMatch.bio}</div>
                </div>
              )}

              {/* Personality Match */}
              <div className="mb-3 p-2 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">Personality Match</span>
                  <span className="text-primary font-bold text-sm">{currentMatch.personality_match}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div 
                    className="bg-gradient-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${currentMatch.personality_match}%` }}
                  ></div>
                </div>
              </div>

              {/* Interests */}
              {currentMatch.interests && currentMatch.interests.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-3">
                  {currentMatch.interests.map((interest, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center">
          <Button 
            size="icon" 
            variant="outline" 
            className="h-12 w-12 rounded-full border-accent/30 hover:bg-accent hover:text-white transition-all duration-300"
            onClick={handleUndo}
            disabled={isSwipeProcessing}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
