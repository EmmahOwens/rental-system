
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CreditCard, DollarSign, FileText, Plus, Loader2, ChevronRight } from "lucide-react";
import { PaymentMethodCard, PaymentMethodType } from "@/components/Payments/PaymentMethodCard";
import { AddPaymentMethodForm } from "@/components/Payments/AddPaymentMethodForm";
import { format } from "date-fns";
import { Link } from "react-router-dom";

// Format UGX currency
const formatUGX = (amount: number) => {
  return `UGX ${amount.toLocaleString("en-UG")}`;
};

// Payment method interface
interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  cardNumber?: string;
  phoneNumber?: string;
  nameOnCard?: string;
  expiryDate?: string;
  isDefault: boolean;
}

// Payment history interface
interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  property: string;
  description?: string;
}

export default function Payments() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const isLandlord = currentUser?.role === 'landlord';
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
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

  const handlePayNow = async () => {
    setProcessingPayment(true);
    
    // Find the default payment method
    const defaultMethod = paymentMethods.find(method => method.isDefault);
    
    if (!defaultMethod) {
      toast({
        title: "No default payment method",
        description: "Please set a default payment method",
        variant: "destructive"
      });
      setProcessingPayment(false);
      return;
    }
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show push notification sent message
      toast({
        title: "Payment initiated",
        description: `Check your ${defaultMethod.type === 'mtn' ? 'MTN' : defaultMethod.type === 'airtel' ? 'Airtel' : 'banking app'} for a payment confirmation.`,
      });
      
      // Simulate successful payment after user confirmation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add payment to history
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
        description: `${formatUGX(1200000)} has been paid successfully.`,
      });
      
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleAddPaymentMethod = (data: {
    type: PaymentMethodType;
    cardNumber?: string;
    phoneNumber?: string;
    nameOnCard?: string;
    expiryDate?: string;
  }) => {
    const newMethod: PaymentMethod = {
      id: `pm${Date.now()}`,
      type: data.type,
      cardNumber: data.cardNumber,
      phoneNumber: data.phoneNumber,
      nameOnCard: data.nameOnCard,
      expiryDate: data.expiryDate,
      isDefault: paymentMethods.length === 0 // Make default if it's the first
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddPaymentMethod(false);
    
    toast({
      title: "Payment method added",
      description: `Your ${data.type === 'mtn' ? 'MTN Mobile Money' : 
                   data.type === 'airtel' ? 'Airtel Money' : 
                   data.type === 'visa' ? 'Visa card' : 
                   'Mastercard'} has been added.`
    });
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    
    toast({
      title: "Default method updated",
      description: "Your default payment method has been updated."
    });
  };
  
  const removePaymentMethod = (id: string) => {
    const methodToRemove = paymentMethods.find(method => method.id === id);
    const isDefault = methodToRemove?.isDefault || false;
    
    let updatedMethods = paymentMethods.filter(method => method.id !== id);
    
    // If we're removing the default method, set a new default
    if (isDefault && updatedMethods.length > 0) {
      updatedMethods = updatedMethods.map((method, index) => ({
        ...method,
        isDefault: index === 0 // Make the first remaining method the default
      }));
    }
    
    setPaymentMethods(updatedMethods);
    
    toast({
      title: "Payment method removed",
      description: "Your payment method has been removed."
    });
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
          <NeumorphicCard className="p-6 col-span-2 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Payment
              </h2>
              <span className="text-xs px-2 py-1 rounded-full neumorph text-primary">
                Due in 5 days
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 neumorph rounded-xl">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">Next Due Date</p>
                <p className="text-xl font-bold">May 1, 2025</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-xl font-bold">{formatUGX(1200000)}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">Property</p>
                <p className="text-lg font-medium">Sunset Apartments, #304</p>
              </div>
              <button 
                className={`neumorph-button ${processingPayment ? 'bg-primary/70' : 'bg-primary'} text-primary-foreground flex items-center gap-2 px-6`}
                onClick={handlePayNow}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <DollarSign className="h-4 w-4" />
                )}
                {processingPayment ? "Processing..." : "Pay Now"}
              </button>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Payment will be processed using your default payment method.</p>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Methods
              </h2>
            </div>
            
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  type={method.type}
                  cardNumber={method.cardNumber}
                  phoneNumber={method.phoneNumber}
                  expiryDate={method.expiryDate}
                  isDefault={method.isDefault}
                  onSetDefault={() => setDefaultPaymentMethod(method.id)}
                  onRemove={() => removePaymentMethod(method.id)}
                />
              ))}
              
              {showAddPaymentMethod ? (
                <AddPaymentMethodForm
                  onAddMethod={handleAddPaymentMethod}
                  onCancel={() => setShowAddPaymentMethod(false)}
                />
              ) : (
                <button 
                  className="neumorph-button w-full flex items-center justify-center gap-2 mt-2"
                  onClick={() => setShowAddPaymentMethod(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Payment Method
                </button>
              )}
            </div>
          </NeumorphicCard>
        </div>
      )}

      <NeumorphicCard className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {isLandlord ? "Payment History" : "Transaction History"}
          </h2>
          
          <div className="flex items-center">
            {isLandlord && (
              <button className="neumorph-button flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Record Payment
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-3 px-2">ID</th>
                <th className="pb-3 px-2">Date</th>
                <th className="pb-3 px-2">Amount</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Property</th>
                <th className="pb-3 px-2">Description</th>
                <th className="pb-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="border-b border-border hover:bg-muted/20">
                  <td className="py-4 px-2">{payment.id}</td>
                  <td className="py-4 px-2">{format(new Date(payment.date), 'MMM d, yyyy')}</td>
                  <td className="py-4 px-2">{formatUGX(payment.amount)}</td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : payment.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {payment.status === 'paid' ? 'Paid' : payment.status === 'pending' ? 'Pending' : 'Failed'}
                    </span>
                  </td>
                  <td className="py-4 px-2">{payment.property}</td>
                  <td className="py-4 px-2">{payment.description || '-'}</td>
                  <td className="py-4 px-2 text-right">
                    <button className="neumorph-button text-sm py-1 px-3">Receipt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {paymentHistory.length === 0 && (
          <div className="text-center p-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">No payment history</h3>
            <p className="text-sm text-muted-foreground">
              You don't have any payment records yet
            </p>
          </div>
        )}
      </NeumorphicCard>
    </DashboardLayout>
  );
}
