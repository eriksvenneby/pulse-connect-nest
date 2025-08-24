import { Camera, Edit3, Settings, Heart, MapPin, Briefcase, GraduationCap, Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";

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
                variant="mystery" 
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