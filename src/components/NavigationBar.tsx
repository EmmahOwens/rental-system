
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { House, LogOut, User } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIconColor } from "@/hooks/use-icon-color";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavigationBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const isMobile = useIsMobile();
  const iconColor = useIconColor();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formattedTime = format(
    currentTime,
    'MMM d, yyyy - h:mm a'
  );

  return (
    <header className="w-full p-3 md:p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <House className="h-5 w-5 md:h-6 md:w-6 text-primary" color={iconColor} />
          <h1 className="text-lg md:text-xl font-semibold truncate">
            {isMobile ? "RMS" : "Rental Management System"}
          </h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <span className="text-xs md:text-sm hidden md:inline">{formattedTime}</span>
          
          {currentUser && (
            <>
              {isMobile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="neumorph p-1 rounded-full">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{currentUser.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{currentUser.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{currentUser.role}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => navigate('/settings')}>
                      <User className="mr-2 h-4 w-4" color={iconColor} />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" color={iconColor} />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {currentUser.name} ({currentUser.role})
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="neumorph-button flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" color={iconColor} />
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
