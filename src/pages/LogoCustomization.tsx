import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogoCustomization } from "@/hooks/useLogoCustomization";
import CustomizableLogo from "@/components/CustomizableLogo";
import { ArrowLeft, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LogoCustomization = () => {
  const { selectedColor, setSelectedColor, logoColors } = useLogoCustomization();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-soft p-4">
      <div className="max-w-md mx-auto pt-8 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Logo Customization</h1>
            <p className="text-muted-foreground text-sm">Choose your perfect color</p>
          </div>
        </div>

        {/* Preview */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-elegant mb-6">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <Palette className="h-5 w-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CustomizableLogo size="lg" />
          </CardContent>
        </Card>

        {/* Color Grid */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-elegant">
          <CardHeader>
            <CardTitle>Choose Color</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-3">
              {logoColors.map((color, index) => (
                <button
                  key={index}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    selectedColor === color 
                      ? 'border-primary shadow-lg scale-110' 
                      : 'border-white/50 hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Selected: <span className="font-medium" style={{ color: selectedColor }}>{selectedColor}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogoCustomization;