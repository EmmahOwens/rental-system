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

export const createPayment = async (
  tenantId: string,
  landlordId: string,
  amount: number,
  paymentMethod: string,
  description?: string
): Promise<Payment | null> => {
  try {
    const { data, error } = await supabase
      .from("payments")
      .insert({
        tenant_id: tenantId,
        landlord_id: landlordId,
        amount,
        payment_method: paymentMethod,
        description,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating payment:", error);
      return null;
    }
    
    return data;
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
    // Get all payments for the user
    const { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .eq(userType === 'tenant' ? 'tenant_id' : 'landlord_id', userId);
      
    if (error) {
      console.error(`Error fetching ${userType} payments:`, error);
      return { totalPaid: 0, pendingAmount: 0, monthlyData: [] };
    }
    
    // Calculate totals
    const totalPaid = payments
      ?.filter(payment => payment.status === 'confirmed')
      .reduce((sum, payment) => sum + payment.amount, 0) || 0;
      
    const pendingAmount = payments
      ?.filter(payment => payment.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0) || 0;
    
    // Group by month for chart data
    const monthlyData: Record<string, { paid: number; pending: number }> = {};
    
    payments?.forEach(payment => {
      const date = new Date(payment.created_at);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { paid: 0, pending: 0 };
      }
      
      if (payment.status === 'confirmed') {
        monthlyData[monthYear].paid += payment.amount;
      } else if (payment.status === 'pending') {
        monthlyData[monthYear].pending += payment.amount;
      }
    });
    
    // Convert to array and sort by month
    const monthlyDataArray = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    })).sort((a, b) => a.month.localeCompare(b.month));
    
    return {
      totalPaid,
      pendingAmount,
      monthlyData: monthlyDataArray
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
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        tenant:profiles!payments_tenant_id_fkey(first_name, last_name),
        landlord:profiles!payments_landlord_id_fkey(first_name, last_name)
      `)
      .eq(userType === 'tenant' ? 'tenant_id' : 'landlord_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error(`Error fetching ${userType} payments:`, error);
      return [];
    }
    
    return data || [];
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
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    };
    
    if (status === 'confirmed') {
      updateData.confirmed_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from("payments")
      .update(updateData)
      .eq("id", paymentId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating payment status:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    return null;
  }
};