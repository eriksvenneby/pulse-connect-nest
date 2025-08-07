import { Heart, MessageCircle, Users, Zap, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HamburgerMenu } from "@/components/navigation/HamburgerMenu";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Link } from "react-router-dom";

const Index = () => {
  const todayStats = {
    newLikes: 12,
    newMatches: 3,
    newMessages: 8
  };

  const quickActions = [
    {
      icon: Heart,
      title: "Start Swiping",
      description: "Discover new people",
      path: "/discover",
      gradient: "from-primary to-accent",
      count: "50+ nearby"
    },
    {
      icon: MessageCircle,
      title: "Messages",
      description: "Continue conversations",
      path: "/messages",
      gradient: "from-accent to-primary-glow",
      count: `${todayStats.newMessages} new`
    },
    {
      icon: Users,
      title: "Matches",
      description: "See who likes you",
      path: "/matches",
      gradient: "from-primary-glow to-primary",
      count: `${todayStats.newMatches} new`
    }
  ];

  const nearbyUsers = [
    { name: "Sarah", distance: "0.5 miles", avatar: "bg-gradient-to-br from-primary to-accent" },
    { name: "Maya", distance: "1.2 miles", avatar: "bg-gradient-to-br from-accent to-primary-glow" },
    { name: "Emma", distance: "2.1 miles", avatar: "bg-gradient-to-br from-primary-glow to-primary" },
    { name: "Sophie", distance: "3.4 miles", avatar: "bg-gradient-to-br from-primary to-primary-glow" }
  ];

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-primary">
        <HamburgerMenu />
        
        <div className="text-center">
          <h1 className="text-white text-xl font-bold">LoveConnect</h1>
          <div className="flex items-center gap-1 text-white/80 text-sm">
            <MapPin className="h-3 w-3" />
            <span>San Francisco, CA</span>
          </div>
        </div>

        <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
          <Zap className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Today's Activity */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Today's Activity</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">{todayStats.newLikes}</div>
              <div className="text-xs text-muted-foreground">New Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">{todayStats.newMatches}</div>
              <div className="text-xs text-muted-foreground">New Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">{todayStats.newMessages}</div>
              <div className="text-xs text-muted-foreground">New Messages</div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <Card className="p-4 hover:shadow-glow-soft transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/20">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-full flex items-center justify-center shadow-glow-soft`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">{action.count}</div>
                      <TrendingUp className="h-4 w-4 text-primary ml-auto" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Nearby Users */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">People Nearby</h2>
            <Link to="/discover">
              <Button variant="romantic" size="sm">See All</Button>
            </Link>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {nearbyUsers.map((user, index) => (
              <Card key={index} className="flex-shrink-0 w-24 p-3 text-center hover:shadow-glow-soft transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/20">
                <div className={`w-12 h-12 ${user.avatar} rounded-full flex items-center justify-center mx-auto mb-2 shadow-glow-soft`}>
                  <span className="text-white font-semibold text-sm">{user.name[0]}</span>
                </div>
                <div className="text-xs font-medium text-foreground truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.distance}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Upsell */}
        <Card className="p-6 bg-gradient-primary text-center">
          <Heart className="h-10 w-10 text-white mx-auto mb-3 animate-float" />
          <h3 className="text-lg font-semibold text-white mb-2">Boost Your Profile</h3>
          <p className="text-white/80 text-sm mb-4">
            Get 10x more matches with LoveConnect Premium
          </p>
          <Button variant="romantic" className="bg-white text-primary hover:bg-white/90">
            Try Premium Free
          </Button>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
