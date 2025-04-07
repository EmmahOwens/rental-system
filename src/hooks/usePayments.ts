
import { useState, useEffect } from "react";
import { PaymentMethod, PaymentHistory } from "@/components/Payments/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { mutateSupabaseData } from "@/utils/dataFetching";
import { getUserPayments, getPaymentStats } from "@/utils/paymentUtils";
import { formatUGX } from "@/utils/formatters";

export function usePayments() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const userId = currentUser?.id || '';
  const userRole = currentUser?.role || 'tenant';

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm1",
      type: "mtn",
      phoneNumber: "+256 70 123 4567",
      isDefault: true
    },
    {
      id: "pm2",
      type: "airtel",
      phoneNumber: "+256 75 987 6543",
      isDefault: false
    },
    {
      id: "pm3",
      type: "visa",
      cardNumber: "4242",
      nameOnCard: "John Doe",
      expiryDate: "12/25",
      isDefault: false
    }
  ]);

  // Payment history state
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const payments = await getUserPayments(userId, userRole as 'tenant' | 'landlord');
      
      // Transform the API payment data to match our PaymentHistory interface
      const formattedPayments: PaymentHistory[] = payments.map(payment => ({
        id: payment.id,
        date: payment.created_at,
        amount: Number(payment.amount),
        status: payment.status === 'confirmed' ? 'paid' : 
               payment.status === 'pending' ? 'pending' : 'failed',
        property: "Sunset Apartments, #304", // This would ideally come from a property lookup
        description: payment.description || `Rent Payment (${payment.payment_method})`
      }));
      
      setPaymentHistory(formattedPayments);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payment history");
      toast({
        title: "Error",
        description: "Failed to load payment history. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment history from API
  useEffect(() => {
    if (currentUser) {
      fetchPayments();
    }
  }, [userId, userRole]);

  const handlePaymentSuccess = async (amount: number = 1200000) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to make payments",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Get default payment method
      const defaultMethod = paymentMethods.find(method => method.isDefault);
      if (!defaultMethod) {
        toast({
          title: "Error",
          description: "No default payment method found",
          variant: "destructive"
        });
        return;
      }
      
      // In a real app, this would be a call to a payments API
      // For demo purposes, we'll just add a new payment history item
      const newPayment: PaymentHistory = {
        id: `pmt-${Date.now()}`,
        date: new Date().toISOString(),
        amount: amount,
        status: 'pending',
        property: "Sunset Apartments, #304",
        description: "Monthly Rent Payment"
      };
      
      // Add to payment history
      setPaymentHistory(prev => [newPayment, ...prev]);
      
      // Show success notification
      toast({
        title: "Payment initiated",
        description: `${formatUGX(amount)} payment is being processed.`,
      });
      
      // Simulate payment confirmation after 3 seconds
      setTimeout(() => {
        setPaymentHistory(prev => 
          prev.map(p => p.id === newPayment.id ? {...p, status: 'paid'} : p)
        );
        
        toast({
          title: "Payment successful",
          description: `${formatUGX(amount)} has been paid successfully.`,
        });
      }, 3000);
      
    } catch (err) {
      console.error("Payment error:", err);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment.",
        variant: "destructive"
      });
    }
  };

  const refreshPayments = () => {
    fetchPayments();
  };

  return {
    paymentMethods,
    setPaymentMethods,
    paymentHistory,
    setPaymentHistory,
    handlePaymentSuccess,
    loading,
    error,
    refreshPayments
  };
}
