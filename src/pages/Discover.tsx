import { Heart, X, Star, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Discover() {
  return (
    <div className="min-h-screen bg-gradient-soft pb-20 pt-6">
      <div className="container max-w-md mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Discover</h1>
          <p className="text-muted-foreground">Find your perfect match</p>
        </div>

        <div className="relative h-[600px] flex items-center justify-center">
          <Card className="w-full max-w-sm bg-white rounded-3xl shadow-glow overflow-hidden">
            <div className="h-96 bg-gradient-primary relative">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">Online</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h2 className="text-white text-2xl font-bold mb-1">Emma, 25</h2>
                <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>2 miles away</span>
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <Briefcase className="h-4 w-4" />
                  <span>Graphic Designer</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-foreground text-sm leading-relaxed mb-4">
                Love exploring new coffee shops, hiking trails, and art galleries. Looking for someone who shares my passion for adventure and creativity! 🎨☕️
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">Art</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">Coffee</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">Hiking</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-center items-center gap-6 mt-6">
          <Button 
            size="icon" 
            variant="outline" 
            className="h-14 w-14 rounded-full border-destructive/30 hover:bg-destructive hover:text-white transition-all duration-300"
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
            variant="hero" 
            className="h-16 w-16 rounded-full animate-pulse-glow"
          >
            <Heart className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </div>
  );
}