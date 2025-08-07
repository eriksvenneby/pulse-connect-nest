import { Camera, Edit3, Settings, Heart, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Profile() {
  const interests = ["Photography", "Travel", "Art", "Coffee", "Hiking", "Music", "Cooking", "Yoga"];
  
  return (
    <div className="min-h-screen bg-gradient-soft pb-20 pt-6">
      <div className="container max-w-md mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Make a great first impression</p>
        </div>

        <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm border-white/20">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <span className="text-white font-bold text-4xl">A</span>
              </div>
              <Button 
                size="icon" 
                variant="hero" 
                className="absolute bottom-2 right-2 h-10 w-10 rounded-full shadow-glow"
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Alex, 28</h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4" />
              <span>San Francisco, CA</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gradient-soft rounded-lg">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Software Engineer</p>
                <p className="text-sm text-muted-foreground">at Google</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gradient-soft rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Computer Science</p>
                <p className="text-sm text-muted-foreground">Stanford University</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-3">About Me</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Passionate about technology and adventure. Love exploring new places, trying different cuisines, and capturing moments through photography. Looking for someone to share life's beautiful experiences with! 📸✨
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
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

        <div className="space-y-3">
          <Button variant="hero" className="w-full" size="lg">
            <Edit3 className="h-5 w-5 mr-2" />
            Edit Profile
          </Button>
          
          <Button variant="romantic" className="w-full" size="lg">
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
          <Button variant="romantic" size="sm">
            Upgrade Now
          </Button>
        </Card>
      </div>
    </div>
  );
}