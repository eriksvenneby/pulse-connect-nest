import { Heart, X, Star, Shield, Eye, EyeOff, RotateCcw } from "lucide-react";
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
      distance: "3 miles away",
      bio: "INTJ who loves deep conversations about philosophy and psychology. Looking for genuine connections beyond the surface.",
      traits: ["Intellectual", "Ambitious", "Creative", "Authentic"],
      personalityMatch: 87,
      completedTests: 5,
      isOnline: true
    },
    {
      id: 2,
      name: "Jordan",
      age: 24,
      distance: "1 mile away",
      bio: "ENFP seeking adventure and meaningful connections. Love hiking, art galleries, and philosophical debates over coffee.",
      traits: ["Adventurous", "Empathetic", "Artistic", "Open-minded"],
      personalityMatch: 92,
      completedTests: 7,
      isOnline: false
    },
    {
      id: 3,
      name: "Casey",
      age: 28,
      distance: "5 miles away",
      bio: "ISFJ passionate about psychology and human behavior. Believes in the power of vulnerability and authentic connections.",
      traits: ["Caring", "Thoughtful", "Loyal", "Deep"],
      personalityMatch: 84,
      completedTests: 6,
      isOnline: true
    }
  ];

  const currentPerson = matches[currentMatch];

  const handleSwipe = (direction: 'left' | 'right') => {
    // Add swipe animation logic here
    setCurrentMatch((prev) => (prev + 1) % matches.length);
  };

  const handleUndo = () => {
    setCurrentMatch((prev) => (prev - 1 + matches.length) % matches.length);
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
        <div className="relative h-[500px] flex items-center justify-center mb-6">
          <Card className="w-full max-w-sm bg-gradient-card rounded-3xl shadow-glow-mystery overflow-hidden border-primary/20">
            {/* Profile Header */}
            <div className="h-48 bg-gradient-mystery relative flex items-center justify-center">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">
                  {currentPerson.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              {/* Masked Avatar */}
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Shield className="h-12 w-12 text-white animate-float" />
              </div>
              
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-white text-2xl font-bold mb-1">{currentPerson.name}, {currentPerson.age}</h2>
                <p className="text-white/80 text-sm">{currentPerson.distance}</p>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {/* Personality Match */}
              <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Personality Match</span>
                  <span className="text-primary font-bold">{currentPerson.personalityMatch}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentPerson.personalityMatch}%` }}
                  ></div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-foreground text-sm leading-relaxed mb-4">
                {currentPerson.bio}
              </p>

              {/* Personality Traits */}
              <div className="flex gap-2 flex-wrap mb-4">
                {currentPerson.traits.map((trait, index) => (
                  <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                    {trait}
                  </span>
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
        <div className="flex justify-center items-center gap-6">
          <Button 
            size="icon" 
            variant="outline" 
            className="h-14 w-14 rounded-full border-destructive/30 hover:bg-destructive hover:text-white transition-all duration-300"
            onClick={() => handleSwipe('left')}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button 
            size="icon" 
            variant="outline" 
            className="h-12 w-12 rounded-full border-accent/30 hover:bg-accent hover:text-white transition-all duration-300"
          >
            <Star className="h-5 w-5" />
          </Button>

          <Button 
            size="icon" 
            variant="mystery" 
            className="h-16 w-16 rounded-full animate-pulse-glow"
            onClick={() => handleSwipe('right')}
          >
            <Heart className="h-7 w-7" />
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
