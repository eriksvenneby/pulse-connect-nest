import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Tests from "./pages/Tests";
import TakeTest from "./pages/TakeTest";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Stats from "./pages/Stats";
import Achievements from "./pages/Achievements";
import Auth from "./pages/Auth";
import ProfileSetup from "./pages/ProfileSetup";
import Preferences from "./pages/Preferences";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const ProfileRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('profile_complete')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        setProfileComplete(data?.profile_complete || false);
      } catch (error) {
        console.error('Error checking profile:', error);
        setProfileComplete(false);
      } finally {
        setProfileLoading(false);
      }
    };
    
    checkProfile();
  }, [user]);
  
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (profileComplete === false) {
    return <Navigate to="/profile-setup" replace />;
  }
  
  return <>{children}</>;
};

const TestRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [hasCompletedTest, setHasCompletedTest] = useState<boolean | null>(null);
  const [testLoading, setTestLoading] = useState(true);
  
  useEffect(() => {
    const checkTestCompletion = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_test_responses')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        
        if (error) throw error;
        setHasCompletedTest((data?.length || 0) > 0);
      } catch (error) {
        console.error('Error checking test completion:', error);
        setHasCompletedTest(false);
      } finally {
        setTestLoading(false);
      }
    };
    
    checkTestCompletion();
  }, [user]);
  
  if (loading || testLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (hasCompletedTest === false) {
    return <Navigate to="/take-test" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
      <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
      <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
      <Route path="/take-test" element={<ProfileRequiredRoute><TakeTest /></ProfileRequiredRoute>} />
      <Route path="/take-test/:testId" element={<ProfileRequiredRoute><TakeTest /></ProfileRequiredRoute>} />
      <Route path="/" element={<TestRequiredRoute><ProfileRequiredRoute><Index /></ProfileRequiredRoute></TestRequiredRoute>} />
      <Route path="/tests" element={<ProfileRequiredRoute><Tests /></ProfileRequiredRoute>} />
      <Route path="/calendar" element={<TestRequiredRoute><ProfileRequiredRoute><Calendar /></ProfileRequiredRoute></TestRequiredRoute>} />
      <Route path="/messages" element={<TestRequiredRoute><ProfileRequiredRoute><Messages /></ProfileRequiredRoute></TestRequiredRoute>} />
      <Route path="/profile" element={<TestRequiredRoute><ProfileRequiredRoute><Profile /></ProfileRequiredRoute></TestRequiredRoute>} />
      <Route path="/stats" element={<TestRequiredRoute><ProfileRequiredRoute><Stats /></ProfileRequiredRoute></TestRequiredRoute>} />
      <Route path="/achievements" element={<TestRequiredRoute><ProfileRequiredRoute><Achievements /></ProfileRequiredRoute></TestRequiredRoute>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
