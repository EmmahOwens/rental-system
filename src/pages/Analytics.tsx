
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { BarChart, LineChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, PieChart, Pie, Cell } from "recharts";
import { Activity, TrendingUp, Users, CreditCard, Home, Calendar, Wrench } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { getLandlordAnalytics, getTenantAnalytics, AnalyticsSummary } from "@/utils/analyticsUtils";
import { Skeleton } from "@/components/ui/skeleton";

// Format UGX currency
const formatUGX = (value: number) => {
  return `UGX ${value.toLocaleString("en-UG")}`;
};

// Colors for charts
const COLORS = ['#8b5cf6', '#6d28d9', '#4c1d95', '#a78bfa', '#c4b5fd'];

export default function Analytics() {
  const { profile } = useProfile();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!profile) return;
      
      setLoading(true);
      try {
        if (profile.user_type === 'landlord') {
          const data = await getLandlordAnalytics(profile.id);
          setAnalytics(data);
        } else if (profile.user_type === 'tenant') {
          const data = await getTenantAnalytics(profile.id);
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [profile]);

  // Render loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  // Render different dashboards based on user type
  return (
    <DashboardLayout>
      {profile?.user_type === 'landlord' ? (
        <LandlordAnalytics analytics={analytics} />
      ) : (
        <TenantAnalytics analytics={analytics} />
      )}
    </DashboardLayout>
  );
}

function LandlordAnalytics({ analytics }: { analytics: AnalyticsSummary | null }) {
  if (!analytics) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <NeumorphicCard icon={<Home />} title="Properties" value={analytics.totalProperties?.toString() || "0"} />
        <NeumorphicCard 
          icon={<Activity />} 
          title="Occupancy Rate" 
          value={`${analytics.occupancyRate?.toFixed(1) || "0"}%`} 
        />
        <NeumorphicCard 
          icon={<Users />} 
          title="Total Tenants" 
          value={analytics.totalTenants?.toString() || "0"} 
        />
        <NeumorphicCard 
          icon={<CreditCard />} 
          title="Total Revenue" 
          value={formatUGX(analytics.totalRevenue || 0)} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenueByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000)}K`} />
              <Tooltip formatter={(value) => formatUGX(Number(value))} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="paid" 
                stroke="#8b5cf6" 
                name="Paid" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="#f59e0b" 
                name="Pending" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Home className="mr-2 h-5 w-5" />
            Occupancy by Property
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.occupancyByProperty || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="property" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="occupied" name="Occupied Units" fill="#8b5cf6" />
              <Bar dataKey="total" name="Total Units" fill="#c4b5fd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Wrench className="mr-2 h-5 w-5" />
            Maintenance Requests
          </h3>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pending', value: analytics.maintenanceStats?.pending || 0 },
                    { name: 'In Progress', value: analytics.maintenanceStats?.inProgress || 0 },
                    { name: 'Completed', value: analytics.maintenanceStats?.completed || 0 },
                    { name: 'Cancelled', value: analytics.maintenanceStats?.cancelled || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {[
                    { name: 'Pending', value: analytics.maintenanceStats?.pending || 0 },
                    { name: 'In Progress', value: analytics.maintenanceStats?.inProgress || 0 },
                    { name: 'Completed', value: analytics.maintenanceStats?.completed || 0 },
                    { name: 'Cancelled', value: analytics.maintenanceStats?.cancelled || 0 }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Requests']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Upcoming Payments
          </h3>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
            <p className="text-amber-800 font-medium">Pending Payments: {formatUGX(analytics.pendingPayments || 0)}</p>
          </div>
          {/* This could be expanded with a list of upcoming payments */}
          <p className="text-gray-500 text-center mt-8">
            Detailed payment schedule coming soon
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Payment History
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.revenueByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000)}K`} />
              <Tooltip formatter={(value) => formatUGX(Number(value))} />
              <Legend />
              <Bar dataKey="paid" name="Paid" fill="#8b5cf6" />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Wrench className="mr-2 h-5 w-5" />
            Maintenance Requests
          </h3>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pending', value: analytics.maintenanceStats?.pending || 0 },
                    { name: 'In Progress', value: analytics.maintenanceStats?.inProgress || 0 },
                    { name: 'Completed', value: analytics.maintenanceStats?.completed || 0 },
                    { name: 'Cancelled', value: analytics.maintenanceStats?.cancelled || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {[
                    { name: 'Pending', value: analytics.maintenanceStats?.pending || 0 },
                    { name: 'In Progress', value: analytics.maintenanceStats?.inProgress || 0 },
                    { name: 'Completed', value: analytics.maintenanceStats?.completed || 0 },
                    { name: 'Cancelled', value: analytics.maintenanceStats?.cancelled || 0 }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Requests']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

function TenantAnalytics({ analytics }: { analytics: AnalyticsSummary | null }) {
  if (!analytics) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <NeumorphicCard 
          icon={<CreditCard />} 
          title="Total Paid" 
          value={formatUGX(analytics.totalRevenue || 0)} 
        />
        <NeumorphicCard 
          icon={<Activity />} 
          title="Pending Payments" 
          value={formatUGX(analytics.pendingPayments || 0)} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Payment History
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.revenueByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000)}K`} />
              <Tooltip formatter={(value) => formatUGX(Number(value))} />
              <Legend />
              <Bar dataKey="paid" name="Paid" fill="#8b5cf6" />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Wrench className="mr-2 h-5 w-5" />
            Maintenance Requests
          </h3>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pending', value: analytics.maintenanceStats?.pending || 0 },
                    { name: 'In Progress', value: analytics.maintenanceStats?.inProgress || 0 },
                    { name: 'Completed', value: analytics.maintenanceStats?.completed || 0 },
                    { name: 'Cancelled', value: analytics.maintenanceStats?.cancelled || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {[
                    { name: 'Pending', value: analytics.maintenanceStats?.pending || 0 },
                    { name: 'In Progress', value: analytics.maintenanceStats?.inProgress || 0 },
                    { name: 'Completed', value: analytics.maintenanceStats?.completed || 0 },
                    { name: 'Cancelled', value: analytics.maintenanceStats?.cancelled || 0 }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Requests']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
