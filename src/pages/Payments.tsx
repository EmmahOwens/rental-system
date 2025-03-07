
import { DashboardLayout } from "@/components/DashboardLayout";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CreditCard, DollarSign, FileText, Plus } from "lucide-react";

export default function Payments() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const isLandlord = currentUser?.role === 'landlord';

  const handlePayNow = () => {
    toast({
      title: "Payment initiated",
      description: "Your payment is being processed",
    });
  };

  const paymentHistory = [
    {
      id: "PAY-001",
      date: "May 1, 2023",
      amount: "$1,200.00",
      status: "Paid",
      property: "Sunset Apartments, #304",
    },
    {
      id: "PAY-002",
      date: "April 1, 2023",
      amount: "$1,200.00",
      status: "Paid",
      property: "Sunset Apartments, #304",
    },
    {
      id: "PAY-003",
      date: "March 1, 2023",
      amount: "$1,200.00",
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
                <p className="text-xl font-bold">$1,200.00</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">Property</p>
                <p className="text-lg font-medium">Sunset Apartments, #304</p>
              </div>
              <button 
                className="neumorph-button bg-primary text-primary-foreground flex items-center gap-2"
                onClick={handlePayNow}
              >
                <DollarSign className="h-4 w-4" />
                Pay Now
              </button>
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Methods
            </h2>
            <div className="space-y-4">
              <div className="p-4 neumorph rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                  <span className="text-sm font-medium">Default</span>
                </div>
              </div>
              <button className="neumorph-button w-full flex items-center justify-center gap-2 mt-2">
                <Plus className="h-4 w-4" />
                Add Payment Method
              </button>
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
                  <td className="py-4">{payment.amount}</td>
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
