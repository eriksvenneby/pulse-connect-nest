import { useLogoCustomization } from '@/hooks/useLogoCustomization';

interface CustomizableLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const CustomizableLogo = ({ className = "", size = "md" }: CustomizableLogoProps) => {
  const { selectedColor } = useLogoCustomization();
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img 
        src="/lovable-uploads/eb3b3039-81e6-4411-98cd-08c4bb81eddd.png" 
        alt="Masq Logo" 
        className="w-full h-full object-contain"
        style={{ filter: `hue-rotate(${getHueRotation(selectedColor)}) saturate(1.2)` }}
      />
    </div>
  );
};

// Helper function to convert color to hue rotation
const getHueRotation = (color: string) => {
  const colorMap: { [key: string]: number } = {
    '#FF69B4': 0,    // Hot Pink
    '#FF1493': 10,   // Deep Pink
    '#DC143C': 20,   // Crimson
    '#B22222': 30,   // Fire Brick
    '#8B0000': 40,   // Dark Red
    '#FF0000': 50,   // Red
    '#FF4500': 60,   // Orange Red
    '#FF8C00': 70,   // Dark Orange
    '#FFA500': 80,   // Orange
    '#FFD700': 90,   // Gold
    '#FFFF00': 100,  // Yellow
    '#ADFF2F': 110,  // Green Yellow
    '#32CD32': 120,  // Lime Green
    '#00FF00': 130,  // Green
    '#00CED1': 140,  // Dark Turquoise
    '#00BFFF': 150,  // Deep Sky Blue
    '#0000FF': 160,  // Blue
    '#4169E1': 170,  // Royal Blue
    '#8A2BE2': 180,  // Blue Violet
    '#9400D3': 190,  // Dark Violet
    '#9932CC': 200,  // Dark Orchid
    '#BA55D3': 210,  // Medium Orchid
    '#DA70D6': 220,  // Orchid
    '#DDA0DD': 230,  // Plum
    '#EE82EE': 240,  // Violet
    '#FF00FF': 250,  // Magenta
    '#FFC0CB': 260,  // Pink
    '#F0E68C': 270,  // Khaki
    '#D2B48C': 280,  // Tan
    '#DEB887': 290,  // Burly Wood
    '#F5DEB3': 300,  // Wheat
    '#FFEFD5': 310,  // Papaya Whip
    '#FFE4E1': 320,  // Misty Rose
    '#FFFFFF': 330,  // White
  };
  
  return `${colorMap[color] || 200}deg`;
};

export default CustomizableLogo;