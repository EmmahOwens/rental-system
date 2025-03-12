import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

// Types for our user roles
export type UserRole = 'tenant' | 'landlord' | 'admin';

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
  signup: (email: string, name: string, password: string, role: UserRole, adminCode?: string) => Promise<string>;
  logout: () => Promise<void>;
  sendVerificationEmail: (email: string) => Promise<string>;
  verifyEmail: (otp: string) => Promise<UserRole>;
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
    const checkUser = async () => {
      setIsLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log("User metadata:", user.user_metadata);
          
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
          
          console.log("User data loaded:", userData);
          setCurrentUser(userData);
        }
      }
      
      setIsLoading(false);
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_IN' && session) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log("User metadata after sign in:", user.user_metadata);
          
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
          
          console.log("User signed in:", userData);
          setCurrentUser(userData);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setCurrentUser(null);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw new Error(error.message);
      
      console.log("Login successful:", data);
    } catch (error: any) {
      console.error("Login error:", error);
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
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw new Error(error.message);
      
      console.log("User signed up:", data);
      console.log("User role during signup:", role);
      
      const userForVerification = {
        email,
        name,
        role,
        password
      };
      setPendingVerificationUser(userForVerification);
      
      const otp = await sendVerificationEmail(email);
      return email;
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async (email: string) => {
    const otp = generateOTP();
    setCurrentOTP(otp);
    
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/verify-email`,
      });
      
      console.log(`Real verification email requested for ${email}`);
      console.log(`Demo OTP for ${email}: ${otp}`);
      
      return otp;
    } catch (emailError) {
      console.error("Error sending real email:", emailError);
      console.log(`Verification OTP for ${email}: ${otp}`);
      return otp;
    }
  };

  const verifyEmail = async (otp: string) => {
    setIsLoading(true);
    
    if (otp !== currentOTP) {
      setIsLoading(false);
      throw new Error('Invalid OTP');
    }
    
    if (pendingVerificationUser) {
      const { email, password, role, name } = pendingVerificationUser;
      
      console.log("Verifying user with role:", role);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Error signing in after verification:", error);
        setIsLoading(false);
        throw new Error(`Error signing in after verification: ${error.message}`);
      }
      
      console.log("Successfully signed in after verification:", data);
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name,
          role,
          verified: true
        }
      });
      
      if (updateError) {
        console.error("Error updating user verification status:", updateError);
      } else {
        console.log("Successfully updated user metadata with role:", role);
      }
      
      setPendingVerificationUser(null);
      setCurrentOTP("");
      
      setIsLoading(false);
      return role;
    }
    
    setIsLoading(false);
    throw new Error('No pending verification user');
  };

  const resetPassword = async (email: string) => {
    const redirectTo = `${window.location.origin}/reset-password`;
    console.log("Reset password redirect URL:", redirectTo);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    
    if (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during logout:", error);
        throw new Error(error.message);
      }
      
      setCurrentUser(null);
    } catch (error) {
      console.error("Caught error during logout:", error);
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!currentUser) {
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
        throw new Error(error.message);
      }
      
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
