
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { House, Loader2, ArrowLeft } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, currentUser, isLoading, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      // Special handling for email verification needed
      if (error.message === "EMAIL_NEEDS_VERIFICATION") {
        toast({
          title: "Email verification required",
          description: "Please verify your email before logging in. We've sent a new verification code.",
        });
        
        // Generate a new OTP
const otp = await fetch('/api/send-verification-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email }),
}).then(res => res.json()).then(data => data.otp);
        
        // Redirect to verification page
        navigate("/verify-email", { 
          state: { email, otp },
          replace: true 
        });
        return;
      }
      
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
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
      toast({
        title: "Failed to send reset email",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state if auth is loading
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="neumorph-button w-full flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
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
