
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
function ProtectedRoute({ children, requiredRole }: { children: JSX.Element, requiredRole?: 'tenant' | 'landlord' | 'admin' }) {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    // If user doesn't have the required role, redirect to the appropriate dashboard
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (currentUser.role === 'landlord') {
      return <Navigate to="/landlord/dashboard" />;
    } else {
      return <Navigate to="/tenant/dashboard" />;
    }
  }
  
  return children;
}

// RoleBasedDashboard component to handle redirection based on user role
function RoleBasedDashboard() {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  switch (currentUser.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'landlord':
      return <Navigate to="/landlord/dashboard" replace />;
    case 'tenant':
      return <Navigate to="/tenant/dashboard" replace />;
    default:
      return <Navigate to="/tenant/dashboard" replace />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              {/* Dashboard router */}
              <Route path="/dashboard" element={<RoleBasedDashboard />} />
              
              {/* Role-specific dashboards */}
              <Route path="/tenant/dashboard" element={
                <ProtectedRoute requiredRole="tenant">
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/landlord/dashboard" element={
                <ProtectedRoute requiredRole="landlord">
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
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
);

export default App;
