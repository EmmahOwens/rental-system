
import { useState, useEffect } from "react";
import { PaymentMethod, PaymentHistory } from "@/components/Payments/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPayments, createPayment, getPaymentStats } from "@/utils/paymentUtils";

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

  // Fetch payment history from API
  useEffect(() => {
    if (!userId) return;
    
    const fetchPayments = async () => {
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
          description: "Failed to load payment history",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [userId, userRole, toast]);

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
      
      // Create payment via API
      const landlordId = "mock-landlord-id"; // In a real app, this would come from the property data
      const payment = await createPayment(
        userId, 
        landlordId,
        amount,
        defaultMethod.type,
        "Monthly Rent Payment"
      );
      
      if (payment) {
        // Add the new payment to history
        const newPayment: PaymentHistory = {
          id: payment.id,
          date: payment.created_at,
          amount: Number(payment.amount),
          status: payment.status === 'confirmed' ? 'paid' : 'pending',
          property: "Sunset Apartments, #304",
          description: "Monthly Rent Payment"
        };
        
        setPaymentHistory(prev => [newPayment, ...prev]);
        
        toast({
          title: "Payment successful",
          description: "Your payment has been processed successfully."
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment.",
        variant: "destructive"
      });
    }
  };

  return {
    paymentMethods,
    setPaymentMethods,
    paymentHistory,
    setPaymentHistory,
    handlePaymentSuccess,
    loading,
    error
  };
}
