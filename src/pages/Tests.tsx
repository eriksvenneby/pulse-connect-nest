import { Brain, Clock, Award, Eye, EyeOff, PlayCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { HamburgerMenu } from "@/components/navigation/HamburgerMenu";
import { Progress } from "@/components/ui/progress";

export default function Tests() {
  const personalityTests = [
    {
      title: "INTJ Personality Type",
      description: "Discover your Myers-Briggs personality type",
      duration: "10 mins",
      completed: true,
      public: false,
      progress: 100,
      category: "Core",
      icon: Brain,
      feedback: "You're an INTJ - The Architect. Strategic, logical, and creative."
    },
    {
      title: "Hobbies & Interests",
      description: "Share what makes you passionate",
      duration: "5 mins",
      completed: true,
      public: true,
      progress: 100,
      category: "Lifestyle",
      icon: PlayCircle,
      feedback: "Great variety! Your interests show depth and curiosity."
    },
    {
      title: "Deal Breakers",
      description: "Define your non-negotiables",
      duration: "7 mins",
      completed: false,
      public: false,
      progress: 30,
      category: "Values",
      icon: Clock,
      feedback: null
    },
    {
      title: "Politics & Values",
      description: "Express your worldview",
      duration: "8 mins",
      completed: false,
      public: false,
      progress: 0,
      category: "Values",
      icon: Clock,
      feedback: null
    },
    {
      title: "Neurodivergence",
      description: "Share your unique perspective",
      duration: "6 mins",
      completed: false,
      public: false,
      progress: 0,
      category: "Identity",
      icon: Clock,
      feedback: null
    },
    {
      title: "Fitness & Health",
      description: "Your approach to wellness",
      duration: "4 mins",
      completed: false,
      public: false,
      progress: 0,
      category: "Lifestyle",
      icon: Clock,
      feedback: null
    }
  ];

  const categories = ["All", "Core", "Values", "Lifestyle", "Identity"];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-card">
        <HamburgerMenu />
        
        <div className="text-center">
          <h1 className="bg-gradient-text bg-clip-text text-transparent text-xl font-bold">Personality Tests</h1>
          <div className="text-muted-foreground text-sm">Discover your authentic self</div>
        </div>

        <Button size="icon" variant="ghost" className="text-foreground hover:bg-secondary">
          <Brain className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Progress Overview */}
        <Card className="p-6 bg-gradient-card border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold bg-gradient-text bg-clip-text text-transparent">Your Progress</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">2</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">1</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-glow mb-1">6</div>
              <div className="text-xs text-muted-foreground">Total Tests</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">Overall Completion</span>
              <span className="text-primary font-medium">38%</span>
            </div>
            <Progress value={38} className="h-2" />
          </div>
        </Card>

        {/* Quick Action */}
        <Card className="p-4 bg-gradient-mystery text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Free Personality Feedback</span>
          </div>
          <p className="text-white/80 text-sm mb-3">
            Complete any test to get personalized insights
          </p>
          <Button variant="masq" className="bg-white/20 text-white hover:bg-white/30 border-white/30">
            Start Next Test
          </Button>
        </Card>

        {/* Tests List */}
        <div>
          <h2 className="text-lg font-semibold bg-gradient-text bg-clip-text text-transparent mb-4">Available Tests</h2>
          
          <div className="space-y-3">
            {personalityTests.map((test, index) => (
              <Card key={index} className="p-4 bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    test.completed ? 'bg-primary' : test.progress > 0 ? 'bg-accent' : 'bg-muted'
                  }`}>
                    {test.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    ) : (
                      <test.icon className="h-6 w-6 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{test.title}</h3>
                      <span className="text-xs text-muted-foreground">{test.duration}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                    
                    {test.progress > 0 && !test.completed && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-accent">{test.progress}%</span>
                        </div>
                        <Progress value={test.progress} className="h-1" />
                      </div>
                    )}
                    
                    {test.feedback && (
                      <div className="bg-primary/10 rounded-lg p-2 mb-2">
                        <p className="text-xs text-primary">{test.feedback}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                          {test.category}
                        </span>
                        {test.public ? (
                          <Eye className="h-3 w-3 text-primary" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-accent" />
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant={test.completed ? "masq" : test.progress > 0 ? "masq" : "outline"}
                        className="text-xs"
                      >
                        {test.completed ? "View Results" : test.progress > 0 ? "Continue" : "Start Test"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}