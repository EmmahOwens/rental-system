
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ChevronDown, Eye, Filter, Search, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// This page is only for landlords
export default function Applications() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch applications from Supabase
  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('rental_applications')  // Changed from 'applications' to 'rental_applications'
          .select('*');
          
        if (error) throw error;
        
        setApplications(data || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: "Error",
          description: "Failed to load applications",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchApplications();
  }, [toast]);
  // Handle approve application with Supabase
  const handleApproveApplication = async (id, name) => {
    try {
      const { error } = await supabase
        .from('rental_applications')  // Changed from 'applications' to 'rental_applications'
        .update({ status: 'Approved' })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setApplications(prev => 
        prev.map(app => app.id === id ? {...app, status: 'Approved'} : app)
      );
      
      toast({
        title: "Application approved",
        description: `${name} has been approved as a tenant`,
      });
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive",
      });
    }
  };

  // Similar implementation for handleRejectApplication
  
  const applicationsPerPage = 3; // Number of applications to show per page
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCreditScore, setFilterCreditScore] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Apply filters
  let filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.property.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Apply status filter
  if (filterStatus !== "all") {
    filteredApplications = filteredApplications.filter(app => 
      app.status.toLowerCase() === filterStatus.toLowerCase()
    );
  }
  // Apply credit score filter
  if (filterCreditScore !== "all") {
    filteredApplications = filteredApplications.filter(app => 
      app.creditScore === filterCreditScore
    );
  }
  // Calculate pagination with filtered applications
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);
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
              {currentApplications.map((app) => (
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
                        onClick={() => {
                          toast({
                            title: "Application Approved",
                            description: `Successfully approved ${app.name}'s application.`
                          });
                        }}
                      >
                        <CheckCircle className="h-3 w-3" />
                        Approve
                      </button>
                      <button 
                        className="neumorph-button text-sm py-1 px-2 flex items-center gap-1 text-destructive"
                        onClick={() => {
                          toast({
                            title: "Application Rejected",
                            description: `Successfully rejected ${app.name}'s application.`
                          });
                        }}
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

        {/* Add pagination */}
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </NeumorphicCard>
    </DashboardLayout>
  );

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
  status: string;
  appliedDate: string;
  income: string;
  creditScore: string;
}

const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

const handleViewApplication = (application: Application) => {
  setSelectedApplication(application);
  setIsViewDialogOpen(true);
};

// Render the view dialog
const renderViewDialog = () => (
  <AlertDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
    <AlertDialogContent className="max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle>Application Details</AlertDialogTitle>
        <AlertDialogDescription>
          {selectedApplication && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Name:</p>
                <p>{selectedApplication.name}</p>
                
                <p className="font-medium">Email:</p>
                <p>{selectedApplication.email}</p>
                
                <p className="font-medium">Phone:</p>
                <p>{selectedApplication.phone}</p>
                
                <p className="font-medium">Property:</p>
                <p>{selectedApplication.property}</p>
                
                <p className="font-medium">Applied Date:</p>
                <p>{selectedApplication.appliedDate}</p>
                
                <p className="font-medium">Income:</p>
                <p>{selectedApplication.income}</p>
                
                <p className="font-medium">Credit Score:</p>
                <p>{selectedApplication.creditScore}</p>
              </div>
            </div>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Close</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// Update the table row to include the view button
const renderTableRow = (app: Application) => (
  <tr key={app.id} className="border-b border-border">
    {/* ... other table cells ... */}
    <td className="py-4">
      <div className="flex gap-2">
        <button 
          className="neumorph-button text-sm py-1 px-2 flex items-center gap-1"
          onClick={() => handleViewApplication(app)}
        >
          <Eye className="h-3 w-3" />
          View
        </button>
        {/* ... other buttons ... */}
      </div>
    </td>
  </tr>
);

{renderViewDialog()}
}
