
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getLandlordTenants } from "@/utils/profileUtils";
import { Link } from "react-router-dom";
import {
  Building,
  Users,
  MessageSquare,
  CreditCard,
  Home,
  ChevronRight,
  Bell,
  BarChart4,
  Loader2,
} from "lucide-react";
import { Profile } from "@/integrations/supabase/types";

// Format UGX currency
const formatUGX = (amount: number) => {
  return `UGX ${amount.toLocaleString("en-UG")}`;
};

interface TenantWithConnection extends Profile {
  connection_id: string;
  connection_status: string;
}

export default function LandlordDashboard() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [tenants, setTenants] = useState<TenantWithConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTenants() {
      if (currentUser && currentUser.id) {
        try {
          setIsLoading(true);
          const loadedTenants = await getLandlordTenants(currentUser.id);
          setTenants(loadedTenants);
        } catch (error) {
          console.error("Error loading tenants:", error);
          toast({
            title: "Error loading tenants",
            description: "Please try again later",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    }

    loadTenants();
  }, [currentUser, toast]);

  const landlordMetrics = [
    { icon: Building, label: "Total Properties", value: "3" },
    { icon: Users, label: "Active Tenants", value: tenants.length.toString() },
    { icon: CreditCard, label: "Monthly Revenue", value: formatUGX(3200000) },
    { icon: BarChart4, label: "Occupancy Rate", value: "85%" },
    { icon: Bell, label: "Pending Actions", value: "2" },
  ];

  // Recent applications data
  const recentApplications = [
    {
      id: "app1",
      name: "John Doe",
      property: "Sunset Apartments, #201",
      status: "new",
      date: "April 1, 2025",
    },
    {
      id: "app2",
      name: "Jane Smith",
      property: "Lakeside Residence, #104",
      status: "viewed",
      date: "March 29, 2025",
    },
    {
      id: "app3",
      name: "David Johnson",
      property: "Garden Villas, #305",
      status: "new",
      date: "March 28, 2025",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.name || "Landlord"}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your properties and tenants
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {landlordMetrics.map((metric, index) => (
          <NeumorphicCard 
            key={index} 
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-3xl font-bold">{metric.value}</p>
              </div>
              <div className="p-3 neumorph rounded-full">
                <metric.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </NeumorphicCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <NeumorphicCard className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Applications
            </h2>
            <Link 
              to="/applications" 
              className="text-primary flex items-center hover:underline text-sm"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div 
                key={app.id} 
                className="neumorph p-4 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">Applied for {app.property}</p>
                    <p className="text-xs text-muted-foreground mt-1">{app.date}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">
                    {app.status === "new" ? "New" : "Viewed"}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="neumorph-button text-sm py-1"
                  >
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    className="neumorph-button text-sm py-1 bg-primary text-primary-foreground"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              My Tenants
            </h2>
            <Link 
              to="/tenants" 
              className="text-primary flex items-center hover:underline text-sm"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center p-8 neumorph rounded-xl">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1">No tenants yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You don't have any tenants connected to your account
              </p>
              <Button className="neumorph-button">Add Tenants</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tenants.slice(0, 3).map((tenant) => (
                <div 
                  key={tenant.id} 
                  className="neumorph p-4 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden neumorph-inset flex items-center justify-center">
                      {tenant.avatar_url ? (
                        <img 
                          src={tenant.avatar_url} 
                          alt={`${tenant.first_name} ${tenant.last_name}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {tenant.first_name?.[0]}{tenant.last_name?.[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{tenant.first_name} {tenant.last_name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Home className="h-3 w-3 mr-1" />
                        Sunset Apartments, #304
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {tenants.length > 3 && (
                <p className="text-center text-sm text-muted-foreground">
                  +{tenants.length - 3} more tenants
                </p>
              )}
            </div>
          )}
        </NeumorphicCard>
      </div>

      <NeumorphicCard className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Recent Messages
          </h2>
          <Link to="/messages" className="text-primary flex items-center hover:underline text-sm">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="neumorph p-4 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Tenant {i}</h3>
                  <p className="text-sm text-muted-foreground">
                    Request for maintenance in apartment #304
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Today, 10:23 AM</p>
                </div>
                {i === 1 && (
                  <span className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">
                    New
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </NeumorphicCard>
    </DashboardLayout>
  );
}
