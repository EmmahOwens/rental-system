
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CreditCard, DollarSign, FileText, Plus, Loader2 } from "lucide-react";
import { useState } from "react";

// Mobile Money API integration
interface PaymentMethod {
  id: string;
  type: "mtn" | "airtel";
  phoneNumber: string;
  isDefault: boolean;
}

interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  provider: "mtn" | "airtel";
  reference: string;
}

// Format UGX currency
const formatUGX = (amount: number) => {
  return `UGX ${amount.toLocaleString("en-UG")}`;
};

export default function Payments() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const isLandlord = currentUser?.role === 'landlord';
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newProvider, setNewProvider] = useState<"mtn" | "airtel">("mtn");

  // Sample payment methods (in a real app, these would come from the database)
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
    
    // Create payment request object
    const paymentRequest: PaymentRequest = {
      amount: 1200000, // UGX 1,200,000
      phoneNumber: defaultMethod.phoneNumber.replace(/\D/g, ''), // Remove non-digits
      provider: defaultMethod.type,
      reference: `RENT-${Date.now()}` // Generate a unique reference
    };
    
    try {
      // In a real implementation, this would call your Supabase Edge Function
      // that would then connect to the MTN/Airtel API
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show push notification sent message
      toast({
        title: "Payment initiated",
        description: `Check your ${defaultMethod.type.toUpperCase()} phone for a payment confirmation prompt.`,
      });
      
      // Simulate successful payment after user confirmation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Payment successful",
        description: `${formatUGX(paymentRequest.amount)} has been paid successfully.`,
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

  const addPaymentMethod = () => {
    // Validate phone number (simple validation for demo)
    if (!newPhoneNumber || newPhoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }
    
    // Create new payment method
    const newMethod: PaymentMethod = {
      id: `pm${Date.now()}`,
      type: newProvider,
      phoneNumber: newPhoneNumber,
      isDefault: paymentMethods.length === 0 // Make default if it's the first
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddPaymentMethod(false);
    setNewPhoneNumber("");
    
    toast({
      title: "Payment method added",
      description: `Your ${newProvider.toUpperCase()} Mobile Money account has been added.`
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

  const paymentHistory = [
    {
      id: "PAY-001",
      date: "May 1, 2023",
      amount: 1200000,
      status: "Paid",
      property: "Sunset Apartments, #304",
    },
    {
      id: "PAY-002",
      date: "April 1, 2023",
      amount: 1200000,
      status: "Paid",
      property: "Sunset Apartments, #304",
    },
    {
      id: "PAY-003",
      date: "March 1, 2023",
      amount: 1200000,
      status: "Paid",
      property: "Sunset Apartments, #304",
    },
  ];

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
          <NeumorphicCard className="p-6 col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Payment
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 neumorph rounded-xl">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">Next Due Date</p>
                <p className="text-xl font-bold">June 1, 2023</p>
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
                className={`neumorph-button ${processingPayment ? 'bg-primary/70' : 'bg-primary'} text-primary-foreground flex items-center gap-2`}
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
          </NeumorphicCard>

          <NeumorphicCard className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Methods
            </h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="p-4 neumorph rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Mobile Money ({method.type.toUpperCase()})</p>
                      <p className="text-sm text-muted-foreground">{method.phoneNumber}</p>
                    </div>
                    {method.isDefault ? (
                      <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">Default</span>
                    ) : (
                      <button 
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        className="text-sm text-primary hover:underline"
                      >
                        Set as default
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {showAddPaymentMethod ? (
                <div className="p-4 neumorph rounded-lg">
                  <h3 className="font-medium mb-3">Add New Payment Method</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Provider</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setNewProvider("mtn")}
                          className={`flex-1 py-2 px-3 rounded-lg ${newProvider === 'mtn' ? 'bg-primary text-white' : 'neumorph'}`}
                        >
                          MTN Mobile Money
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProvider("airtel")}
                          className={`flex-1 py-2 px-3 rounded-lg ${newProvider === 'airtel' ? 'bg-primary text-white' : 'neumorph'}`}
                        >
                          Airtel Money
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+256 70 123 4567"
                        value={newPhoneNumber}
                        onChange={(e) => setNewPhoneNumber(e.target.value)}
                        className="neumorph-input w-full"
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={addPaymentMethod}
                        className="neumorph-button bg-primary text-primary-foreground flex-1"
                      >
                        Add Method
                      </button>
                      <button
                        onClick={() => setShowAddPaymentMethod(false)}
                        className="neumorph-button flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
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

      <NeumorphicCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {isLandlord ? "Payment History" : "Transaction History"}
          </h2>
          {isLandlord && (
            <button className="neumorph-button flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Record Payment
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-2">ID</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Property</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="border-b border-border">
                  <td className="py-4">{payment.id}</td>
                  <td className="py-4">{payment.date}</td>
                  <td className="py-4">{formatUGX(payment.amount)}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4">{payment.property}</td>
                  <td className="py-4 text-right">
                    <button className="neumorph-button text-sm py-1">Receipt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </NeumorphicCard>
    </DashboardLayout>
  );
}
