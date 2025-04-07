import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';
import { assignTenantToLandlord } from '@/utils/profileUtils';
import { toast } from '@/components/ui/use-toast';

// Types for our user roles
export type UserRole = 'tenant' | 'landlord' | 'admin';

// User interface - renamed to AppUser to avoid conflict with Supabase User
export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  verified: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

type AuthContextType = {
  currentUser: AppUser | null;
  isLoading: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string, role: UserRole, adminCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (userData: Partial<AppUser>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        
        if (session?.user) {
          const userData: AppUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.name || '',
            role: session.user.user_metadata.role || 'tenant',
            verified: true,
            firstName: session.user.user_metadata.firstName || '',
            lastName: session.user.user_metadata.lastName || '',
            phone: session.user.user_metadata.phone || ''
          };
          console.log("Setting current user from auth change:", userData);
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      }
    );
    
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        
        setSession(session);
        
        if (session?.user) {
          const userData: AppUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.name || '',
            role: session.user.user_metadata.role || 'tenant',
            verified: true,
            firstName: session.user.user_metadata.firstName || '',
            lastName: session.user.user_metadata.lastName || '',
            phone: session.user.user_metadata.phone || ''
          };
          console.log("Setting current user from initial session:", userData);
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Login successful:", data);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Failed to sign in. Please check your credentials.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string, role: UserRole, adminCode?: string) => {
    setIsLoading(true);
    
    try {
      if (role === 'landlord') {
        if (adminCode !== 'Admin256') {
          toast({
            title: "Invalid admin code",
            description: "The admin registration code is incorrect.",
            variant: "destructive"
          });
          throw new Error('Invalid admin registration code');
        }
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            verified: true
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive"
        });
        throw new Error(error.message);
      }
      
      console.log("User signed up:", data);
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
      
      if (role === 'tenant' && data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", data.user.id)
          .single();
          
        if (!profileError && profileData) {
          await assignTenantToLandlord(profileData.id);
        }
      }
      
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      console.log("Reset password redirect URL:", redirectTo);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      
      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive"
        });
        throw new Error(error.message);
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during logout:", error);
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive"
        });
        throw new Error(error.message);
      }
      
      setCurrentUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error("Caught error during logout:", error);
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<AppUser>) => {
    if (!currentUser) {
      toast({
        title: "Update failed",
        description: "No authenticated user",
        variant: "destructive"
      });
      throw new Error('No authenticated user');
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          ...userData
        }
      });
      
      if (error) {
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive"
        });
        throw new Error(error.message);
      }
      
      setCurrentUser({
        ...currentUser,
        ...userData
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
    session,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
