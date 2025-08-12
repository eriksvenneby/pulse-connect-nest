import { Calendar as CalendarIcon, Clock, Video, Users, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { HamburgerMenu } from "@/components/navigation/HamburgerMenu";

export default function Calendar() {
  const upcomingDates = [
    {
      id: 1,
      time: "Today, 7:30 PM",
      duration: "6 mins",
      match: "Alex",
      status: "confirmed",
      personalityMatch: 87,
      testsShared: 3
    },
    {
      id: 2,
      time: "Tomorrow, 2:00 PM",
      duration: "6 mins",
      match: "Jordan",
      status: "pending",
      personalityMatch: 92,
      testsShared: 5
    }
  ];

  const availableSlots = [
    "Today 6:00 PM", "Today 8:00 PM", "Today 9:30 PM",
    "Tomorrow 1:00 PM", "Tomorrow 3:30 PM", "Tomorrow 7:00 PM"
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-card">
        <HamburgerMenu />
        
        <div className="text-center">
          <h1 className="bg-gradient-text bg-clip-text text-transparent text-xl font-bold">Calendar</h1>
          <div className="text-muted-foreground text-sm">Schedule 6-minute dates</div>
        </div>

        <Button size="icon" variant="ghost" className="text-foreground hover:bg-secondary">
          <CalendarIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Quick Stats */}
        <Card className="p-6 bg-gradient-card border-primary/20">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">2</div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">6</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-glow mb-1">18</div>
              <div className="text-xs text-muted-foreground">Total Dates</div>
            </div>
          </div>
        </Card>

        {/* Upcoming Dates */}
        <div>
          <h2 className="text-lg font-semibold bg-gradient-text bg-clip-text text-transparent mb-4">Upcoming Dates</h2>
          
          <div className="space-y-3">
            {upcomingDates.map((date) => (
              <Card key={date.id} className="p-4 bg-gradient-card border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-mystery rounded-full flex items-center justify-center">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">Date with {date.match}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        date.status === 'confirmed' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-accent/20 text-accent'
                      }`}>
                        {date.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{date.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span>{date.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span>{date.personalityMatch}% match</span>
                      <span>{date.testsShared} tests shared</span>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant={date.status === 'confirmed' ? "masq" : "outline"}
                  >
                    {date.status === 'confirmed' ? 'Join Call' : 'Confirm'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Schedule New Date */}
        <Card className="p-6 bg-gradient-mystery text-center">
          <Users className="h-10 w-10 text-white mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Ready for Another Connection?</h3>
          <p className="text-white/80 text-sm mb-4">
            Schedule instant 6-minute dates with personality matches
          </p>
          <Button variant="masq" className="bg-white/20 text-white hover:bg-white/30 border-white/30">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Date
          </Button>
        </Card>

        {/* Available Time Slots */}
        <div>
          <h2 className="text-lg font-semibold bg-gradient-text bg-clip-text text-transparent mb-4">Available Times</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {availableSlots.map((slot, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="p-3 h-auto text-left justify-start bg-gradient-card border-primary/20 hover:border-primary/40"
              >
                <div>
                  <div className="font-medium text-foreground">{slot.split(' ')[0]}</div>
                  <div className="text-xs text-muted-foreground">{slot.split(' ').slice(1).join(' ')}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <Card className="p-4 bg-gradient-card border-primary/20">
          <h3 className="font-semibold text-foreground mb-3">How Anonymous Dating Works</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>6-minute video calls with personality matches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>See test results 10 minutes before the call</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-glow rounded-full"></div>
              <span>Option to extend and turn on cameras after 15 mins</span>
            </div>
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}