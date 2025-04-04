
import { supabase } from "@/integrations/supabase/client";

export interface Payment {
  id: string;
  tenant_id: string;
  landlord_id: string;
  amount: number;
  payment_method: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
}

// Mock functions for payments
// These would be replaced with actual implementations once the payments table is properly configured

export const createPayment = async (
  tenantId: string,
  landlordId: string,
  amount: number,
  paymentMethod: string,
  description?: string
): Promise<Payment | null> => {
  try {
    console.log(`Mock: Creating payment from tenant ${tenantId} to landlord ${landlordId}`);
    
    return {
      id: `mock-${Date.now()}`,
      tenant_id: tenantId,
      landlord_id: landlordId,
      amount,
      payment_method: paymentMethod,
      description,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in createPayment:", error);
    return null;
  }
};

export const getPaymentStats = async (
  userId: string, 
  userType: 'tenant' | 'landlord'
): Promise<{
  totalPaid: number;
  pendingAmount: number;
  monthlyData: Array<{ month: string; paid: number; pending: number }>;
}> => {
  try {
    console.log(`Mock: Getting payment stats for ${userType} ${userId}`);
    
    // Mock data
    return {
      totalPaid: userType === 'tenant' ? 3600 : 12500,
      pendingAmount: userType === 'tenant' ? 1200 : 2300,
      monthlyData: [
        { month: '2023-01', paid: userType === 'tenant' ? 1200 : 10000, pending: userType === 'tenant' ? 0 : 1500 },
        { month: '2023-02', paid: userType === 'tenant' ? 1200 : 11000, pending: userType === 'tenant' ? 0 : 1200 },
        { month: '2023-03', paid: userType === 'tenant' ? 1200 : 12500, pending: userType === 'tenant' ? 1200 : 2300 }
      ]
    };
  } catch (error) {
    console.error("Error in getPaymentStats:", error);
    return { totalPaid: 0, pendingAmount: 0, monthlyData: [] };
  }
};

export const getUserPayments = async (
  userId: string,
  userType: 'tenant' | 'landlord'
): Promise<Payment[]> => {
  try {
    console.log(`Mock: Getting payments for ${userType} ${userId}`);
    
    // Mock data
    return [
      {
        id: `mock-${Date.now()}-1`,
        tenant_id: userType === 'tenant' ? userId : 'mock-tenant-id',
        landlord_id: userType === 'landlord' ? userId : 'mock-landlord-id',
        amount: 1200,
        payment_method: 'bank_transfer',
        description: 'March Rent',
        status: 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString()
      },
      {
        id: `mock-${Date.now()}-2`,
        tenant_id: userType === 'tenant' ? userId : 'mock-tenant-id',
        landlord_id: userType === 'landlord' ? userId : 'mock-landlord-id',
        amount: 1200,
        payment_method: 'bank_transfer',
        description: 'April Rent',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error("Error in getUserPayments:", error);
    return [];
  }
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: 'confirmed' | 'rejected'
): Promise<Payment | null> => {
  try {
    console.log(`Mock: Updating payment ${paymentId} status to ${status}`);
    
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    };
    
    if (status === 'confirmed') {
      updateData.confirmed_at = new Date().toISOString();
    }
    
    return {
      id: paymentId,
      tenant_id: 'mock-tenant-id',
      landlord_id: 'mock-landlord-id',
      amount: 1200,
      payment_method: 'bank_transfer',
      description: 'Rent Payment',
      status: status,
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updated_at: new Date().toISOString(),
      confirmed_at: status === 'confirmed' ? new Date().toISOString() : undefined
    };
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    return null;
  }
};
