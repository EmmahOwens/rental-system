import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { assignTenantToLandlord } from '@/utils/profileUtils';

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
      
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          localStorage.setItem('verification_email', email);
          
          const otp = await sendVerificationEmail(email);
          
          throw new Error("EMAIL_NEEDS_VERIFICATION");
        } else {
          throw error;
        }
      }
      
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setCurrentOTP(otp);
    
    localStorage.setItem('verification_otp', otp);
    localStorage.setItem('verification_email', email);
    
    console.log(`Verification OTP for ${email}: ${otp}`);
    
    return otp;
  };

  const verifyEmail = async (otp: string) => {
    setIsLoading(true);
    
    const storedOTP = localStorage.getItem('verification_otp');
    const storedEmail = localStorage.getItem('verification_email');
    
    if (otp !== storedOTP) {
      setIsLoading(false);
      throw new Error('Invalid OTP');
    }
    
    try {
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          verified: true
        };
        
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            verified: true
          }
        });
        
        if (updateError) throw updateError;
        
        setCurrentUser(updatedUser);
        
        localStorage.removeItem('verification_otp');
        localStorage.removeItem('verification_email');
        
        setIsLoading(false);
        return updatedUser.role;
      } else if (pendingVerificationUser) {
        const userRole = pendingVerificationUser.role;
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: pendingVerificationUser.email,
            password: pendingVerificationUser.password
          });
          
          if (error) {
            console.error("Error signing in after verification:", error);
          } else if (data.user) {
            await supabase.auth.updateUser({
              data: {
                verified: true
              }
            });
          }
        } catch (signInError) {
          console.error("Error during post-verification sign in:", signInError);
        }
        
        setPendingVerificationUser(null);
        setCurrentOTP("");
        localStorage.removeItem('verification_otp');
        localStorage.removeItem('verification_email');
        
        setIsLoading(false);
        return userRole;
      }
    } catch (error) {
      console.error("Verification error:", error);
      setIsLoading(false);
      throw error;
    }
    
    setIsLoading(false);
    return 'tenant';
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
