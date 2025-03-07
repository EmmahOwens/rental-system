
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Moon, Save, Sun, User, Shield, DollarSign, BellRing, Mail, Phone } from "lucide-react";

export default function Settings() {
  const { currentUser, updateUserProfile } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState(currentUser?.firstName || "");
  const [lastName, setLastName] = useState(currentUser?.lastName || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [maintenanceUpdates, setMaintenanceUpdates] = useState(true);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUserProfile({
        firstName,
        lastName,
        phone
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <NeumorphicCard className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Settings
          </h2>
          
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="neumorph-input w-full"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="neumorph-input w-full"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="neumorph-input w-full bg-muted cursor-not-allowed"
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
                placeholder="+256 70 123 4567"
                className="neumorph-input w-full"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="neumorph-button bg-primary text-primary-foreground flex items-center gap-2 mt-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
              {loading && <span className="ml-2 animate-spin">⟳</span>}
            </button>
          </form>
        </NeumorphicCard>
        
        <NeumorphicCard className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" />
            Notification Preferences
          </h2>
          
          <form onSubmit={handleSaveNotifications} className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 neumorph rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <label htmlFor="emailNotifications" className="text-sm font-medium">Email Notifications</label>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 neumorph rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <label htmlFor="smsNotifications" className="text-sm font-medium">SMS Notifications</label>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={smsNotifications}
                    onChange={() => setSmsNotifications(!smsNotifications)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 neumorph rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <label htmlFor="paymentReminders" className="text-sm font-medium">Payment Reminders</label>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="paymentReminders"
                    checked={paymentReminders}
                    onChange={() => setPaymentReminders(!paymentReminders)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 neumorph rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <label htmlFor="maintenanceUpdates" className="text-sm font-medium">Maintenance Updates</label>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="maintenanceUpdates"
                    checked={maintenanceUpdates}
                    onChange={() => setMaintenanceUpdates(!maintenanceUpdates)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className="neumorph-button bg-primary text-primary-foreground flex items-center gap-2 mt-2"
            >
              <Save className="h-4 w-4" />
              Save Preferences
            </button>
          </form>
        </NeumorphicCard>
      </div>
      
      <NeumorphicCard className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          {isDarkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
          Appearance
        </h2>
        
        <div className="flex items-center justify-between p-4 neumorph rounded-lg">
          <div>
            <h3 className="font-medium">Dark Mode</h3>
            <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
          </div>
          
          <button
            onClick={toggleTheme}
            className="neumorph p-2 rounded-full h-10 w-10 flex items-center justify-center"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </NeumorphicCard>
    </DashboardLayout>
  );
}
