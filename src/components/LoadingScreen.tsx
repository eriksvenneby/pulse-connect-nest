import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import CustomizableLogo from "@/components/CustomizableLogo";

interface LoadingQuote {
  id: string;
  quote: string;
  author: string;
}

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  const [currentQuote, setCurrentQuote] = useState<LoadingQuote | null>(null);

  useEffect(() => {
    const fetchRandomQuote = async () => {
      try {
        const { data, error } = await supabase
          .from('loading_quotes')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        if (data && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setCurrentQuote(data[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
        // Fallback quote if database fails
        setCurrentQuote({
          id: 'fallback',
          quote: 'Man is least himself when he talks in his own person. Give him a mask, and he will tell you the truth.',
          author: 'Oscar Wilde'
        });
      }
    };

    fetchRandomQuote();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-soft p-6">
      {/* Logo */}
      <div className="mb-8 animate-pulse">
        <CustomizableLogo size="lg" className="mx-auto" />
      </div>

      {/* App Name */}
      <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent mb-2">
        Masq
      </h1>

      {/* Loading Message */}
      <p className="text-muted-foreground mb-8">{message}</p>

      {/* Loading Spinner */}
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8"></div>

      {/* Inspirational Quote */}
      {currentQuote && (
        <div className="max-w-md text-center space-y-3 animate-fade-in">
          <blockquote className="text-sm text-foreground/80 italic leading-relaxed">
            "{currentQuote.quote}"
          </blockquote>
          <cite className="text-xs text-muted-foreground font-medium">
            — {currentQuote.author}
          </cite>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;