import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Video } from "lucide-react";

const Calls = () => {
  const handleGoLive = () => {
    // TODO: Implement go live functionality
    console.log("Going live...");
  };

  return (
    <div className="min-h-screen bg-gradient-soft p-4">
      <div className="max-w-md mx-auto pt-16 pb-24">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Live Calls</h1>
          <p className="text-muted-foreground text-center px-4">
            Go live to chat with other live matches
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-elegant">
          <CardContent className="p-6 text-center">
            <div className="mb-6">
              <Phone className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Ready to connect?
              </h2>
              <p className="text-muted-foreground text-sm">
                Start a live session and meet your matches in real-time
              </p>
            </div>
            
            <Button 
              onClick={handleGoLive}
              className="w-full bg-gradient-primary text-white hover:opacity-90 transition-opacity"
              size="lg"
            >
              <Video className="h-5 w-5 mr-2" />
              Go Live
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calls;