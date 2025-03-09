
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { Home, Users, MessageSquare, CreditCard, Bell, Calendar, PieChart, Building, ArrowUpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Format UGX currency
const formatUGX = (amount: number) => {
  return `UGX ${amount.toLocaleString("en-UG")}`;
};

export default function LandlordDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const landlordMetrics = [
    { icon: Building, label: "Total Properties", value: "12" },
    { icon: Users, label: "Active Tenants", value: "28" },
    { icon: CreditCard, label: "Monthly Revenue", value: formatUGX(32400000) },
    { icon: PieChart, label: "Occupancy Rate", value: "92%" },
    { icon: Bell, label: "Pending Actions", value: "5" },
    { icon: ArrowUpCircle, label: "Growth", value: "+8.5%" },
  ];

  // Fetch recent messages
  useEffect(() => {
    const fetchRecentMessages = async () => {
      if (!currentUser?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id(
              first_name,
              last_name
            )
          `)
          .eq('receiver_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        
        setRecentMessages(data.map(msg => ({
          id: msg.id,
          senderId: msg.sender_id,
          senderName: msg.sender ? `${msg.sender.first_name} ${msg.sender.last_name}`.trim() : 'Unknown Tenant',
          content: msg.content,
          timestamp: formatTimestamp(msg.created_at),
          isRead: msg.read
        })));
      } catch (error) {
        console.error("Error fetching recent messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMessages();
  }, [currentUser?.id]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Navigate to messages page
  const handleViewAllMessages = () => {
    navigate('/messages');
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Landlord Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.name}. Here's an overview of your properties and tenants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {landlordMetrics.map((metric, index) => (
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
            <Users className="h-5 w-5 text-primary" />
            Recent Applications
          </h2>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="neumorph p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">John Doe</h3>
                    <p className="text-sm text-muted-foreground">Applied for Sunset Apartments, #{200 + i}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">New</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="neumorph-button text-sm py-1">View</button>
                  <button className="neumorph-button text-sm py-1 bg-primary text-primary-foreground">Approve</button>
                </div>
              </div>
            ))}
            
            <button className="neumorph-button w-full mt-2">View All Applications</button>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Recent Messages
          </h2>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading messages...</div>
            ) : recentMessages.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No recent messages
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="neumorph p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{msg.senderName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {msg.content.length > 60 ? `${msg.content.substring(0, 60)}...` : msg.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{msg.timestamp}</p>
                    </div>
                    {!msg.isRead && (
                      <span className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">New</span>
                    )}
                  </div>
                </div>
              ))
            )}
            
            <button 
              className="neumorph-button w-full mt-2"
              onClick={handleViewAllMessages}
            >
              View All Messages
            </button>
          </div>
        </NeumorphicCard>
      </div>
    </DashboardLayout>
  );
}
