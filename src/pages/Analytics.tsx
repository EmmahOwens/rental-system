
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { BarChart, LineChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line } from "recharts";
import { Activity, TrendingUp, Users, CreditCard, Home, Calendar } from "lucide-react";

// Format UGX currency
const formatUGX = (value: number) => {
  return `UGX ${value.toLocaleString("en-UG")}`;
};

export default function Analytics() {
  // Mock data for charts
  const revenueData = [
    { name: "Jan", revenue: 28000000 },
    { name: "Feb", revenue: 29500000 },
    { name: "Mar", revenue: 30200000 },
    { name: "Apr", revenue: 31000000 },
    { name: "May", revenue: 32400000 },
    { name: "Jun", revenue: 33100000 },
  ];

  const occupancyData = [
    { name: "Jan", rate: 88 },
    { name: "Feb", rate: 90 },
    { name: "Mar", rate: 92 },
    { name: "Apr", rate: 91 },
    { name: "May", rate: 92 },
    { name: "Jun", rate: 94 },
  ];

  const propertyPerformanceData = [
    { name: "Sunset Apts", revenue: 14500000, occupancy: 96 },
    { name: "Lakeside", revenue: 9200000, occupancy: 92 },
    { name: "Green Valley", revenue: 6500000, occupancy: 86 },
    { name: "Downtown", revenue: 2200000, occupancy: 78 },
  ];

  const tenantTurnoverData = [
    { name: "Q1", new: 8, leaving: 3 },
    { name: "Q2", new: 6, leaving: 4 },
    { name: "Q3", new: 9, leaving: 5 },
    { name: "Q4", new: 5, leaving: 2 },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track performance metrics for your properties</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <NeumorphicCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">{formatUGX(32400000)}</p>
              <p className="text-xs text-green-500 mt-1">↑ 5.2% from last month</p>
            </div>
            <div className="p-3 neumorph rounded-full">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Properties</p>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-green-500 mt-1">↑ 1 new this month</p>
            </div>
            <div className="p-3 neumorph rounded-full">
              <Home className="h-6 w-6 text-primary" />
            </div>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Tenants</p>
              <p className="text-2xl font-bold">28</p>
              <p className="text-xs text-green-500 mt-1">↑ 2 new this month</p>
            </div>
            <div className="p-3 neumorph rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Occupancy Rate</p>
              <p className="text-2xl font-bold">92%</p>
              <p className="text-xs text-green-500 mt-1">↑ 2% from last month</p>
            </div>
            <div className="p-3 neumorph rounded-full">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </NeumorphicCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <NeumorphicCard className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Monthly Revenue Trend
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value: number) => [formatUGX(value), "Revenue"]} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Occupancy Rate Trend
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[80, 100]} />
                <Tooltip formatter={(value: number) => [`${value}%`, "Occupancy Rate"]} />
                <Legend />
                <Bar dataKey="rate" fill="#82ca9d" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeumorphicCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <NeumorphicCard className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Property Performance
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${value / 1000000}M`} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === "revenue") return [formatUGX(value), "Revenue"];
                    return [`${value}%`, "Occupancy"];
                  }} 
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" barSize={30} />
                <Bar yAxisId="right" dataKey="occupancy" fill="#82ca9d" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Tenant Turnover
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenantTurnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new" fill="#82ca9d" name="New Tenants" barSize={30} />
                <Bar dataKey="leaving" fill="#ff7777" name="Leaving Tenants" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeumorphicCard>
      </div>
    </DashboardLayout>
  );
}
