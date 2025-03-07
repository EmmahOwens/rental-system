
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { Bell, CheckCircle, Clock, Info, AlertTriangle } from "lucide-react";

export default function Notifications() {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "Rent Payment Reminder",
      message: "Your rent payment of UGX 1,200,000 is due in 5 days.",
      time: "Today, 10:30 AM",
      type: "reminder",
      read: false,
    },
    {
      id: 2,
      title: "Maintenance Request Update",
      message: "Your maintenance request #1234 has been approved.",
      time: "Yesterday, 2:15 PM",
      type: "success",
      read: false,
    },
    {
      id: 3,
      title: "New Property Policy",
      message: "We've updated our property usage guidelines. Please review them.",
      time: "May 15, 2023",
      type: "info",
      read: true,
    },
    {
      id: 4,
      title: "Security Alert",
      message: "There will be a security system test on June 1st between 10AM-12PM.",
      time: "May 10, 2023",
      type: "alert",
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "info":
        return <Info className="h-5 w-5 text-primary" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with important announcements and alerts</p>
      </div>

      <NeumorphicCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            All Notifications
          </h2>
          <button className="neumorph-button text-sm">Mark all as read</button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-4 neumorph rounded-lg ${!notification.read ? 'border-l-4 border-primary' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 neumorph rounded-full">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </NeumorphicCard>
    </DashboardLayout>
  );
}
