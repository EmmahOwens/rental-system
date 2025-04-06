
import { useState } from "react";
import { PaymentMethod, PaymentHistory } from "@/components/Payments/types";
import { useToast } from "@/hooks/use-toast";

export function usePayments() {
  const { toast } = useToast();

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
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: "PAY-001",
      date: "2025-04-01",
      amount: 1200000,
      status: "paid",
      property: "Sunset Apartments, #304",
      description: "April 2025 Rent"
    },
    {
      id: "PAY-002",
      date: "2025-03-01",
      amount: 1200000,
      status: "paid",
      property: "Sunset Apartments, #304",
      description: "March 2025 Rent"
    },
    {
      id: "PAY-003",
      date: "2025-02-01",
      amount: 1200000,
      status: "paid",
      property: "Sunset Apartments, #304",
      description: "February 2025 Rent"
    }
  ]);

  const handlePaymentSuccess = () => {
    // Add a new payment to history
    const newPayment: PaymentHistory = {
      id: `PAY-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      amount: 1200000,
      status: "paid",
      property: "Sunset Apartments, #304",
      description: "May 2025 Rent"
    };
    
    setPaymentHistory(prev => [newPayment, ...prev]);
    
    toast({
      title: "Payment successful",
      description: "Your payment has been processed successfully."
    });
  };

  return {
    paymentMethods,
    setPaymentMethods,
    paymentHistory,
    setPaymentHistory,
    handlePaymentSuccess
  };
}
