
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { House, Key, User, MessageSquare, CreditCard, Bell } from "lucide-react";

export default function Index() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <header className="py-6 flex justify-between items-center">
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
          <section className="flex flex-col lg:flex-row gap-10 items-center mb-20">
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
                <button className="neumorph-button px-8 py-3 text-lg">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <NeumorphicCard className="p-6 lg:p-10">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Modern apartment building"
                  className="rounded-lg w-full h-auto"
                />
              </NeumorphicCard>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-10">
              Features That Make Us <span className="text-primary">Different</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <NeumorphicCard className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 neumorph rounded-full mb-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Easy Payments</h3>
                  <p className="text-muted-foreground">
                    Manage rent payments, view transaction history, and set up automatic payments.
                  </p>
                </div>
              </NeumorphicCard>
              
              <NeumorphicCard className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 neumorph rounded-full mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Direct Communication</h3>
                  <p className="text-muted-foreground">
                    Built-in messaging system for tenants and landlords to communicate efficiently.
                  </p>
                </div>
              </NeumorphicCard>
              
              <NeumorphicCard className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 neumorph rounded-full mb-4">
                    <Bell className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Smart Reminders</h3>
                  <p className="text-muted-foreground">
                    Automated notifications for rent, maintenance, and important dates.
                  </p>
                </div>
              </NeumorphicCard>
              
              <NeumorphicCard className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 neumorph rounded-full mb-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Tenant Applications</h3>
                  <p className="text-muted-foreground">
                    Streamlined application process for potential tenants with verification.
                  </p>
                </div>
              </NeumorphicCard>
              
              <NeumorphicCard className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 neumorph rounded-full mb-4">
                    <Key className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Secure Access</h3>
                  <p className="text-muted-foreground">
                    Role-based access control for landlords and tenants with verification.
                  </p>
                </div>
              </NeumorphicCard>
              
              <NeumorphicCard className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 neumorph rounded-full mb-4">
                    <House className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Property Management</h3>
                  <p className="text-muted-foreground">
                    Comprehensive tools for landlords to manage multiple properties and tenants.
                  </p>
                </div>
              </NeumorphicCard>
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
