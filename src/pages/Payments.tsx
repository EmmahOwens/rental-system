
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { UpcomingPayment } from "@/components/Payments/UpcomingPayment";
import { PaymentMethodManager } from "@/components/Payments/PaymentMethodManager";
import { PaymentHistoryComponent } from "@/components/Payments/PaymentHistory";
import { PaymentMethod, PaymentHistory } from "@/components/Payments/types";

export default function Payments() {
  const { currentUser } = useAuth();
  const isLandlord = currentUser?.role === 'landlord';
  
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

  // Payment history (sample data)
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
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isLandlord ? "Payment Management" : "Payments"}
        </h1>
        <p className="text-muted-foreground">
          {isLandlord
            ? "Manage payments from your tenants"
            : "View and manage your rental payments"}
        </p>
      </div>

      {!isLandlord && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <UpcomingPayment 
            dueDate="May 1, 2025"
            amount={1200000}
            property="Sunset Apartments, #304"
            daysLeft={5}
          />

          <PaymentMethodManager
            paymentMethods={paymentMethods}
            setPaymentMethods={setPaymentMethods}
          />
        </div>
      )}

      <PaymentHistoryComponent 
        paymentHistory={paymentHistory}
        isLandlord={isLandlord}
      />
    </DashboardLayout>
  );
}
