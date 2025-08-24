import { Heart, X, Star, Shield, Eye, EyeOff, RotateCcw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HamburgerMenu } from "@/components/navigation/HamburgerMenu";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { useState } from "react";

const Index = () => {
  const [currentMatch, setCurrentMatch] = useState(0);
  
  const matches = [
    {
      id: 1,
      name: "Alex",
      age: 26,
      photos: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face"
      ],
      distance: "3 miles away",
      bio: "INTJ who loves deep conversations about philosophy and psychology. Looking for genuine connections beyond the surface.",
      height: "5'10\"",
      zodiac: "Virgo",
      education: "NYU Graduate",
      job: "Product Designer",
      lookingFor: "Long-term relationship",
      traits: ["Intellectual", "Ambitious", "Creative", "Authentic"],
      personalityMatch: 87,
      completedTests: 5,
      isOnline: true,
      prompts: [
        { question: "My ideal Sunday", answer: "Coffee shop, good book, deep conversation with someone special" },
        { question: "I'm looking for", answer: "Someone who values authenticity and isn't afraid of vulnerability" }
      ]
    },
    {
      id: 2,
      name: "Jordan",
      age: 24,
      photos: [
        "https://images.unsplash.com/photo-1494790108755-2616b612b589?w=400&h=600&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face"
      ],
      distance: "1 mile away",
      bio: "ENFP seeking adventure and meaningful connections. Love hiking, art galleries, and philosophical debates over coffee.",
      height: "5'6\"",
      zodiac: "Gemini",
      education: "Columbia University",
      job: "Art Therapist",
      lookingFor: "Something real",
      traits: ["Adventurous", "Empathetic", "Artistic", "Open-minded"],
      personalityMatch: 92,
      completedTests: 7,
      isOnline: false,
      prompts: [
        { question: "A life goal of mine", answer: "To help people heal through creativity and authentic expression" },
        { question: "I value", answer: "Deep conversations that make you question everything you thought you knew" }
      ]
    },
    {
      id: 3,
      name: "Casey",
      age: 28,
      photos: [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&crop=face"
      ],
      distance: "5 miles away",
      bio: "ISFJ passionate about psychology and human behavior. Believes in the power of vulnerability and authentic connections.",
      height: "6'1\"",
      zodiac: "Cancer",
      education: "Harvard PhD",
      job: "Clinical Psychologist",
      lookingFor: "Life partner",
      traits: ["Caring", "Thoughtful", "Loyal", "Deep"],
      personalityMatch: 84,
      completedTests: 6,
      isOnline: true,
      prompts: [
        { question: "My love language", answer: "Quality time and deep, meaningful conversations" },
        { question: "I geek out on", answer: "Understanding what makes people tick and helping them grow" }
      ]
    }
  ];

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  const currentPerson = matches[currentMatch];
  const totalPhotos = currentPerson.photos.length;

  const handleSwipe = (direction: 'left' | 'right') => {
    setCurrentMatch((prev) => (prev + 1) % matches.length);
    setCurrentPhotoIndex(0); // Reset photo index for new person
  };

  const handleUndo = () => {
    setCurrentMatch((prev) => (prev - 1 + matches.length) % matches.length);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % totalPhotos);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-card">
        <HamburgerMenu />
        
        <div className="text-center">
          <h1 className="bg-gradient-text bg-clip-text text-transparent text-xl font-bold">Masq</h1>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Shield className="h-3 w-3" />
            <span>Personality first</span>
          </div>
        </div>

        <Button size="icon" variant="ghost" className="text-foreground hover:bg-secondary">
          <RotateCcw className="h-5 w-5" onClick={handleUndo} />
        </Button>
      </div>

      <div className="container max-w-md mx-auto px-4">
        {/* Match Card */}
        <div className="relative h-[600px] flex items-center justify-center mb-6">
          <Card className="w-full max-w-sm bg-gradient-card rounded-3xl shadow-glow-mystery overflow-hidden border-primary/20">
            {/* Photo Section */}
            <div className="h-96 relative overflow-hidden">
              <img 
                src={currentPerson.photos[currentPhotoIndex]} 
                alt={`${currentPerson.name} photo ${currentPhotoIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Photo Navigation Overlay */}
              <div className="absolute inset-0 flex">
                {currentPerson.photos.map((_, index) => (
                  <div 
                    key={index}
                    className="flex-1 cursor-pointer"
                    onClick={index < currentPhotoIndex ? prevPhoto : nextPhoto}
                  />
                ))}
              </div>
              
              {/* Photo Indicators */}
              <div className="absolute top-3 left-3 right-3 flex gap-1">
                {currentPerson.photos.map((_, index) => (
                  <div 
                    key={index}
                    className={`flex-1 h-1 rounded-full transition-colors ${
                      index === currentPhotoIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Heart and X buttons */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Button 
                  size="icon" 
                  className="h-12 w-12 rounded-full bg-white/90 hover:bg-white border-2 border-red-500 shadow-lg"
                  onClick={() => handleSwipe('left')}
                >
                  <X className="h-6 w-6 text-red-500" />
                </Button>
                <Button 
                  size="icon" 
                  className="h-12 w-12 rounded-full bg-white/90 hover:bg-white border-2 border-green-500 shadow-lg"
                  onClick={() => handleSwipe('right')}
                >
                  <Heart className="h-6 w-6 text-green-500" />
                </Button>
              </div>

              {/* Online Status */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">
                  {currentPerson.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              {/* Basic Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h2 className="text-white text-2xl font-bold mb-1">{currentPerson.name}, {currentPerson.age}</h2>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span>{currentPerson.distance}</span>
                  <span>•</span>
                  <span>{currentPerson.height}</span>
                  <span>•</span>
                  <span>{currentPerson.zodiac}</span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-4 max-h-[200px] overflow-y-auto">
              {/* Job & Education */}
              <div className="mb-3">
                <div className="text-sm font-medium text-foreground">{currentPerson.job}</div>
                <div className="text-xs text-muted-foreground">{currentPerson.education}</div>
              </div>

              {/* Looking For */}
              <div className="mb-3">
                <span className="text-xs text-muted-foreground">Looking for: </span>
                <span className="text-sm text-foreground">{currentPerson.lookingFor}</span>
              </div>

              {/* Personality Match */}
              <div className="mb-3 p-2 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">Personality Match</span>
                  <span className="text-primary font-bold text-sm">{currentPerson.personalityMatch}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div 
                    className="bg-gradient-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${currentPerson.personalityMatch}%` }}
                  ></div>
                </div>
              </div>

              {/* Personality Traits */}
              <div className="flex gap-1 flex-wrap mb-3">
                {currentPerson.traits.map((trait, index) => (
                  <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {trait}
                  </span>
                ))}
              </div>

              {/* Prompts */}
              <div className="space-y-2 mb-3">
                {currentPerson.prompts.map((prompt, index) => (
                  <div key={index} className="bg-secondary/50 rounded-lg p-2">
                    <div className="text-xs font-medium text-primary mb-1">{prompt.question}</div>
                    <div className="text-xs text-foreground">{prompt.answer}</div>
                  </div>
                ))}
              </div>

              {/* Test Status */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{currentPerson.completedTests} personality tests completed</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-4">
          <Button 
            size="icon" 
            variant="outline" 
            className="h-12 w-12 rounded-full border-accent/30 hover:bg-accent hover:text-white transition-all duration-300"
          >
            <Star className="h-5 w-5" />
          </Button>

          <Button 
            variant="mystery" 
            className="px-6 py-3 rounded-full flex items-center gap-2 animate-pulse-glow"
            onClick={() => {/* TODO: Implement chat now functionality */}}
          >
            <MessageCircle className="h-5 w-5" />
            Chat Now
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
