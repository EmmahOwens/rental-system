
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { UpcomingPayment } from "@/components/Payments/UpcomingPayment";
import { PaymentMethodManager } from "@/components/Payments/PaymentMethodManager";
import { PaymentHistoryComponent } from "@/components/Payments/PaymentHistory";
import { usePayments } from "@/hooks/usePayments";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function Payments() {
  const { currentUser } = useAuth();
  const isLandlord = currentUser?.role === 'landlord';
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    paymentMethods,
    setPaymentMethods,
    paymentHistory,
    handlePaymentSuccess,
    loading,
    error,
    refreshPayments
  } = usePayments();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshPayments();
    setTimeout(() => setIsRefreshing(false), 500); // Minimum refresh animation time
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isLandlord ? "Payment Management" : "Payments"}
          </h1>
          <p className="text-muted-foreground">
            {isLandlord
              ? "Manage payments from your tenants"
              : "View and manage your rental payments"}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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
        loading={loading}
        error={error}
      />
    </DashboardLayout>
  );
}
