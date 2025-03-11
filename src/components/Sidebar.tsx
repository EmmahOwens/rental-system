import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
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
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { useIconColor } from "@/hooks/use-icon-color";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  collapsed: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon: Icon, label, to, collapsed, onClick }: SidebarItemProps) {
  const iconColor = useIconColor();
  
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
          "hover:bg-primary/10 hover:text-primary",
          isActive ? "neumorph-inset text-primary font-medium" : "neumorph",
          collapsed ? "justify-center" : ""
        )
      }
    >
      <Icon 
        className="h-5 w-5"
        color={iconColor}
      />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}

export function Sidebar() {
  const { currentUser } = useAuth();
  const role = currentUser?.role;
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const iconColor = useIconColor();

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
      setCollapsed(false);
    }
  }, [isMobile]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

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
    { icon: Bell, label: "Notifications", to: "/notifications" },
    { icon: CalendarDays, label: "Calendar", to: "/calendar" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  const links = role === 'landlord' ? landlordLinks : tenantLinks;

  if (isMobile && !sidebarOpen) {
    return (
      <>
        <button 
          onClick={toggleSidebar}
          className="fixed z-20 top-16 left-4 neumorph p-2 rounded-full shadow-lg"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" color={iconColor} />
        </button>
      </>
    );
  }

  return (
    <>
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      <aside 
        className={cn(
          "transition-all duration-300 ease-in-out h-[calc(100vh-4rem)] overflow-y-auto",
          collapsed ? "w-16" : "w-64",
          isMobile ? "fixed z-20 bg-background shadow-xl" : "border-r border-border",
          !sidebarOpen && isMobile ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex flex-col gap-2 p-4">
          <div className="flex justify-end mb-2">
            <button 
              onClick={isMobile ? toggleSidebar : toggleCollapse}
              className="neumorph p-2 rounded-full"
              aria-label={isMobile ? "Close sidebar" : (collapsed ? "Expand sidebar" : "Collapse sidebar")}
            >
              {isMobile ? (
                <X className="h-4 w-4" color={iconColor} />
              ) : collapsed ? (
                <ChevronRight className="h-4 w-4" color={iconColor} />
              ) : (
                <ChevronLeft className="h-4 w-4" color={iconColor} />
              )}
            </button>
          </div>
          
          {links.map((link) => (
            <SidebarItem
              key={link.to}
              icon={link.icon}
              label={link.label}
              to={link.to}
              collapsed={collapsed}
              onClick={closeSidebar}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
