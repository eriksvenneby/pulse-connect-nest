import { Users, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Matches() {
  const matches = [
    { id: 1, name: "Sarah", age: 24, mutual: true, avatar: "bg-gradient-to-br from-primary to-accent" },
    { id: 2, name: "Maya", age: 26, mutual: false, avatar: "bg-gradient-to-br from-accent to-primary-glow" },
    { id: 3, name: "Jessica", age: 23, mutual: true, avatar: "bg-gradient-to-br from-primary-glow to-primary" },
    { id: 4, name: "Emma", age: 25, mutual: false, avatar: "bg-gradient-to-br from-accent to-primary" },
    { id: 5, name: "Sophie", age: 27, mutual: true, avatar: "bg-gradient-to-br from-primary to-primary-glow" },
    { id: 6, name: "Olivia", age: 24, mutual: false, avatar: "bg-gradient-to-br from-primary-glow to-accent" }
  ];

  const mutualMatches = matches.filter(match => match.mutual);
  const regularMatches = matches.filter(match => !match.mutual);

  return (
    <div className="min-h-screen bg-gradient-soft pb-20 pt-6">
      <div className="container max-w-md mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Matches</h1>
          <p className="text-muted-foreground">People who liked you back</p>
        </div>

        {mutualMatches.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Mutual Matches</h2>
              <div className="bg-primary text-white text-xs rounded-full px-2 py-1">
                {mutualMatches.length}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {mutualMatches.map((match) => (
                <Card key={match.id} className="p-4 hover:shadow-glow-soft transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-white/20">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full ${match.avatar} flex items-center justify-center mx-auto mb-3 shadow-glow-soft`}>
                      <span className="text-white font-bold text-xl">
                        {match.name[0]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {match.name}, {match.age}
                    </h3>
                    <Button variant="hero" size="sm" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">All Matches</h2>
            <div className="bg-muted text-muted-foreground text-xs rounded-full px-2 py-1">
              {matches.length}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {regularMatches.map((match) => (
              <Card key={match.id} className="p-4 hover:shadow-glow-soft transition-all duration-300 cursor-pointer bg-white/60 backdrop-blur-sm border-white/20">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full ${match.avatar} flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-white font-bold text-xl">
                      {match.name[0]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {match.name}, {match.age}
                  </h3>
                  <Button variant="romantic" size="sm" className="w-full">
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {matches.length === 0 && (
          <div className="text-center mt-16">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
              <Heart className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No matches yet</h3>
            <p className="text-muted-foreground mb-6">Keep swiping to find your perfect match!</p>
            <Button variant="hero">Start Discovering</Button>
          </div>
        )}
      </div>
    </div>
  );
}