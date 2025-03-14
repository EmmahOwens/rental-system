
import React from 'react'; // Add React import
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import TenantDashboard from "./pages/TenantDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import Payments from "./pages/Payments";
import Messages from "./pages/Messages";
import Tenants from "./pages/Tenants";
import Applications from "./pages/Applications";
import Notifications from "./pages/Notifications";
import Calendar from "./pages/Calendar";
import Support from "./pages/Support";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
function ProtectedRoute({ children, requiredRole }: { children: JSX.Element, requiredRole?: 'tenant' | 'landlord' }) {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    console.log("Loading user data in ProtectedRoute...");
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!currentUser) {
    console.log("No user found in ProtectedRoute, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    console.log(`User role ${currentUser.role} doesn't match required role ${requiredRole}, redirecting`);
    // If user doesn't have the required role, redirect to the appropriate dashboard
    if (currentUser.role === 'landlord') {
      return <Navigate to="/landlord/dashboard" replace />;
    } else {
      return <Navigate to="/tenant/dashboard" replace />;
    }
  }
  
  return children;
}

// RoleBasedDashboard component to handle redirection based on user role
function RoleBasedDashboard() {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    console.log("Loading user data in RoleBasedDashboard...");
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!currentUser) {
    console.log("No current user in RoleBasedDashboard, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("RoleBasedDashboard - Redirecting based on role:", currentUser.role);
  
  // Explicit redirection based on role
  if (currentUser.role === 'landlord') {
    console.log("RoleBasedDashboard - Redirecting to landlord dashboard");
    return <Navigate to="/landlord/dashboard" replace />;
  } else if (currentUser.role === 'tenant') {
    console.log("RoleBasedDashboard - Redirecting to tenant dashboard");
    return <Navigate to="/tenant/dashboard" replace />;
  } else {
    console.log("RoleBasedDashboard - Unknown role, defaulting to tenant dashboard");
    return <Navigate to="/tenant/dashboard" replace />;
  }
}

// Keep only one App component definition
const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                
                {/* Dashboard router */}
                <Route path="/dashboard" element={<RoleBasedDashboard />} />
                
                {/* Role-specific dashboards */}
                <Route path="/tenant/dashboard" element={
                  <ProtectedRoute requiredRole="tenant">
                    <TenantDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/landlord/dashboard" element={
                  <ProtectedRoute requiredRole="landlord">
                    <LandlordDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Protected routes */}
                <Route path="/payments" element={
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
                <Route path="/calendar" element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                } />
                <Route path="/support" element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                
                {/* Landlord only routes */}
                <Route path="/tenants" element={
                  <ProtectedRoute requiredRole="landlord">
                    <Tenants />
                  </ProtectedRoute>
                } />
                <Route path="/applications" element={
                  <ProtectedRoute requiredRole="landlord">
                    <Applications />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute requiredRole="landlord">
                    <Analytics />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
