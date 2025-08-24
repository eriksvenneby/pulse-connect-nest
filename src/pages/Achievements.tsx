import { Trophy, Star, Users, MessageCircle, Heart, Zap, Crown, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";

export default function Achievements() {
  const achievements = [
    {
      id: 1,
      icon: MessageCircle,
      title: "Curious Mind",
      description: "Asked 10 questions",
      progress: 10,
      total: 10,
      completed: true,
      tokens: 50,
      rarity: "Common"
    },
    {
      id: 2,
      icon: Heart,
      title: "Connection Master",
      description: "Got 10 people to unmask",
      progress: 8,
      total: 10,
      completed: false,
      tokens: 100,
      rarity: "Rare"
    },
    {
      id: 3,
      icon: Crown,
      title: "Early Adopter",
      description: "Among first 10k accounts",
      progress: 1,
      total: 1,
      completed: true,
      tokens: 200,
      rarity: "Legendary"
    },
    {
      id: 4,
      icon: Star,
      title: "Conversation Starter",
      description: "Start 5 video calls",
      progress: 3,
      total: 5,
      completed: false,
      tokens: 75,
      rarity: "Uncommon"
    },
    {
      id: 5,
      icon: Users,
      title: "Social Butterfly",
      description: "Match with 25 people",
      progress: 23,
      total: 25,
      completed: false,
      tokens: 150,
      rarity: "Rare"
    },
    {
      id: 6,
      icon: Zap,
      title: "Speed Dater",
      description: "Complete 3 calls under 10 minutes",
      progress: 1,
      total: 3,
      completed: false,
      tokens: 80,
      rarity: "Uncommon"
    },
    {
      id: 7,
      icon: Award,
      title: "Deep Diver",
      description: "Have a 30+ minute call",
      progress: 0,
      total: 1,
      completed: false,
      tokens: 120,
      rarity: "Rare"
    },
    {
      id: 8,
      icon: Trophy,
      title: "Personality Pro",
      description: "Complete all 8 personality tests",
      progress: 5,
      total: 8,
      completed: false,
      tokens: 300,
      rarity: "Epic"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-gray-500";
      case "Uncommon": return "bg-green-500";
      case "Rare": return "bg-blue-500";
      case "Epic": return "bg-purple-500";
      case "Legendary": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const completedAchievements = achievements.filter(a => a.completed);
  const totalTokens = completedAchievements.reduce((sum, a) => sum + a.tokens, 0);

  return (
    <div className="min-h-screen bg-gradient-soft pb-20 pt-6">
      <div className="container max-w-md mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Achievements</h1>
          <p className="text-muted-foreground">Unlock rewards and earn tokens</p>
        </div>

        {/* Token Balance */}
        <Card className="p-4 mb-6 bg-gradient-primary text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-6 w-6 text-white" />
            <span className="text-2xl font-bold text-white">{totalTokens}</span>
          </div>
          <p className="text-white/80 text-sm">Total Tokens Earned</p>
          <p className="text-white/60 text-xs mt-1">
            {completedAchievements.length} of {achievements.length} achievements unlocked
          </p>
        </Card>

        {/* Achievement Grid */}
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`p-4 border-white/20 transition-all duration-300 ${
                achievement.completed 
                  ? 'bg-white/90 backdrop-blur-sm shadow-glow-soft' 
                  : 'bg-white/50 backdrop-blur-sm opacity-75'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  achievement.completed ? 'bg-gradient-primary' : 'bg-gray-300'
                } transition-all duration-300`}>
                  <achievement.icon className={`h-6 w-6 ${
                    achievement.completed ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`font-semibold ${
                        achievement.completed ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={`${getRarityColor(achievement.rarity)} text-white text-xs`}>
                        {achievement.rarity}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs font-medium text-foreground">
                          {achievement.tokens}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!achievement.completed && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.total}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {achievement.completed && (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <Trophy className="h-4 w-4" />
                      <span>Completed!</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}