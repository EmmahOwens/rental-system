
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
  Bell, 
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { formatInTimeZone } from "date-fns-tz";

export default function Index() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time for Uganda timezone
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

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

  // Format date for Uganda timezone
  const formattedDate = formatInTimeZone(
    currentTime,
    'Africa/Kampala',
    'MMMM d, yyyy - h:mm:ss a'
  );

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

  // Handle navigation to login/signup pages
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Full page hero background image with overlay */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80')",
        }}
      />
      
      {/* Gradient overlay for readability */}
      <div 
        className="fixed inset-0 z-0 bg-gradient-to-b from-background/70 via-background/80 to-background"
        style={{ opacity: Math.max(0.6, heroOpacity) }}
      />

      <div className="relative z-10">
        <header className="py-4 px-6 flex justify-between items-center backdrop-blur-sm bg-background/30 sticky top-0">
          <div className="flex items-center gap-2">
            <House className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold hidden sm:block">Rental Management System</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLoginClick}
              className="neumorph-button text-sm"
            >
              Login
            </button>
            <button 
              onClick={handleSignupClick}
              className="neumorph-button bg-primary text-primary-foreground text-sm"
            >
              Sign Up
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main>
          {/* Hero section with text overlay on background image */}
          <section className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-3xl backdrop-blur-sm bg-background/20 p-8 rounded-xl neumorph"
            >
              <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                <span className="text-primary">Simplified</span> Property Management Solution
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                An all-in-one platform connecting landlords and tenants for a seamless rental experience. From payments to maintenance requests, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button 
                  onClick={() => navigate("/signup")}
                  className="neumorph-button bg-primary text-primary-foreground px-8 py-3 text-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started <ArrowRight className="h-5 w-5" />
                </motion.button>
                <motion.button 
                  onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="neumorph-button px-8 py-3 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
              <div className="mt-8 text-sm opacity-80">
                {formattedDate} | Uganda Time
              </div>
            </motion.div>
          </section>

          {/* Features section with scroll animation */}
          <section ref={featuresRef} className="mb-20 pt-20 px-4 container mx-auto">
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
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        <footer className="py-6 px-6 border-t border-border backdrop-blur-sm bg-background/30">
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
    </div>
  );
}
