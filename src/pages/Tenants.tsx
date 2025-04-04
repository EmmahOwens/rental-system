
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getLandlordTenants, TenantWithConnection } from "@/utils/profileUtils";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { 
  Search, 
  Home, 
  PhoneCall, 
  Mail, 
  Calendar, 
  MessageSquare, 
  User, 
  ChevronDown, 
  Settings,
  Building
} from "lucide-react";

export default function Tenants() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [tenants, setTenants] = useState<TenantWithConnection[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<TenantWithConnection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<TenantWithConnection | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function loadTenants() {
      if (!currentUser?.id) return;

      try {
        setIsLoading(true);
        const result = await getLandlordTenants(currentUser.id);
        setTenants(result);
        setFilteredTenants(result);
      } catch (error) {
        console.error("Error loading tenants:", error);
        toast({
          title: "Failed to load tenants",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadTenants();
  }, [currentUser, toast]);

  useEffect(() => {
    // Filter tenants based on search term
    if (searchTerm) {
      const filtered = tenants.filter(tenant => 
        tenant.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tenant.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTenants(filtered);
    } else {
      setFilteredTenants(tenants);
    }
  }, [searchTerm, tenants]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <User className="mr-2 h-7 w-7 text-primary" /> 
          My Tenants
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" className="neumorph-button">
            <Settings className="mr-2 h-4 w-4" />
            Manage
          </Button>
          <Button className="neumorph-button">
            <User className="mr-2 h-4 w-4" />
            Add Tenant
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search tenants by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 neumorph-input"
          />
        </div>
      </div>

      <NeumorphicCard className="mb-6">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <div className="p-4 border-b">
            <TabsList className="w-full neumorph-inset">
              <TabsTrigger value="all" className="flex-1">All Tenants ({tenants.length})</TabsTrigger>
              <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
              </div>
            ) : filteredTenants.length === 0 ? (
              <div className="text-center p-12">
                <User className="h-16 w-16 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-xl font-medium mb-2">No tenants found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? "Try a different search term" : "You don't have any tenants yet"}
                </p>
                {!searchTerm && (
                  <Button className="neumorph-button">Add Your First Tenant</Button>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filteredTenants.map((tenant) => (
                  <div key={tenant.id} className="p-4 hover:bg-accent/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedTenant(tenant)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
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
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Home className="h-3 w-3 mr-1" />
                            <span>Sunset Apartments, #304</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/messages?contact=${tenant.id}`}>
                          <Button variant="ghost" size="icon" className="neumorph h-8 w-8">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </Link>
                        <a href={`tel:${tenant.phone}`}>
                          <Button variant="ghost" size="icon" className="neumorph h-8 w-8">
                            <PhoneCall className="h-4 w-4" />
                          </Button>
                        </a>
                        <a href={`mailto:${tenant.email}`}>
                          <Button variant="ghost" size="icon" className="neumorph h-8 w-8">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </a>
                        <Button variant="ghost" size="icon" className="neumorph h-8 w-8">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Similar content for other tabs */}
          <TabsContent value="active" className="p-6 text-center text-muted-foreground">
            <Building className="h-12 w-12 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">Active tenants filter</h3>
            <p>This filter will show only active tenants.</p>
          </TabsContent>
          
          <TabsContent value="pending" className="p-6 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">Pending tenants filter</h3>
            <p>This filter will show only pending tenant applications.</p>
          </TabsContent>
        </Tabs>
      </NeumorphicCard>

      {selectedTenant && (
        <NeumorphicCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden neumorph-inset flex items-center justify-center">
                {selectedTenant.avatar_url ? (
                  <img 
                    src={selectedTenant.avatar_url} 
                    alt={`${selectedTenant.first_name} ${selectedTenant.last_name}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {selectedTenant.first_name?.[0]}{selectedTenant.last_name?.[0]}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedTenant.first_name} {selectedTenant.last_name}</h2>
                <p className="text-muted-foreground">Tenant since {selectedTenant.created_at ? format(new Date(selectedTenant.created_at), 'MMMM dd, yyyy') : 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="neumorph-button">
                <Settings className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button className="neumorph-button bg-primary text-primary-foreground">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <Separator />
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>{selectedTenant.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-primary" />
                  <span>{selectedTenant.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-primary" />
                  <span>Sunset Apartments, Unit #304</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Lease Information</h3>
              <Separator />
              
              <div className="neumorph-inset p-4 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Start Date</span>
                  <span>June 1, 2023</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">End Date</span>
                  <span>May 31, 2024</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Monthly Rent</span>
                  <span className="font-medium">UGX 1,200,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Paid</span>
                </div>
              </div>
            </div>
          </div>
        </NeumorphicCard>
      )}
    </DashboardLayout>
  );
}
