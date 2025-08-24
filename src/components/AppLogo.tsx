import { MasqueradeIcon } from "@/components/icons/MasqueradeIcon";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const AppLogo = ({ size = "md", showText = true, className = "" }: AppLogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <MasqueradeIcon className={sizeClasses[size]} />
      {showText && (
        <span className={`font-bold bg-gradient-text bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          Masq
        </span>
      )}
    </div>
  );
};

export default AppLogo;