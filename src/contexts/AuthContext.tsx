
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

// Types for our user roles
export type UserRole = 'tenant' | 'landlord';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  verified: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// OTP generation function
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

type AuthContextType = {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string, role: UserRole, adminCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: (email: string) => Promise<string>;
  verifyEmail: (otp: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerificationUser, setPendingVerificationUser] = useState<any>(null);
  const [currentOTP, setCurrentOTP] = useState<string>("");

  useEffect(() => {
    // Check for logged in user in Supabase
    const checkUser = async () => {
      setIsLoading(true);
      
      // Get session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        // Get user metadata for role
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const userData: User = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata.name || '',
            role: user.user_metadata.role || 'tenant',
            verified: user.email_confirmed_at ? true : false,
            firstName: user.user_metadata.firstName || '',
            lastName: user.user_metadata.lastName || '',
            phone: user.user_metadata.phone || ''
          };
          
          setCurrentUser(userData);
        }
      }
      
      setIsLoading(false);
    };
    
    checkUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const userData: User = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata.name || '',
            role: user.user_metadata.role || 'tenant',
            verified: user.email_confirmed_at ? true : false,
            firstName: user.user_metadata.firstName || '',
            lastName: user.user_metadata.lastName || '',
            phone: user.user_metadata.phone || ''
          };
          
          setCurrentUser(userData);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login function using Supabase
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    
    // User data is handled by the auth state listener
    setIsLoading(false);
  };

  // Signup function using Supabase
  const signup = async (email: string, name: string, password: string, role: UserRole, adminCode?: string) => {
    setIsLoading(true);
    
    // If role is landlord, check admin code
    if (role === 'landlord') {
      if (adminCode !== 'Admin256') {
        setIsLoading(false);
        throw new Error('Invalid admin registration code');
      }
    }
    
    // Create user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        }
      }
    });
    
    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    
    // Store temporary data for verification, including password
    const userForVerification = {
      email,
      name,
      role,
      password // Store password temporarily for verification
    };
    setPendingVerificationUser(userForVerification);
    
    setIsLoading(false);
  };

  // Send verification email with OTP
  const sendVerificationEmail = async (email: string) => {
    // Generate an OTP
    const otp = generateOTP();
    setCurrentOTP(otp);
    
    // Here we would normally send an email with OTP
    // For now, we'll just log it and return it for demo purposes
    console.log(`Verification OTP for ${email}: ${otp}`);
    
    // In a production app, we would send an email here using Supabase Edge Functions
    // await supabase.functions.invoke('send-verification-email', { body: { email, otp } });
    
    return otp;
  };

  // Verify email with OTP
  const verifyEmail = async (otp: string) => {
    setIsLoading(true);
    
    // Check OTP
    if (otp !== currentOTP) {
      setIsLoading(false);
      throw new Error('Invalid OTP');
    }
    
    // In a production environment, we would update verification status in Supabase
    // For now, we'll just simulate it
    if (pendingVerificationUser) {
      const verifiedUser = {
        ...pendingVerificationUser,
        verified: true
      };
      
      // In a real implementation we'd update Supabase metadata here
      
      const userRole = pendingVerificationUser.role;
      setPendingVerificationUser(null);
      setCurrentOTP("");
      
      setIsLoading(false);
      return userRole; // Return the user role for redirection
    }
    
    setIsLoading(false);
    return 'tenant'; // Default role if no pending user (fallback)
  };
  
  // Reset password function
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      throw new Error(error.message);
    }
  };

  // Logout function using Supabase
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
    
    setCurrentUser(null);
  };

  // Update user profile function
  const updateUserProfile = async (userData: Partial<User>) => {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    setIsLoading(true);
    
    try {
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          ...userData
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update local user state
      setCurrentUser({
        ...currentUser,
        ...userData
      });
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    sendVerificationEmail,
    verifyEmail,
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
