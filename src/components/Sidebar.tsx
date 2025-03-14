
// Remove duplicate import since useAuth is imported below
// Remove duplicate import since cn is already imported below
import { useState, useEffect, memo, useCallback } from "react";
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
  LogOut, 
  FileText,
  Wrench, // Changed from Tool to Wrench
  BarChart4,
  Building
} from "lucide-react";
import { NavLink } from "react-router-dom"; // Add this import for NavLink
import { useAuth } from "@/contexts/AuthContext"; // Fixed import path
import { useProfile } from "../hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile"; // Import only useIsMobile since useMediaQuery is not exported
import { useTheme } from "@/contexts/ThemeContext";
import { useIconColor } from "@/hooks/use-icon-color";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  collapsed: boolean;
  onClick?: () => void;
}

const SidebarItem = memo(function SidebarItem({ icon: Icon, label, to, collapsed, onClick }: SidebarItemProps) {
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
        size={20}
        className="shrink-0"
        color={iconColor}
      />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
});

export const Sidebar = memo(function Sidebar() {
  const { currentUser, logout } = useAuth();
  const { profile } = useProfile();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile(); // Use the imported useIsMobile hook instead
  const iconColor = useIconColor();
  
  const isLandlord = profile?.user_type === 'landlord';

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
      setCollapsed(false);
    }
  }, [isMobile]);

  const toggleCollapse = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const navItems = [
    {
      label: "Dashboard",
      icon: Home,
      href: isLandlord ? "/landlord-dashboard" : "/tenant-dashboard",
      showFor: ["tenant", "landlord"],
    },
    {
      label: "Properties",
      icon: Building,
      href: "/properties",
      showFor: ["landlord", "tenant"],
    },
    {
      label: isLandlord ? "Tenants" : "Landlord",
      icon: Users,
      href: isLandlord ? "/tenants" : "/landlord",
      showFor: ["tenant", "landlord"],
    },
    {
      label: "Messages",
      icon: MessageSquare,
      href: "/messages",
      showFor: ["tenant", "landlord"],
    },
    {
      label: "Payments",
      icon: CreditCard,
      href: "/payments",
      showFor: ["tenant", "landlord"],
    },
    {
      label: "Maintenance",
      icon: Wrench, // Changed from Tool to Wrench
      href: "/maintenance",
      showFor: ["tenant", "landlord"],
    },
    {
      label: "Documents",
      icon: FileText,
      href: "/documents",
      showFor: ["tenant", "landlord"],
    },
    {
      label: "Analytics",
      icon: BarChart4,
      href: "/analytics",
      showFor: ["tenant", "landlord"],
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      showFor: ["tenant", "landlord"],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !profile?.user_type || item.showFor.includes(profile.user_type)
  );

  return (
    <>
      {isMobile && !sidebarOpen ? (
        <button 
          onClick={toggleSidebar}
          className="fixed z-20 top-16 left-4 neumorph p-2 rounded-full shadow-lg"
          aria-label="Open menu"
        >
          <Menu size={20} color={iconColor} />
        </button>
      ) : (
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
                    <X size={20} color={iconColor} />
                  ) : collapsed ? (
                    <ChevronRight size={20} color={iconColor} />
                  ) : (
                    <ChevronLeft size={20} color={iconColor} />
                  )}
                </button>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-primary">RentalSystem</h2>
              </div>
              
              <nav className="flex-1 space-y-1">
                {filteredNavItems.map((item) => (
                  <SidebarItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    to={item.href}
                    collapsed={collapsed}
                    onClick={closeSidebar}
                  />
                ))}
              </nav>
              
              <div className="p-4 border-t mt-auto">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  {!collapsed && "Logout"}
                </Button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
});
