import { Shield, Brain, Calendar, MessageCircle, Users, Zap, MapPin, Clock, Target, Award, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HamburgerMenu } from "@/components/navigation/HamburgerMenu";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Link } from "react-router-dom";

const Index = () => {
  const todayStats = {
    testsCompleted: 3,
    scheduledDates: 1,
    personalityMatches: 8
  };

  const quickActions = [
    {
      icon: Brain,
      title: "Take Personality Test",
      description: "Discover your true self",
      path: "/tests",
      gradient: "from-primary to-accent",
      count: "Free feedback",
      mask: true
    },
    {
      icon: Eye,
      title: "Browse Matches",
      description: "See personality traits",
      path: "/discover",
      gradient: "from-accent to-primary-glow",
      count: "50+ nearby",
      mask: false
    },
    {
      icon: Calendar,
      title: "Schedule Date",
      description: "6-min video calls",
      path: "/calendar",
      gradient: "from-primary-glow to-primary",
      count: `${todayStats.scheduledDates} pending`,
      mask: true
    }
  ];

  const recentTests = [
    { name: "INTJ Personality", completed: true, public: false },
    { name: "Hobbies & Interests", completed: true, public: true },
    { name: "Deal Breakers", completed: false, public: false },
    { name: "Politics & Values", completed: false, public: false }
  ];

  const quirkyMessages = [
    "Looks are temporary, personality is forever ✨",
    "Behind every mask is someone worth knowing 🎭",
    "Deep conversations > small talk 💭",
    "Your vibe attracts your tribe 🌟"
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-card">
        <HamburgerMenu />
        
        <div className="text-center">
          <h1 className="bg-gradient-text bg-clip-text text-transparent text-xl font-bold">Masq</h1>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Shield className="h-3 w-3" />
            <span>Authentic connections</span>
          </div>
        </div>

        <Button size="icon" variant="ghost" className="text-foreground hover:bg-secondary">
          <Zap className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Quirky Message */}
        <Card className="p-4 bg-gradient-card border-primary/20">
          <div className="text-center">
            <p className="text-sm bg-gradient-text bg-clip-text text-transparent font-medium">
              {quirkyMessages[Math.floor(Math.random() * quirkyMessages.length)]}
            </p>
          </div>
        </Card>

        {/* Today's Progress */}
        <Card className="p-6 bg-gradient-card border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold bg-gradient-text bg-clip-text text-transparent">Today's Progress</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">{todayStats.testsCompleted}</div>
              <div className="text-xs text-muted-foreground">Tests Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">{todayStats.scheduledDates}</div>
              <div className="text-xs text-muted-foreground">Dates Booked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-glow mb-1">{todayStats.personalityMatches}</div>
              <div className="text-xs text-muted-foreground">New Matches</div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold bg-gradient-text bg-clip-text text-transparent mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <Card className="p-4 hover:shadow-glow-mystery transition-all duration-300 bg-gradient-card border-primary/20 hover:border-primary/40">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-full flex items-center justify-center shadow-glow-soft relative`}>
                      <action.icon className="h-6 w-6 text-white" />
                      {action.mask && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                          <Shield className="h-2 w-2 text-primary" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">{action.count}</div>
                      {action.mask ? (
                        <EyeOff className="h-4 w-4 text-accent ml-auto" />
                      ) : (
                        <Eye className="h-4 w-4 text-primary ml-auto" />
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Tests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold bg-gradient-text bg-clip-text text-transparent">Recent Tests</h2>
            <Link to="/tests">
              <Button variant="masq" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="space-y-2">
            {recentTests.slice(0, 3).map((test, index) => (
              <Card key={index} className="p-3 bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${test.completed ? 'bg-primary' : 'bg-muted'}`}>
                      {test.completed ? (
                        <Award className="h-4 w-4 text-white" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{test.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {test.completed ? 'Completed' : 'In Progress'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {test.public ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-accent" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {test.public ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Anonymous Dating CTA */}
        <Card className="p-6 bg-gradient-mystery text-center">
          <Shield className="h-10 w-10 text-white mx-auto mb-3 animate-float" />
          <h3 className="text-lg font-semibold text-white mb-2">Unmask True Connection</h3>
          <p className="text-white/80 text-sm mb-4">
            "If you give a person a mask, they will speak the truth"
          </p>
          <Button variant="masq" className="bg-white/20 text-white hover:bg-white/30 border-white/30">
            Start Anonymous Dating
          </Button>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
