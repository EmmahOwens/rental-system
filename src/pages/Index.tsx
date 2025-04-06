
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  House, 
  Key, 
  User, 
  MessageSquare, 
  CreditCard, 
  Bell
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (currentUser) {
      navigate("/dashboard");
    }

    const handleScroll = () => {
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

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1, 
        duration: 0.5, 
        ease: "easeOut" 
      } 
    })
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-4 px-6 flex justify-between items-center bg-background/80 backdrop-blur-sm sticky top-0 border-b border-border z-10">
        <div className="flex items-center gap-2">
          <House className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold hidden sm:block">Rental Management System</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="text-sm"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            className="text-sm"
          >
            Sign Up
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero section with description */}
        <section className="flex flex-col items-center justify-center text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-primary">Simplified</span> Property Management Solution
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              An all-in-one platform connecting landlords and tenants for a seamless rental experience. 
              From payments to maintenance requests, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/signup")}
                size="lg"
                className="font-medium"
              >
                Get Started
              </Button>
              <Button 
                onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                size="lg"
                className="font-medium"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features section */}
        <section ref={featuresRef} className="py-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Features That Make Us <span className="text-primary">Different</span>
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Our comprehensive platform is designed to simplify property management for both landlords and tenants.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <CreditCard className="h-8 w-8 text-primary" />, title: "Easy Payments", description: "Manage rent payments, view transaction history, and set up automatic payments." },
              { icon: <MessageSquare className="h-8 w-8 text-primary" />, title: "Direct Communication", description: "Built-in messaging system for tenants and landlords to communicate efficiently." },
              { icon: <Bell className="h-8 w-8 text-primary" />, title: "Smart Reminders", description: "Automated notifications for rent, maintenance, and important dates." },
              { icon: <User className="h-8 w-8 text-primary" />, title: "Tenant Applications", description: "Streamlined application process for potential tenants with verification." },
              { icon: <Key className="h-8 w-8 text-primary" />, title: "Secure Access", description: "Role-based access control for landlords and tenants with verification." },
              { icon: <House className="h-8 w-8 text-primary" />, title: "Property Management", description: "Comprehensive tools for landlords to manage multiple properties and tenants." }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                custom={index}
                initial="hidden"
                animate={featuresVisible ? "visible" : "hidden"}
                variants={fadeInUpVariants}
                className="h-full"
              >
                <div className="bg-card p-6 rounded-lg border border-border h-full shadow-sm">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="p-3 bg-primary/10 rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-6 px-6 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <House className="h-6 w-6 text-primary" />
              <p className="font-bold">Rental Management System</p>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Rental Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
