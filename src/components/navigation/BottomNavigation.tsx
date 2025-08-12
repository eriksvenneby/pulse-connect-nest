import { Heart, Brain, Calendar, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomNavigation() {
  const location = useLocation();
  
  const navItems = [
    { icon: Heart, label: "Swipe", path: "/", gradient: "from-primary to-accent" },
    { icon: Brain, label: "Tests", path: "/tests", gradient: "from-accent to-primary-glow" },
    { icon: Calendar, label: "Calendar", path: "/calendar", gradient: "from-primary-glow to-primary" },
    { icon: User, label: "Profile", path: "/profile", gradient: "from-primary to-accent" }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-white/20 shadow-lg">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 group hover:scale-105"
            >
              <div className={`
                p-3 rounded-full transition-all duration-300 relative
                ${active 
                  ? `bg-gradient-to-br ${item.gradient} shadow-glow` 
                  : 'bg-muted/50 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-accent/20'
                }
              `}>
                <item.icon className={`
                  h-5 w-5 transition-colors duration-300
                  ${active ? 'text-white' : 'text-muted-foreground group-hover:text-primary'}
                `} />
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full animate-pulse-glow" />
                )}
              </div>
              <span className={`
                text-xs font-medium mt-1 transition-colors duration-300
                ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}
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