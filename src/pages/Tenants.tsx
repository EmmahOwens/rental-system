
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronDown, 
  Filter, 
  Home, 
  Plus, 
  Search, 
  User, 
  UserMinus, 
  UserPlus,
  MessageSquare 
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getLandlordTenants } from "@/utils/profileUtils";
import { useNavigate } from "react-router-dom";

type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  status: string;
  moveInDate: string;
  leaseEnd: string;
  profileId: string;
};

export default function Tenants() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTenants: 0,
    occupancyRate: 0,
    newApplications: 0
  });

  // Fetch tenants data
  useEffect(() => {
    const fetchTenants = async () => {
      if (!currentUser?.id) return;
      
      try {
        setLoading(true);
        
        // Get landlord profile ID
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", currentUser.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching landlord profile:", profileError);
          return;
        }
        
        // Get landlord's tenants
        const tenantsData = await getLandlordTenants(profileData.id);
        
        if (tenantsData && tenantsData.length > 0) {
          // Also get property and tenancy data for each tenant
          const tenantsWithDetails = await Promise.all(
            tenantsData.map(async (item) => {
              // Get tenancy information if available
              const { data: tenancyData, error: tenancyError } = await supabase
                .from("tenancies")
                .select(`
                  id,
                  start_date,
                  end_date,
                  active,
                  property:properties(name)
                `)
                .eq("tenant_id", item.tenant_id)
                .order('created_at', { ascending: false })
                .limit(1);
              
              // Get user email from auth
              const { data: userData, error: userError } = await supabase
                .from("profiles")
                .select("user_id")
                .eq("id", item.tenant_id)
                .single();
              
              let email = "";
              if (!userError && userData) {
                const { data: authData } = await supabase.auth.admin.getUserById(userData.user_id);
                if (authData?.user) {
                  email = authData.user.email || "";
                }
              }
              
              return {
                id: item.tenant_id,
                name: item.tenants.first_name && item.tenants.last_name 
                  ? `${item.tenants.first_name} ${item.tenants.last_name}` 
                  : "Unnamed Tenant",
                email: email,
                phone: item.tenants.phone || "No phone",
                property: tenancyError || !tenancyData || tenancyData.length === 0 
                  ? "No property assigned" 
                  : tenancyData[0].property?.name || "Unknown property",
                status: tenancyError || !tenancyData || tenancyData.length === 0 
                  ? "Inactive" 
                  : tenancyData[0].active ? "Active" : "Inactive",
                moveInDate: tenancyError || !tenancyData || tenancyData.length === 0 
                  ? "N/A" 
                  : new Date(tenancyData[0].start_date).toLocaleDateString(),
                leaseEnd: tenancyError || !tenancyData || tenancyData.length === 0 || !tenancyData[0].end_date
                  ? "N/A" 
                  : new Date(tenancyData[0].end_date).toLocaleDateString(),
                profileId: item.tenant_id
              };
            })
          );
          
          setTenants(tenantsWithDetails);
          
          // Update stats
          setStats({
            totalTenants: tenantsWithDetails.length,
            occupancyRate: Math.round((tenantsWithDetails.filter(t => t.status === "Active").length / tenantsWithDetails.length) * 100),
            newApplications: 5 // This should be replaced with actual application count
          });
        } else {
          // Display mock data if no tenants found
          setTenants([]);
        }
      } catch (error) {
        console.error("Error fetching tenants:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTenants();
  }, [currentUser?.id]);

  const handleRemoveTenant = (id: string, name: string) => {
    toast({
      title: "Tenant removal initiated",
      description: `${name} will be removed after confirmation`,
    });
  };
  
  const handleMessageTenant = (profileId: string) => {
    navigate('/messages', { state: { tenantId: profileId } });
  };

  // Filter tenants based on search term
  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tenants</h1>
        <p className="text-muted-foreground">Manage your property tenants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <NeumorphicCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 neumorph rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tenants</p>
              <p className="text-2xl font-bold">{stats.totalTenants}</p>
            </div>
          </div>
        </NeumorphicCard>
        
        <NeumorphicCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 neumorph rounded-full">
              <Home className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
              <p className="text-2xl font-bold">{stats.occupancyRate}%</p>
            </div>
          </div>
        </NeumorphicCard>
        
        <NeumorphicCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 neumorph rounded-full">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">New Applications</p>
              <p className="text-2xl font-bold">{stats.newApplications}</p>
            </div>
          </div>
        </NeumorphicCard>
      </div>

      <NeumorphicCard className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold">Tenant Directory</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neumorph-input pl-10 w-full"
              />
            </div>
            
            <button className="neumorph-button flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <button className="neumorph-button bg-primary text-primary-foreground flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Tenant
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-semibold mb-2">No tenants found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search criteria" : "You don't have any tenants yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Property</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Move-in Date</th>
                  <th className="pb-3">Lease End</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-border">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-muted-foreground">{tenant.email}</p>
                      </div>
                    </td>
                    <td className="py-4">{tenant.property}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tenant.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="py-4">{tenant.moveInDate}</td>
                    <td className="py-4">{tenant.leaseEnd}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button 
                          className="neumorph-button text-sm py-1 flex items-center gap-1"
                          onClick={() => handleMessageTenant(tenant.profileId)}
                        >
                          <MessageSquare className="h-3 w-3" />
                          Message
                        </button>
                        <button 
                          className="neumorph-button text-sm py-1 flex items-center gap-1 text-destructive"
                          onClick={() => handleRemoveTenant(tenant.id, tenant.name)}
                        >
                          <UserMinus className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </NeumorphicCard>
    </DashboardLayout>
  );
}
