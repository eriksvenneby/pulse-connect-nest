import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface PotentialMatch {
  user_id: string;
  full_name: string | null;
  bio: string | null;
  birthday: string | null;
  age: number;
  distance_km: number | null;
  personality_match: number;
  profile_picture_id: string | null;
  occupation: string | null;
  education: string | null;
  interests: string[] | null;
  location_name: string | null;
}

export const useMatching = () => {
  const { user } = useAuth();
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSwipeProcessing, setIsSwipeProcessing] = useState(false);

  // Load potential matches
  const loadMatches = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_potential_matches', {
        requesting_user_id: user.id,
        limit_count: 10
      });

      if (error) throw error;
      setPotentialMatches(data || []);
      setCurrentMatchIndex(0);
    } catch (error) {
      console.error('Error loading matches:', error);
      toast({
        title: "Error loading matches",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle swipe action
  const handleSwipe = async (isLike: boolean) => {
    if (!user || isSwipeProcessing || currentMatchIndex >= potentialMatches.length) return;

    const currentMatch = potentialMatches[currentMatchIndex];
    if (!currentMatch) return;

    try {
      setIsSwipeProcessing(true);
      
      // Record the swipe
      const { error: swipeError } = await supabase
        .from('swipes')
        .insert({
          user_id: user.id,
          target_user_id: currentMatch.user_id,
          is_like: isLike
        });

      if (swipeError) throw swipeError;

      // Move to next match
      const nextIndex = currentMatchIndex + 1;
      setCurrentMatchIndex(nextIndex);

      // Load more matches if we're running low
      if (nextIndex >= potentialMatches.length - 2) {
        loadMatches();
      }

      // Show match notification if it's a like
      if (isLike) {
        // Check if we have a match (this would be handled by the database trigger)
        // For now, just show a positive message
        toast({
          title: "Like sent!",
          description: "We'll let you know if they like you back.",
        });
      }
    } catch (error) {
      console.error('Error processing swipe:', error);
      toast({
        title: "Error processing swipe",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSwipeProcessing(false);
    }
  };

  // Undo last swipe
  const handleUndo = async () => {
    if (currentMatchIndex === 0) return;
    
    const previousIndex = currentMatchIndex - 1;
    const previousMatch = potentialMatches[previousIndex];
    
    if (!previousMatch || !user) return;

    try {
      // Remove the last swipe from database
      const { error } = await supabase
        .from('swipes')
        .delete()
        .eq('user_id', user.id)
        .eq('target_user_id', previousMatch.user_id);

      if (error) throw error;

      setCurrentMatchIndex(previousIndex);
      
      toast({
        title: "Undone",
        description: "Your last action has been undone.",
      });
    } catch (error) {
      console.error('Error undoing swipe:', error);
      toast({
        title: "Error undoing action",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load matches on mount
  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user]);

  const currentMatch = potentialMatches[currentMatchIndex] || null;
  const hasMoreMatches = currentMatchIndex < potentialMatches.length;

  return {
    currentMatch,
    hasMoreMatches,
    loading,
    isSwipeProcessing,
    handleSwipe,
    handleUndo,
    loadMatches
  };
};