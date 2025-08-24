import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LogoCustomizationContextType {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  logoColors: string[];
}

const logoColors = [
  '#FF69B4', '#FF1493', '#DC143C', '#B22222', '#8B0000', '#FF0000',
  '#FF4500', '#FF8C00', '#FFA500', '#FFD700', '#FFFF00', '#ADFF2F',
  '#32CD32', '#00FF00', '#00CED1', '#00BFFF', '#0000FF', '#4169E1',
  '#8A2BE2', '#9400D3', '#9932CC', '#BA55D3', '#DA70D6', '#DDA0DD',
  '#EE82EE', '#FF00FF', '#FF1493', '#FF69B4', '#FFC0CB', '#F0E68C',
  '#D2B48C', '#DEB887', '#F5DEB3', '#FFEFD5', '#FFE4E1', '#FFFFFF',
];

const LogoCustomizationContext = createContext<LogoCustomizationContextType | undefined>(undefined);

export const LogoCustomizationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedColor, setSelectedColor] = useState<string>('#9932CC'); // Default purple

  useEffect(() => {
    const savedColor = localStorage.getItem('masq-logo-color');
    if (savedColor && logoColors.includes(savedColor)) {
      setSelectedColor(savedColor);
    }
  }, []);

  const handleSetSelectedColor = (color: string) => {
    setSelectedColor(color);
    localStorage.setItem('masq-logo-color', color);
  };

  return (
    <LogoCustomizationContext.Provider value={{
      selectedColor,
      setSelectedColor: handleSetSelectedColor,
      logoColors
    }}>
      {children}
    </LogoCustomizationContext.Provider>
  );
};

export const useLogoCustomization = () => {
  const context = useContext(LogoCustomizationContext);
  if (context === undefined) {
    throw new Error('useLogoCustomization must be used within a LogoCustomizationProvider');
  }
  return context;
};