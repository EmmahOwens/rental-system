
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ChevronDown, Eye, Filter, Search, UserPlus, X } from "lucide-react";
import { useState } from "react";

// This page is only for landlords
export default function Applications() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for applications
  const applications = [
    {
      id: 1,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "(555) 234-5678",
      property: "Sunset Apartments, #302",
      status: "Pending",
      appliedDate: "May 12, 2023",
      income: "$75,000",
      creditScore: "Good",
    },
    {
      id: 2,
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      phone: "(555) 876-5432",
      property: "Sunset Apartments, #205",
      status: "Pending",
      appliedDate: "May 10, 2023",
      income: "$82,000",
      creditScore: "Excellent",
    },
    {
      id: 3,
      name: "James Brown",
      email: "james.brown@example.com",
      phone: "(555) 345-6789",
      property: "Sunset Apartments, #410",
      status: "Pending",
      appliedDate: "May 8, 2023",
      income: "$68,000",
      creditScore: "Good",
    },
    {
      id: 4,
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "(555) 987-1234",
      property: "Sunset Apartments, #103",
      status: "Pending",
      appliedDate: "May 5, 2023",
      income: "$92,000",
      creditScore: "Excellent",
    },
  ];

  const handleApproveApplication = (id: number, name: string) => {
    toast({
      title: "Application approved",
      description: `${name} has been approved as a tenant`,
    });
  };

  const handleRejectApplication = (id: number, name: string) => {
    toast({
      title: "Application rejected",
      description: `${name}'s application has been rejected`,
      variant: "destructive",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tenant Applications</h1>
        <p className="text-muted-foreground">Review and manage tenant applications</p>
      </div>

      <NeumorphicCard className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="neumorph p-4 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">New Applications</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="p-2 neumorph rounded-full">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="neumorph p-4 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="p-2 neumorph rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="neumorph p-4 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="p-2 neumorph rounded-full">
                <X className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </div>
        </div>
      </NeumorphicCard>

      <NeumorphicCard className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold">Applications List</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search applications..."
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
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-3">Applicant</th>
                <th className="pb-3">Property</th>
                <th className="pb-3">Applied Date</th>
                <th className="pb-3">Income</th>
                <th className="pb-3">Credit Score</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-border">
                  <td className="py-4">
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-muted-foreground">{app.email}</p>
                    </div>
                  </td>
                  <td className="py-4">{app.property}</td>
                  <td className="py-4">{app.appliedDate}</td>
                  <td className="py-4">{app.income}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.creditScore === 'Excellent' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {app.creditScore}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="neumorph-button text-sm py-1 px-2 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                      <button 
                        className="neumorph-button text-sm py-1 px-2 flex items-center gap-1 bg-primary text-primary-foreground"
                        onClick={() => handleApproveApplication(app.id, app.name)}
                      >
                        <CheckCircle className="h-3 w-3" />
                        Approve
                      </button>
                      <button 
                        className="neumorph-button text-sm py-1 px-2 flex items-center gap-1 text-destructive"
                        onClick={() => handleRejectApplication(app.id, app.name)}
                      >
                        <X className="h-3 w-3" />
                        Reject
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
