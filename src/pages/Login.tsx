import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { House, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login, currentUser, isLoading, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && !isLoading) {
      // Direct to the appropriate dashboard based on role
      if (currentUser.role === 'landlord') {
        navigate("/landlord/dashboard", { replace: true });
      } else {
        navigate("/tenant/dashboard", { replace: true });
      }
    }
  }, [currentUser, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error cases
      let errorMsg = "Please check your credentials and try again";
      
      if (error.message === "Failed to fetch") {
        errorMsg = "Network connection error. Please check your internet connection and try again.";
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
      
      toast({
        title: "Login failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to home page
  const handleBackToHome = () => {
    navigate("/");
  };
  
  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await resetPassword(email);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password",
      });
    } catch (error: any) {
      let errorMsg = "An error occurred. Please try again.";
      
      if (error.message === "Failed to fetch") {
        errorMsg = "Network connection error. Please check your internet connection and try again.";
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      toast({
        title: "Failed to send reset email",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  // Show loading state if auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute top-4 left-4">
        <button 
          onClick={handleBackToHome}
          className="flex items-center gap-2 p-2 rounded-full hover:bg-background/50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Back to Home</span>
        </button>
      </div>
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <House className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Rental Management System</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>
        
        <NeumorphicCard className="p-8">
          {errorMessage && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errorMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neumorph-input w-full"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neumorph-input w-full"
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 disabled:opacity-70 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </NeumorphicCard>
      </div>
    </div>
  );
}
