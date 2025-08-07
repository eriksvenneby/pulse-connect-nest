import { Heart, Sparkles, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HamburgerMenu } from "@/components/navigation/HamburgerMenu";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const features = [
    {
      icon: Heart,
      title: "Smart Matching",
      description: "Our AI finds your perfect match based on compatibility",
      gradient: "from-primary to-accent"
    },
    {
      icon: Users,
      title: "Real Connections",
      description: "Meet genuine people looking for meaningful relationships",
      gradient: "from-accent to-primary-glow"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your privacy and safety are our top priorities",
      gradient: "from-primary-glow to-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header with hamburger menu */}
      <div className="absolute top-6 left-6 z-10">
        <HamburgerMenu />
      </div>

      {/* Hero Section */}
      <div 
        className="relative min-h-screen flex items-center justify-center bg-gradient-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(236, 72, 153, 0.8), rgba(251, 146, 60, 0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        
        <div className="relative z-10 text-center px-6 max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
              <span className="text-white font-medium">Find Your Perfect Match</span>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Love Starts
              <br />
              <span className="text-white/90">Here</span>
            </h1>
            
            <p className="text-white/90 text-lg leading-relaxed mb-8">
              Connect with amazing people nearby. Start meaningful conversations and find your perfect match today.
            </p>
          </div>

          <div className="space-y-4">
            <Button variant="hero" size="lg" className="w-full max-w-sm text-lg py-6">
              <Heart className="h-6 w-6 mr-2" />
              Start Matching
            </Button>
            
            <Button variant="romantic" size="lg" className="w-full max-w-sm">
              Learn More
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 text-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold">10M+</div>
              <div className="text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2M+</div>
              <div className="text-sm">Matches Daily</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm">Success Stories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose LoveConnect?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're more than just a dating app. We're your partner in finding genuine, lasting connections.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-8 text-center hover:shadow-glow-soft transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/20"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-soft`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 bg-gradient-primary">
        <div className="max-w-lg mx-auto text-center">
          <Heart className="h-16 w-16 text-white mx-auto mb-6 animate-float" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Love?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join millions of people who found their perfect match on LoveConnect.
          </p>
          <Button variant="romantic" size="lg" className="bg-white text-primary hover:bg-white/90">
            Get Started Now
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
