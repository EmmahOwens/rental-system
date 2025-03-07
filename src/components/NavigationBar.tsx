
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { House, LogOut } from "lucide-react";

export function NavigationBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <House className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">CozyLeases</h1>
        </div>

        <div className="flex items-center space-x-4">
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
