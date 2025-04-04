
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getLandlordTenants } from "@/utils/profileUtils";
import { sendMessage } from "@/utils/messageUtils";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/integrations/supabase/types";
import { 
  Users, 
  MessageSquare, 
  Home, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  Loader2 
} from "lucide-react";
import { format } from "date-fns";

interface TenantWithConnection extends Profile {
  connection_id: string;
  connection_status: string;
}

export default function Tenants() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const handleMessageTenant = async (tenant: TenantWithConnection) => {
    if (!currentUser) return;
    
    try {
      // Send initial message if none exists
      await sendMessage({
        content: "Hello! How can I help you today?",
        sender_id: currentUser.id,
        receiver_id: tenant.id,
      });
      
      // Navigate to messages page
      navigate("/messages");
      
      toast({
        title: "Conversation started",
        description: `You can now chat with ${tenant.first_name} ${tenant.last_name}`,
      });
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error starting conversation",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Users className="mr-2 h-8 w-8 text-primary" />
          My Tenants
        </h1>
        <p className="text-muted-foreground">
          Manage and communicate with your tenants
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : tenants.length === 0 ? (
        <NeumorphicCard className="p-8 text-center">
          <div className="flex flex-col items-center justify-center p-8">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No tenants yet</h2>
            <p className="text-muted-foreground mb-4">
              You don't have any tenants associated with your account yet.
            </p>
          </div>
        </NeumorphicCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <NeumorphicCard 
              key={tenant.id} 
              className="p-6 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-14 w-14 rounded-full overflow-hidden neumorph-inset flex items-center justify-center mr-3">
                    {tenant.avatar_url ? (
                      <img 
                        src={tenant.avatar_url} 
                        alt={`${tenant.first_name} ${tenant.last_name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {tenant.first_name?.[0]}{tenant.last_name?.[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {tenant.first_name} {tenant.last_name}
                    </h3>
                    <div className="flex items-center">
                      {tenant.connection_status === 'active' ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {tenant.connection_status === 'active' 
                          ? 'Active Tenant' 
                          : 'Pending Approval'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-primary mr-2" />
                  <span className="text-muted-foreground">{tenant.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-primary mr-2" />
                  <span className="text-muted-foreground">{tenant.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Home className="h-4 w-4 text-primary mr-2" />
                  <span className="text-muted-foreground">Unit #304</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-primary mr-2" />
                  <span className="text-muted-foreground">
                    Joined {tenant.created_at ? format(new Date(tenant.created_at), 'MMMM d, yyyy') : 'Recently'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => handleMessageTenant(tenant)}
                  className="neumorph-button flex-1 flex items-center justify-center"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </button>
                <button className="neumorph-button flex-1 flex items-center justify-center bg-primary text-primary-foreground">
                  <Home className="h-4 w-4 mr-2" />
                  View Details
                </button>
              </div>
            </NeumorphicCard>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
