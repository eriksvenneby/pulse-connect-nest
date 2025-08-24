import { BarChart3, Clock, MessageCircle, Heart, Users, Trophy, Target, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";

export default function Stats() {
  const stats = [
    { icon: MessageCircle, label: "Conversations Held", value: "23", color: "text-blue-400" },
    { icon: Heart, label: "Unmasks", value: "8", color: "text-pink-400" },
    { icon: Target, label: "Questions Asked", value: "127", color: "text-purple-400" },
    { icon: Clock, label: "Avg Call Time", value: "12m 34s", color: "text-green-400" },
    { icon: BarChart3, label: "Questions/Call", value: "5.2", color: "text-orange-400" },
    { icon: Timer, label: "Questions/Minute", value: "0.4", color: "text-cyan-400" },
    { icon: Users, label: "Avg Talk Time", value: "8m 12s", color: "text-indigo-400" },
    { icon: Trophy, label: "Talk Time %", value: "67%", color: "text-yellow-400" },
  ];

  const insights = [
    {
      title: "Communication Style",
      description: "You ask thoughtful questions and listen actively. Your talk time ratio shows great balance.",
      score: 85
    },
    {
      title: "Engagement Level", 
      description: "High question rate indicates genuine interest in getting to know your matches.",
      score: 92
    },
    {
      title: "Connection Success",
      description: "Above average unmask rate suggests you're building meaningful connections.",
      score: 78
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-soft pb-20 pt-6">
      <div className="container max-w-md mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Stats</h1>
          <p className="text-muted-foreground">Track your dating journey progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 bg-white/80 backdrop-blur-sm border-white/20">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-primary/10`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Insights */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Dating Insights</h2>
          {insights.map((insight, index) => (
            <Card key={index} className="p-4 bg-white/80 backdrop-blur-sm border-white/20">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-foreground">{insight.title}</h3>
                <span className="text-sm font-bold text-primary">{insight.score}%</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${insight.score}%` }}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Weekly Progress */}
        <Card className="p-4 mt-6 bg-gradient-primary text-center">
          <Trophy className="h-8 w-8 text-white mx-auto mb-2" />
          <h3 className="font-semibold text-white mb-1">This Week's Progress</h3>
          <p className="text-white/80 text-sm mb-3">
            You're in the top 15% of active users!
          </p>
          <div className="flex justify-center gap-4 text-white/90 text-sm">
            <span>3 calls • 18 questions • 2 unmasks</span>
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}