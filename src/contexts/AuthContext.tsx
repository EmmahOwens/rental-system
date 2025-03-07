
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types for our user roles
export type UserRole = 'tenant' | 'landlord';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  verified: boolean;
}

// Mock users for demonstration
const MOCK_USERS = {
  'admin@rental.com': {
    id: 'admin-1',
    email: 'admin@rental.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'landlord' as UserRole,
    verified: true
  },
  'tenant@example.com': {
    id: 'tenant-1',
    email: 'tenant@example.com',
    name: 'Test Tenant',
    password: 'tenant123',
    role: 'tenant' as UserRole,
    verified: true
  }
};

// OTP generation function
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

type AuthContextType = {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string, role: UserRole, adminCode?: string) => Promise<void>;
  logout: () => void;
  sendVerificationEmail: (email: string) => Promise<string>;
  verifyEmail: (otp: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerificationUser, setPendingVerificationUser] = useState<any>(null);
  const [currentOTP, setCurrentOTP] = useState<string>("");

  useEffect(() => {
    // Check for logged in user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = (MOCK_USERS as any)[email];
    
    if (!mockUser || mockUser.password !== password) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    // Create user object without the password
    const { password: _, ...userWithoutPassword } = mockUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  // Mock signup function (can now handle tenant and landlord signups)
  const signup = async (email: string, name: string, password: string, role: UserRole, adminCode?: string) => {
    setIsLoading(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if ((MOCK_USERS as any)[email]) {
      setIsLoading(false);
      throw new Error('User already exists');
    }

    // If role is landlord, check admin code
    if (role === 'landlord') {
      if (adminCode !== 'Admin256') {
        setIsLoading(false);
        throw new Error('Invalid admin registration code');
      }
    }

    // Create new user (not stored in MOCK_USERS since this is just a mock implementation)
    const newUser = {
      id: `${role}-${Date.now()}`,
      email,
      name,
      role,
      verified: false
    };

    // Store user for verification
    setPendingVerificationUser({ ...newUser, password });
    
    setIsLoading(false);
    return;
  };

  // Mock send verification email with OTP
  const sendVerificationEmail = async (email: string) => {
    // Generate an OTP
    const otp = generateOTP();
    setCurrentOTP(otp);
    
    // In a real implementation, this would send an email with OTP
    console.log(`Verification email sent to ${email}. OTP: ${otp}`);
    
    // For demo purposes, we'll return the OTP so we can display it
    return otp;
  };

  // Mock verify email with OTP
  const verifyEmail = async (otp: string) => {
    setIsLoading(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check OTP
    if (otp !== currentOTP) {
      setIsLoading(false);
      throw new Error('Invalid OTP');
    }

    // Update the user to be verified
    if (pendingVerificationUser) {
      const verifiedUser = {
        ...pendingVerificationUser,
        verified: true
      };
      
      // Remove password before setting in state
      const { password: _, ...userWithoutPassword } = verifiedUser;
      
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setPendingVerificationUser(null);
      setCurrentOTP("");
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    sendVerificationEmail,
    verifyEmail
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
