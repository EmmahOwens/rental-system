
import { useNavigate } from "react-router-dom";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <NeumorphicCard className="p-8 max-w-md w-full text-center">
        <Home className="h-12 w-12 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button 
          onClick={() => navigate("/")}
          className="neumorph-button flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </NeumorphicCard>
    </div>
  );
}
