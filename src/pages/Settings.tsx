
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, User, Key, Globe, Bell, Phone, LogOut } from "lucide-react";

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("UGX");
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
    }, 1000);
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password Reset Email Sent",
      description: "Check your email for instructions to reset your password.",
    });
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="space-y-6">
          {/* Profile Settings */}
          <NeumorphicCard className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-primary" />
              <span>Profile Information</span>
            </h2>
            
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="neumorph-input w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={currentUser?.email}
                    disabled
                    className="neumorph-input w-full opacity-70"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="neumorph-input w-full"
                    placeholder="+256 XXX XXX XXX"
                  />
                </div>
                
                <button
                  type="submit"
                  className="neumorph-button mt-4"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </NeumorphicCard>
          
          {/* Account Settings */}
          <NeumorphicCard className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Key className="h-5 w-5 text-primary" />
              <span>Account Settings</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Account Type</p>
                <div className="neumorph-inset px-4 py-2 rounded-lg">
                  <span className="capitalize">{currentUser?.role || "Tenant"}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Change Password</p>
                <button
                  onClick={handleChangePassword}
                  className="neumorph-button"
                >
                  Reset Password
                </button>
              </div>
              
              <div className="pt-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="neumorph-button bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </NeumorphicCard>
          
          {/* Preferences */}
          <NeumorphicCard className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Globe className="h-5 w-5 text-primary" />
              <span>Preferences</span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="neumorph p-3 rounded-full"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>
              </div>
              
              <div>
                <label htmlFor="language" className="block text-sm font-medium mb-1">Language</label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="neumorph-input w-full"
                >
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                  <option value="lg">Luganda</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium mb-1">Currency</label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="neumorph-input w-full"
                >
                  <option value="UGX">Ugandan Shilling (UGX)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates and alerts via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    className="sr-only peer"
                  />
                  <div className="neumorph w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-primary after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
