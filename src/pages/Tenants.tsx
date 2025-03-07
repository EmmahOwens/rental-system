
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
  UserPlus 
} from "lucide-react";
import { useState } from "react";

// This page is only for landlords
export default function Tenants() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for tenants
  const tenants = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      property: "Sunset Apartments, #304",
      status: "Active",
      moveInDate: "Jan 15, 2023",
      leaseEnd: "Jan 14, 2024",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543",
      property: "Sunset Apartments, #201",
      status: "Active",
      moveInDate: "Mar 1, 2023",
      leaseEnd: "Feb 28, 2024",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "(555) 456-7890",
      property: "Sunset Apartments, #102",
      status: "Active",
      moveInDate: "Nov 10, 2022",
      leaseEnd: "Nov 9, 2023",
    },
    {
      id: 4,
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      phone: "(555) 234-5678",
      property: "Sunset Apartments, #405",
      status: "Notice given",
      moveInDate: "Jun 5, 2022",
      leaseEnd: "Jun 30, 2023",
    },
  ];

  const handleRemoveTenant = (id: number, name: string) => {
    toast({
      title: "Tenant removal initiated",
      description: `${name} will be removed after confirmation`,
    });
  };

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
              <p className="text-2xl font-bold">28</p>
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
              <p className="text-2xl font-bold">92%</p>
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
              <p className="text-2xl font-bold">5</p>
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
              {tenants.map((tenant) => (
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
                      <button className="neumorph-button text-sm py-1">Message</button>
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
      </NeumorphicCard>
    </DashboardLayout>
  );
}
