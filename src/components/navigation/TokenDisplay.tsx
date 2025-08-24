import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MasqueradeIcon } from "@/components/icons/MasqueradeIcon";
import { Plus, CreditCard, Sparkles } from "lucide-react";

export const TokenDisplay = () => {
  const [tokens, setTokens] = useState(150); // Mock token count
  const [isOpen, setIsOpen] = useState(false);

  const tokenPackages = [
    {
      name: "Starter Pack",
      tokens: 100,
      price: "$4.99",
      popular: false
    },
    {
      name: "Popular Pack",
      tokens: 250,
      price: "$9.99",
      bonus: 50,
      popular: true
    },
    {
      name: "Premium Pack",
      tokens: 500,
      price: "$17.99",
      bonus: 150,
      popular: false
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 shadow-glow-soft flex items-center gap-2 px-3"
        >
          <MasqueradeIcon className="h-4 w-4 text-purple-400" />
          <span className="text-white font-medium text-sm">{tokens}</span>
          <Plus className="h-3 w-3 text-white/80" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MasqueradeIcon className="h-5 w-5 text-purple-500" />
            Buy Masq Tokens
          </DialogTitle>
          <DialogDescription>
            Tokens unlock premium features like live calls, super likes, and profile boosts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MasqueradeIcon className="h-6 w-6 text-purple-500" />
              <span className="font-semibold text-lg">{tokens} Tokens</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">Current Balance</p>
          </div>
          
          <div className="space-y-3">
            {tokenPackages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  pkg.popular ? 'border-purple-500/50 bg-gradient-to-r from-purple-500/5 to-pink-500/5' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{pkg.name}</h3>
                        {pkg.popular && (
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MasqueradeIcon className="h-3 w-3 text-purple-400" />
                        <span>{pkg.tokens} tokens</span>
                        {pkg.bonus && (
                          <span className="text-green-500 font-medium">
                            + {pkg.bonus} bonus
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{pkg.price}</div>
                      <Button size="sm" variant={pkg.popular ? "default" : "outline"}>
                        <CreditCard className="h-3 w-3 mr-1" />
                        Buy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            Secure payment powered by Stripe
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};