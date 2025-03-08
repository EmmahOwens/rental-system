
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { House, Key, User, MessageSquare, CreditCard, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Index() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (currentUser) {
      navigate("/dashboard");
    }

    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check if features section is in viewport
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75;
        setFeaturesVisible(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentUser, navigate]);

  // Calculate opacity for hero background fade effect
  const heroOpacity = Math.max(0, 1 - scrollY / 500);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Hero background image with fade effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-opacity duration-300"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80')",
          opacity: heroOpacity,
          backgroundAttachment: "fixed"
        }}
      />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          background: `linear-gradient(to bottom, rgba(var(--background)/0.5) 0%, rgb(var(--background)) 100%)`,
          opacity: heroOpacity
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <header className="py-6 flex justify-between items-center backdrop-blur-sm bg-background/30 rounded-b-lg">
          <div className="flex items-center gap-2">
            <House className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">CozyLeases</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="neumorph-button"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/signup")}
              className="neumorph-button bg-primary text-primary-foreground"
            >
              Sign Up
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main className="py-12">
          <section className="flex flex-col lg:flex-row gap-10 items-center mb-20 min-h-[calc(100vh-200px)] justify-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-primary">Simplified</span> Property Management Solution
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                An all-in-one platform connecting landlords and tenants for a seamless rental experience. From payments to maintenance requests, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate("/signup")}
                  className="neumorph-button bg-primary text-primary-foreground px-8 py-3 text-lg"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="neumorph-button px-8 py-3 text-lg"
                >
                  Learn More
                </button>
              </div>
            </div>
          </section>

          <section ref={featuresRef} className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-10">
              Features That Make Us <span className="text-primary">Different</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <CreditCard className="h-8 w-8 text-primary" />, title: "Easy Payments", description: "Manage rent payments, view transaction history, and set up automatic payments." },
                { icon: <MessageSquare className="h-8 w-8 text-primary" />, title: "Direct Communication", description: "Built-in messaging system for tenants and landlords to communicate efficiently." },
                { icon: <Bell className="h-8 w-8 text-primary" />, title: "Smart Reminders", description: "Automated notifications for rent, maintenance, and important dates." },
                { icon: <User className="h-8 w-8 text-primary" />, title: "Tenant Applications", description: "Streamlined application process for potential tenants with verification." },
                { icon: <Key className="h-8 w-8 text-primary" />, title: "Secure Access", description: "Role-based access control for landlords and tenants with verification." },
                { icon: <House className="h-8 w-8 text-primary" />, title: "Property Management", description: "Comprehensive tools for landlords to manage multiple properties and tenants." }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className={cn(
                    "transition-all duration-700 transform",
                    featuresVisible 
                      ? "translate-y-0 opacity-100" 
                      : "translate-y-20 opacity-0",
                    // Staggered animation delay
                    `delay-[${index * 150}ms]`
                  )}
                  style={{ 
                    transitionDelay: `${index * 150}ms` 
                  }}
                >
                  <div className="neumorph p-6 h-full">
                    <div className="flex flex-col items-center text-center h-full">
                      <div className="p-4 neumorph rounded-full mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of landlords and tenants who are already enjoying our streamlined rental management system.
            </p>
            <button 
              onClick={() => navigate("/signup")}
              className="neumorph-button bg-primary text-primary-foreground px-8 py-3 text-lg mx-auto"
            >
              Create an Account
            </button>
          </section>
        </main>

        <footer className="py-10 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <House className="h-6 w-6 text-primary" />
              <p className="font-bold">CozyLeases</p>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2023 CozyLeases. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
