
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { UpcomingPayment } from "@/components/Payments/UpcomingPayment";
import { PaymentMethodManager } from "@/components/Payments/PaymentMethodManager";
import { PaymentHistoryComponent } from "@/components/Payments/PaymentHistory";
import { usePayments } from "@/hooks/usePayments";

export default function Payments() {
  const { currentUser } = useAuth();
  const isLandlord = currentUser?.role === 'landlord';
  
  const {
    paymentMethods,
    setPaymentMethods,
    paymentHistory,
    handlePaymentSuccess
  } = usePayments();

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
            onPaymentSuccess={handlePaymentSuccess}
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
