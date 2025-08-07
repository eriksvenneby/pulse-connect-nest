import { Search, MessageCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Messages() {
  const conversations = [
    {
      id: 1,
      name: "Sarah",
      lastMessage: "Hey! How was your weekend? 😊",
      time: "2m ago",
      unread: 2,
      avatar: "bg-gradient-to-br from-primary to-accent"
    },
    {
      id: 2,
      name: "Maya",
      lastMessage: "That coffee shop was amazing!",
      time: "1h ago",
      unread: 0,
      avatar: "bg-gradient-to-br from-accent to-primary-glow"
    },
    {
      id: 3,
      name: "Jessica",
      lastMessage: "Can't wait for our date tomorrow!",
      time: "3h ago",
      unread: 1,
      avatar: "bg-gradient-to-br from-primary-glow to-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-soft pb-20 pt-6">
      <div className="container max-w-md mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">Connect with your matches</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-10 rounded-full bg-white/80 backdrop-blur-sm border-white/20"
          />
        </div>

        <div className="space-y-3">
          {conversations.map((conversation) => (
            <Card key={conversation.id} className="p-4 hover:shadow-glow-soft transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-white/20">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${conversation.avatar} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-semibold text-lg">
                    {conversation.name[0]}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {conversation.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {conversation.time}
                      </span>
                      {conversation.unread > 0 && (
                        <div className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">Start conversations with your matches!</span>
          </div>
        </div>
      </div>
    </div>
  );
}