
import React from "react";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { FileText, Plus, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { formatUGX } from "@/utils/formatters";

// Payment history interface
interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  property: string;
  description?: string;
}

interface PaymentHistoryProps {
  paymentHistory: PaymentHistory[];
  isLandlord: boolean;
  loading?: boolean;
  error?: string | null;
}

export function PaymentHistoryComponent({ 
  paymentHistory, 
  isLandlord, 
  loading = false, 
  error = null 
}: PaymentHistoryProps) {
  return (
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
      
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading payment history...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 text-destructive">
          <AlertCircle className="h-8 w-8 mb-4" />
          <p className="font-medium">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page</p>
        </div>
      ) : paymentHistory.length > 0 ? (
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
                  <td className="py-4 px-2">{payment.id.substring(0, 8)}...</td>
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
      ) : (
        <div className="text-center p-8">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-1">No payment history</h3>
          <p className="text-sm text-muted-foreground">
            You don't have any payment records yet
          </p>
        </div>
      )}
    </NeumorphicCard>
  );
}
