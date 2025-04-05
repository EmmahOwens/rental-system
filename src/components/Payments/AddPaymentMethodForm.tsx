
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { PaymentMethodType } from './PaymentMethodCard';
import { CreditCard, Smartphone } from 'lucide-react';
import { MobileMoneyForm } from './MobileMoneyForm';
import { CreditCardForm } from './CreditCardForm';
import { formatCardNumber, formatExpiryDate } from './paymentFormUtils';

interface AddPaymentMethodFormProps {
  onAddMethod: (data: {
    type: PaymentMethodType;
    cardNumber?: string;
    phoneNumber?: string;
    nameOnCard?: string;
    expiryDate?: string;
    cvv?: string;
  }) => void;
  onCancel: () => void;
}

export function AddPaymentMethodForm({ onAddMethod, onCancel }: AddPaymentMethodFormProps) {
  const [activeTab, setActiveTab] = useState<'card' | 'mobile'>('mobile');
  const [cardType, setCardType] = useState<'visa' | 'mastercard'>('visa');
  const [mobileType, setMobileType] = useState<'mtn' | 'airtel'>('mtn');
  
  // Card form fields
  const [cardNumber, setCardNumber] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Mobile form fields
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMethod({
      type: cardType,
      cardNumber,
      nameOnCard,
      expiryDate,
      cvv,
    });
  };
  
  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMethod({
      type: mobileType,
      phoneNumber,
    });
  };
  
  return (
    <div className="neumorph-inset p-5 rounded-xl">
      <h3 className="text-xl font-bold mb-4">Add Payment Method</h3>
      
      <Tabs defaultValue="mobile" value={activeTab} onValueChange={(v) => setActiveTab(v as 'card' | 'mobile')}>
        <TabsList className="grid grid-cols-2 mb-6 neumorph">
          <TabsTrigger value="mobile" className="flex items-center">
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile Money
          </TabsTrigger>
          <TabsTrigger value="card" className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            Credit Card
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="mobile">
          <MobileMoneyForm
            mobileType={mobileType}
            setMobileType={setMobileType}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onCancel={onCancel}
            onSubmit={handleMobileSubmit}
          />
        </TabsContent>
        
        <TabsContent value="card">
          <CreditCardForm
            cardType={cardType}
            setCardType={setCardType}
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            nameOnCard={nameOnCard}
            setNameOnCard={setNameOnCard}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            cvv={cvv}
            setCvv={setCvv}
            onCancel={onCancel}
            onSubmit={handleCardSubmit}
            formatCardNumber={formatCardNumber}
            formatExpiryDate={formatExpiryDate}
          />
        </TabsContent>
      </Tabs>
      
      <Separator className="my-6" />
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Your payment information is secured with industry-standard encryption.
        </p>
      </div>
    </div>
  );
}
