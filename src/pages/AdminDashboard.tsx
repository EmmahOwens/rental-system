
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { Home, Users, ActivitySquare, Settings, Shield, LineChart, BarChart, Briefcase } from "lucide-react";

// Format UGX currency
const formatUGX = (amount: number) => {
  return `UGX ${amount.toLocaleString("en-UG")}`;
};

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  const adminMetrics = [
    { icon: Briefcase, label: "Total Properties", value: "45" },
    { icon: Users, label: "Total Users", value: "126" },
    { icon: Shield, label: "Landlords", value: "18" },
    { icon: LineChart, label: "Monthly Revenue", value: formatUGX(89500000) },
    { icon: BarChart, label: "System Uptime", value: "99.9%" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.name}. Here's an overview of the entire system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminMetrics.map((metric, index) => (
          <NeumorphicCard key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
              <div className="p-3 neumorph rounded-full">
                <metric.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </NeumorphicCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NeumorphicCard className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ActivitySquare className="h-5 w-5 text-primary" />
            System Activity
          </h2>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="neumorph p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {i === 1 ? "New Landlord Registration" : 
                       i === 2 ? "System Upgrade" : 
                       i === 3 ? "Payment Gateway Update" : "Security Alert"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {i === 1 ? "New landlord account approved" : 
                       i === 2 ? "System upgraded to version 2.4.5" : 
                       i === 3 ? "Payment gateway successfully updated" : "Unusual login activity detected"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Today, {10 - i}:23 AM</p>
                  </div>
                  {i === 1 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">New</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            System Configuration
          </h2>
          
          <div className="space-y-4">
            <div className="neumorph p-4 rounded-lg">
              <h3 className="font-medium">Payment Gateway</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm">Status</span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-500 text-white">Online</span>
              </div>
            </div>
            
            <div className="neumorph p-4 rounded-lg">
              <h3 className="font-medium">Email Notifications</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm">Status</span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-500 text-white">Active</span>
              </div>
            </div>
            
            <div className="neumorph p-4 rounded-lg">
              <h3 className="font-medium">Database Backups</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm">Last Backup</span>
                <span className="text-sm">Today, 03:00 AM</span>
              </div>
            </div>
            
            <div className="neumorph p-4 rounded-lg">
              <h3 className="font-medium">System Security</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm">Last Scan</span>
                <span className="text-sm">Today, 06:15 AM</span>
              </div>
            </div>
          </div>
        </NeumorphicCard>
      </div>
    </DashboardLayout>
  );
}
