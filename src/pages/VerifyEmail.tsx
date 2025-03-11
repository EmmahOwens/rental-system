
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
  const { verifyEmail, sendVerificationEmail, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const email = location.state?.email;
  const receivedOtp = location.state?.otp;

  useEffect(() => {
    console.log("VerifyEmail component mounted, email:", email);
    console.log("Current user status:", currentUser);
    
    // Redirect if no email in state
    if (!email) {
      console.log("No email found in state, redirecting to signup");
      navigate("/signup", { replace: true });
      return;
    }
    
    // Redirect if already verified
    if (currentUser?.verified) {
      console.log("User already verified, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }

    // Auto-fill OTP if provided in state
    if (receivedOtp && !otp) {
      setOtp(receivedOtp);
    }
  }, [email, navigate, currentUser, receivedOtp, otp]);

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
      console.log("Submitting OTP:", otp);
      const userRole = await verifyEmail(otp);
      console.log("Verification successful, received role:", userRole);
      
      setIsSuccess(true);
      toast({
        title: "Email verified",
        description: "Your email has been verified successfully!",
      });
      
      // Determine specific dashboard URL based on role
      let dashboardUrl;
      if (userRole === 'landlord') {
        dashboardUrl = '/landlord/dashboard';
      } else {
        dashboardUrl = '/tenant/dashboard';
      }
      
      console.log("Will redirect to:", dashboardUrl);
      
      // Redirect after a short delay to ensure state updates properly
      setTimeout(() => {
        console.log("Now redirecting to:", dashboardUrl);
        navigate(dashboardUrl, { replace: true });
      }, 2000);
    } catch (error: any) {
      console.error("Verification error:", error);
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
      // Update the displayed OTP and auto-fill the input
      navigate(".", { state: { email, otp: newOtp }, replace: true });
      setOtp(newOtp);
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
              Redirecting to dashboard...
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
