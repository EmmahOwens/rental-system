
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { House, Loader2, CheckCircle2 } from "lucide-react";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [redirectUrl, setRedirectUrl] = useState("/dashboard");
  const { verifyEmail, sendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const email = location.state?.email;
  const receivedOtp = location.state?.otp;

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    // Countdown timer for OTP resend
    let timer: number;
    if (countdown > 0) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // verifyEmail returns the user role
      const userRole = await verifyEmail(otp);
      setIsSuccess(true);
      
      toast({
        title: "Email verified",
        description: "Your email has been verified successfully!",
      });
      
<<<<<<< HEAD
      // Determine the appropriate dashboard based on user role
      let dashboardUrl = '/dashboard';
      
      console.log("User role after verification:", userRole);
      
      if (userRole === 'admin') {
        dashboardUrl = '/admin/dashboard';
      } else if (userRole === 'landlord') {
        dashboardUrl = '/landlord/dashboard';
      } else if (userRole === 'tenant') {
        dashboardUrl = '/tenant/dashboard';
      }
=======
      // Redirect to the dashboard regardless of role
      // The ProtectedRoute component in App.tsx will handle role-based access
      const dashboardUrl = '/dashboard';
>>>>>>> 69424dd (Fix 404 error)
      
      console.log("Setting redirect URL to:", dashboardUrl);
      setRedirectUrl(dashboardUrl);
      
      // Redirect to the appropriate dashboard after a short delay
      setTimeout(() => {
        console.log("Redirecting to:", dashboardUrl);
        navigate(dashboardUrl, { replace: true });
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setCountdown(60); // 60 seconds cooldown
    
    try {
      const newOtp = await sendVerificationEmail(email);
      toast({
        title: "OTP resent",
        description: "A new verification code has been sent to your email",
      });
      // Update the displayed OTP
      navigate(".", { state: { email, otp: newOtp }, replace: true });
    } catch (error: any) {
      toast({
        title: "Failed to resend OTP",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-md text-center">
          <NeumorphicCard className="p-8 flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
            <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
            <p className="text-muted-foreground mb-4">
              Your email has been verified successfully.
            </p>
            <p className="text-sm">
              Redirecting to dashboard... <a href={redirectUrl} className="text-primary">Click here</a> if you're not redirected automatically.
            </p>
          </NeumorphicCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <House className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground mt-2">
            We've sent a code to {email}
          </p>
        </div>
        
        <NeumorphicCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="neumorph-input w-full"
                placeholder="Enter 6-digit code"
                required
              />
              {receivedOtp && (
                <div className="mt-2 p-3 bg-primary/10 rounded-lg text-center">
                  <p className="text-sm font-medium">Your OTP Code (for demonstration):</p>
                  <p className="text-lg font-bold text-primary mt-1">{receivedOtp}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    In a real app, this would be sent to your email
                  </p>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="neumorph-button w-full flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              {resendDisabled ? (
                <span className="text-muted-foreground">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-primary font-medium hover:underline"
                  disabled={resendDisabled}
                >
                  Resend
                </button>
              )}
            </p>
          </div>
        </NeumorphicCard>
      </div>
    </div>
  );
}
