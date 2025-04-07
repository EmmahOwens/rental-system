import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { House, Loader2, LockKeyhole, User, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');
  const [adminCode, setAdminCode] = useState("");
  const [showAdminCode, setShowAdminCode] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleChange = (selectedRole: 'tenant' | 'landlord') => {
    setRole(selectedRole);
    setShowAdminCode(selectedRole === 'landlord');
    console.log("Role changed to:", selectedRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match. Please make sure your passwords match.");
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log("Submitting with role:", role);

    try {
      await signup(email, name, password, role, role === 'landlord' ? adminCode : undefined);
      
      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials",
      });
      
      // Redirect to login page
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Handle the error message
      let errorMsg = "An error occurred during signup";
      
      if (error.message === "Failed to fetch") {
        errorMsg = "Network connection error. Please check your internet connection and try again.";
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
      
      toast({
        title: "Signup failed",
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
          <h1 className="text-3xl font-bold">Join CozyLeases</h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>
        
        <NeumorphicCard className="p-8">
          {errorMessage && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errorMessage}</p>
            </div>
          )}
          
          <div className="flex justify-center mb-6">
            <div className="neumorph p-1 rounded-lg inline-flex">
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${role === 'tenant' ? 'neumorph-inset bg-primary/10 text-primary' : ''}`} 
                onClick={() => handleRoleChange('tenant')}
                type="button"
              >
                <User className="h-4 w-4 inline mr-2" />
                Tenant
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-colors ${role === 'landlord' ? 'neumorph-inset bg-primary/10 text-primary' : ''}`}
                onClick={() => handleRoleChange('landlord')}
                type="button"
              >
                <LockKeyhole className="h-4 w-4 inline mr-2" />
                Landlord
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="neumorph-input w-full"
                placeholder="John Doe"
                required
              />
            </div>
            
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
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neumorph-input w-full"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="neumorph-input w-full"
                placeholder="••••••••"
                required
              />
            </div>

            {showAdminCode && (
              <div className="space-y-2">
                <label htmlFor="admin-code" className="block text-sm font-medium">
                  Admin Registration Code
                </label>
                <input
                  id="admin-code"
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="neumorph-input w-full"
                  placeholder="Enter admin code"
                  required={role === 'landlord'}
                />
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 disabled:opacity-70 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                `Create ${role === 'tenant' ? 'Tenant' : 'Landlord'} Account`
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                type="button"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </NeumorphicCard>
      </div>
    </div>
  );
}
