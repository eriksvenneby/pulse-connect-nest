import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Calls from "./pages/Calls";
import Discover from "./pages/Discover";
import Calendar from "./pages/Calendar";
import Stats from "./pages/Stats";
import Achievements from "./pages/Achievements";
import Tests from "./pages/Tests";
import TakeTest from "./pages/TakeTest";
import Preferences from "./pages/Preferences";
import ProfileSetup from "./pages/ProfileSetup";
import NotFound from "./pages/NotFound";
import LogoCustomization from "./pages/LogoCustomization";
import { AuthProvider } from "./hooks/useAuth";
import { LogoCustomizationProvider } from "./hooks/useLogoCustomization";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/edit-profile",
    element: <EditProfile />,
  },
  {
    path: "/matches",
    element: <Matches />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  {
    path: "/calls",
    element: <Calls />,
  },
  {
    path: "/discover",
    element: <Discover />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
  },
  {
    path: "/stats",
    element: <Stats />,
  },
  {
    path: "/achievements",
    element: <Achievements />,
  },
  {
    path: "/tests",
    element: <Tests />,
  },
  {
    path: "/test/:id",
    element: <TakeTest />,
  },
  {
    path: "/preferences",
    element: <Preferences />,
  },
  {
    path: "/profile-setup",
    element: <ProfileSetup />,
  },
  {
    path: "/logo-customization",
    element: <LogoCustomization />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LogoCustomizationProvider>
          <RouterProvider router={router} />
          <Toaster />
        </LogoCustomizationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
