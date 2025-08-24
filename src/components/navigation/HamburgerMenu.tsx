import { useState } from "react";
import { Menu, X, Settings, Heart, Bell, HelpCircle, BarChart3, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: BarChart3, label: "Stats", href: "/stats" },
    { icon: Trophy, label: "Achievements", href: "/achievements" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Heart, label: "Preferences", href: "/preferences" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 shadow-glow-soft"
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-80 bg-gradient-soft border-r-0 backdrop-blur-xl"
      >
        <SheetHeader className="border-b border-white/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <SheetTitle className="text-lg font-semibold text-foreground">
                LoveConnect
              </SheetTitle>
              <p className="text-sm text-muted-foreground">Find your perfect match</p>
            </div>
          </div>
        </SheetHeader>
        
        <nav className="mt-6 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 bg-gradient-primary rounded-lg text-center">
            <h3 className="font-semibold text-white mb-1">Premium</h3>
            <p className="text-xs text-white/80 mb-3">Unlock unlimited likes & more</p>
            <Button variant="masq" size="sm" className="w-full">
              Upgrade Now
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}