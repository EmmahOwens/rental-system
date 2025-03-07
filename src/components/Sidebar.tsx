
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { 
  Home, 
  MessageSquare, 
  CreditCard, 
  Users, 
  UserPlus, 
  Bell, 
  Settings,
  CalendarDays,
  Activity,
  HelpCircle
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

function SidebarItem({ icon: Icon, label, to }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
          "hover:bg-primary/10 hover:text-primary",
          isActive ? "neumorph-inset text-primary font-medium" : "neumorph"
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  );
}

export function Sidebar() {
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  const tenantLinks = [
    { icon: Home, label: "Dashboard", to: "/dashboard" },
    { icon: CreditCard, label: "Payments", to: "/payments" },
    { icon: MessageSquare, label: "Messages", to: "/messages" },
    { icon: Bell, label: "Notifications", to: "/notifications" },
    { icon: CalendarDays, label: "Calendar", to: "/calendar" },
    { icon: HelpCircle, label: "Support", to: "/support" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  const landlordLinks = [
    { icon: Home, label: "Dashboard", to: "/dashboard" },
    { icon: Users, label: "Tenants", to: "/tenants" },
    { icon: CreditCard, label: "Payments", to: "/payments" },
    { icon: MessageSquare, label: "Messages", to: "/messages" },
    { icon: UserPlus, label: "Applications", to: "/applications" },
    { icon: Activity, label: "Analytics", to: "/analytics" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  const links = role === 'landlord' ? landlordLinks : tenantLinks;

  return (
    <aside className="w-64 p-4 border-r border-border h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <SidebarItem
            key={link.to}
            icon={link.icon}
            label={link.label}
            to={link.to}
          />
        ))}
      </div>
    </aside>
  );
}
