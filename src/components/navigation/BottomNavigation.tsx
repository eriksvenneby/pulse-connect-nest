import { Heart, Brain, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomNavigation() {
  const location = useLocation();
  
  const navItems = [
    { icon: Heart, label: "Swipe", path: "/", gradient: "from-primary to-accent" },
    { icon: Brain, label: "Tests", path: "/tests", gradient: "from-accent to-primary-glow" },
    { icon: MessageCircle, label: "Messages", path: "/messages", gradient: "from-accent to-primary", locked: true },
    { icon: User, label: "Profile", path: "/profile", gradient: "from-primary to-accent" }
  ];

  // Check if user has unlocked messaging (simulated - could be from context/state)
  const hasExtendedDate = true; // This would come from user's date history

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-white/20 shadow-lg">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const isLocked = item.locked && !hasExtendedDate;
          return (
            <Link
              key={item.path}
              to={isLocked ? "#" : item.path}
              className="flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-300 group hover:scale-105"
              onClick={(e) => isLocked && e.preventDefault()}
            >
              <div className={`
                p-2 rounded-full transition-all duration-300 relative
                ${active 
                  ? `bg-gradient-to-br ${item.gradient} shadow-glow` 
                  : isLocked
                  ? 'bg-muted/30'
                  : 'bg-muted/50 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-accent/20'
                }
              `}>
                <item.icon className={`
                  h-4 w-4 transition-colors duration-300
                  ${active 
                    ? 'text-white' 
                    : isLocked 
                    ? 'text-muted-foreground/50' 
                    : 'text-muted-foreground group-hover:text-primary'
                  }
                `} />
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full animate-pulse-glow" />
                )}
                {isLocked && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🔒</span>
                  </div>
                )}
              </div>
              <span className={`
                text-xs font-medium mt-1 transition-colors duration-300
                ${active 
                  ? 'text-primary' 
                  : isLocked 
                  ? 'text-muted-foreground/50' 
                  : 'text-muted-foreground group-hover:text-primary'
                }
              `}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}