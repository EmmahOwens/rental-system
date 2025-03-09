
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
  ArrowRight, 
  CheckCircle, 
  Shield,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInTimeZone } from "date-fns-tz";
import { motion } from "framer-motion";

export default function Index() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);
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
      
      // Check if sections are in viewport
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75;
        setFeaturesVisible(isVisible);
      }
      
      if (testimonialsRef.current) {
        const rect = testimonialsRef.current.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75;
        setTestimonialsVisible(isVisible);
      }
      
      if (pricingRef.current) {
        const rect = pricingRef.current.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75;
        setPricingVisible(isVisible);
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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Property Owner",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      text: "This platform has revolutionized how I manage my rental properties. Automated payments, maintenance requests, and tenant communications all in one place!"
    },
    {
      name: "Michael Chen",
      role: "Tenant",
      image: "https://randomuser.me/api/portraits/men/51.jpg",
      text: "Finding an apartment and managing rent payments has never been easier. The transparency and ease of communication with my landlord is fantastic."
    },
    {
      name: "Emily Rodriguez",
      role: "Property Manager",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "As someone who manages multiple properties, this system has saved me countless hours. The analytics features help me make better business decisions."
    }
  ];

  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for tenants and small property owners",
      features: [
        "Property listings",
        "Basic messaging",
        "Payment tracking",
        "Maintenance requests"
      ],
      cta: "Get Started",
      highlight: false
    },
    {
      name: "Professional",
      price: "UGX 150,000",
      period: "per month",
      description: "Ideal for property managers with multiple units",
      features: [
        "All Basic features",
        "Advanced analytics",
        "Tenant screening",
        "Document management",
        "Multiple property support",
        "Priority support"
      ],
      cta: "Try 14 Days Free",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large property management companies",
      features: [
        "All Professional features",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "White-label solution",
        "Advanced security features"
      ],
      cta: "Contact Sales",
      highlight: false
    }
  ];

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
          
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => testimonialsRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Testimonials
            </button>
            <button 
              onClick={() => pricingRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="neumorph-button text-sm"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/signup")}
              className="neumorph-button bg-primary text-primary-foreground text-sm"
            >
              Sign Up
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main>
          {/* Hero section with text overlay on background image */}
          <section className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 py-20">
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

          {/* Testimonials section */}
          <section ref={testimonialsRef} className="mb-20 py-16 px-4 backdrop-blur-sm bg-background/30 rounded-xl">
            <div className="container mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                What Our Users <span className="text-primary">Say</span>
              </h2>
              <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
                Don't just take our word for it. Here's what property owners and tenants think about our platform.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div 
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate={testimonialsVisible ? "visible" : "hidden"}
                    variants={fadeInUpVariants}
                  >
                    <div className="neumorph p-6 h-full">
                      <div className="flex flex-col h-full">
                        <div className="mb-4">
                          <p className="text-lg mb-6 italic">"{testimonial.text}"</p>
                        </div>
                        <div className="mt-auto flex items-center">
                          <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                          <div>
                            <h4 className="font-bold">{testimonial.name}</h4>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing section */}
          <section ref={pricingRef} className="mb-20 py-16 px-4 container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Simple, Transparent <span className="text-primary">Pricing</span>
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Choose the plan that works best for your property management needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div 
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate={pricingVisible ? "visible" : "hidden"}
                  variants={fadeInUpVariants}
                  className="h-full"
                >
                  <div className={cn(
                    "neumorph p-6 h-full flex flex-col",
                    plan.highlight && "border-2 border-primary relative"
                  )}>
                    {plan.highlight && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-sm text-muted-foreground"> {plan.period}</span>}
                    </div>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      className={cn(
                        "mt-auto neumorph-button w-full",
                        plan.highlight && "bg-primary text-primary-foreground"
                      )}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="text-center mb-20 py-16 px-4 backdrop-blur-sm bg-background/30 rounded-xl container mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of landlords and tenants who are already enjoying our streamlined rental management system.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <span>Secure platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-6 w-6 text-primary" />
                  <span>Verified users</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span>Easy to use</span>
                </div>
              </div>
              <motion.button 
                onClick={() => navigate("/signup")}
                className="neumorph-button bg-primary text-primary-foreground px-8 py-3 text-lg mx-auto mt-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create an Account
              </motion.button>
            </motion.div>
          </section>
        </main>

        <footer className="py-10 px-6 border-t border-border backdrop-blur-sm bg-background/30">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <House className="h-6 w-6 text-primary" />
                  <p className="font-bold">Rental Management System</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Simplifying property management for landlords and tenants across Uganda.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm hover:text-primary">About Us</a></li>
                  <li><a href="#" className="text-sm hover:text-primary">Careers</a></li>
                  <li><a href="#" className="text-sm hover:text-primary">Press</a></li>
                  <li><a href="#" className="text-sm hover:text-primary">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm hover:text-primary">Help Center</a></li>
                  <li><a href="#" className="text-sm hover:text-primary">Community</a></li>
                  <li><a href="#" className="text-sm hover:text-primary">Webinars</a></li>
                  <li><a href="#" className="text-sm hover:text-primary">Developer API</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li><a href="mailto:info@rentalmgmt.com" className="text-sm hover:text-primary">info@rentalmgmt.com</a></li>
                  <li><a href="tel:+256700123456" className="text-sm hover:text-primary">+256 700 123 456</a></li>
                  <li><span className="text-sm">Plot 45, Kampala Road, Kampala, Uganda</span></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                © 2025 Rental Management System. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-sm hover:text-primary">Terms</a>
                <a href="#" className="text-sm hover:text-primary">Privacy</a>
                <a href="#" className="text-sm hover:text-primary">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
