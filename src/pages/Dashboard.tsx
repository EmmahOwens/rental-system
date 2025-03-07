
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { Home, Users, MessageSquare, CreditCard, Bell, Calendar, PieChart } from "lucide-react";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const isLandlord = currentUser?.role === 'landlord';

  const tenantMetrics = [
    { icon: Home, label: "Current Property", value: "Sunset Apartments, #304" },
    { icon: CreditCard, label: "Next Payment", value: "June 1, 2023 - $1,200" },
    { icon: MessageSquare, label: "Unread Messages", value: "2" },
    { icon: Bell, label: "Notifications", value: "3" },
    { icon: Calendar, label: "Upcoming Events", value: "Maintenance: May 25" },
  ];

  const landlordMetrics = [
    { icon: Home, label: "Total Properties", value: "12" },
    { icon: Users, label: "Active Tenants", value: "28" },
    { icon: CreditCard, label: "Monthly Revenue", value: "$32,400" },
    { icon: PieChart, label: "Occupancy Rate", value: "92%" },
    { icon: Bell, label: "Pending Actions", value: "5" },
  ];

  const metrics = isLandlord ? landlordMetrics : tenantMetrics;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.name}</h1>
        <p className="text-muted-foreground">
          {isLandlord
            ? "Here's an overview of your properties and tenants"
            : "Here's an overview of your rental status"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <NeumorphicCard className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            {isLandlord ? (
              <>
                <Users className="h-5 w-5 text-primary" />
                Recent Applications
              </>
            ) : (
              <>
                <Bell className="h-5 w-5 text-primary" />
                Recent Notifications
              </>
            )}
          </h2>
          
          <div className="space-y-4">
            {isLandlord ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="neumorph p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">John Doe</h3>
                      <p className="text-sm text-muted-foreground">Applied for Sunset Apartments, #201</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">New</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="neumorph-button text-sm py-1">View</button>
                    <button className="neumorph-button text-sm py-1 bg-primary text-primary-foreground">Approve</button>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="neumorph p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Rent Reminder</h3>
                      <p className="text-sm text-muted-foreground">Your rent payment is due in 5 days</p>
                      <p className="text-xs text-muted-foreground mt-1">May 25, 2023</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">New</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Recent Messages
          </h2>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="neumorph p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {isLandlord ? `Tenant ${i}` : "Landlord"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isLandlord 
                        ? "Request for maintenance in apartment #304" 
                        : "Your maintenance request has been approved"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Today, 10:23 AM</p>
                  </div>
                  {i === 1 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">New</span>
                  )}
                </div>
              </div>
            ))}
            
            <button className="neumorph-button w-full mt-2">View All Messages</button>
          </div>
        </NeumorphicCard>
      </div>
    </DashboardLayout>
  );
}
