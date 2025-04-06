
import React, { useState } from "react";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { Calendar, DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatUGX } from "@/utils/formatters";

interface UpcomingPaymentProps {
  dueDate: string;
  amount: number;
  property: string;
  daysLeft: number;
  onPaymentSuccess?: () => void;
}

export function UpcomingPayment({ 
  dueDate, 
  amount, 
  property, 
  daysLeft,
  onPaymentSuccess
}: UpcomingPaymentProps) {
  const [processingPayment, setProcessingPayment] = useState(false);
  const { toast } = useToast();

  const handlePayNow = async () => {
    setProcessingPayment(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show push notification sent message
      toast({
        title: "Payment initiated",
        description: "Check your payment app for a payment confirmation.",
      });
      
      // Simulate successful payment after user confirmation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Payment successful",
        description: `${formatUGX(amount)} has been paid successfully.`,
      });
      
      // Call the onPaymentSuccess callback from parent component
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
      
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

  return (
    <NeumorphicCard className="p-6 col-span-2 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Payment
        </h2>
        <span className="text-xs px-2 py-1 rounded-full neumorph text-primary">
          Due in {daysLeft} days
        </span>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 neumorph rounded-xl">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">Next Due Date</p>
          <p className="text-xl font-bold">{dueDate}</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="text-xl font-bold">{formatUGX(amount)}</p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">Property</p>
          <p className="text-lg font-medium">{property}</p>
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
  );
}
