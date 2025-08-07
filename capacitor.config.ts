import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.13345d7c303e482cb7e06b47288fc946',
  appName: 'pulse-connect-nest',
  webDir: 'dist',
  server: {
    url: "https://13345d7c-303e-482c-b7e0-6b47288fc946.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: '#ec4899',
      showSpinner: false
    }
  }
};

export default config;