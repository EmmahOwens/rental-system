
import React, { useState } from "react";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { CreditCard, Plus } from "lucide-react";
import { PaymentMethodCard, PaymentMethodType } from "./PaymentMethodCard";
import { AddPaymentMethodForm } from "./AddPaymentMethodForm";
import { useToast } from "@/hooks/use-toast";

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

interface PaymentMethodManagerProps {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
}

export function PaymentMethodManager({ 
  paymentMethods, 
  setPaymentMethods 
}: PaymentMethodManagerProps) {
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const { toast } = useToast();

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

  return (
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
  );
}
