
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { House, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";

export function NavigationBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

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

  // Format date without timezone dependency
  const formattedTime = format(
    currentTime,
    'MMM d, yyyy - h:mm:ss a'
  );

  return (
    <header className="w-full p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <House className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Rental Management System</h1>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm hidden md:inline">{formattedTime}</span>
          {currentUser && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {currentUser.name} ({currentUser.role})
              </span>
              <button 
                onClick={handleLogout}
                className="neumorph-button flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
