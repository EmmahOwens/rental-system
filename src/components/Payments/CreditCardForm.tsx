
import React from 'react';
import { PaymentMethodType } from './PaymentMethodCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CardTypeSelector } from './CardTypeSelector';

interface CreditCardFormProps {
  cardType: 'visa' | 'mastercard';
  setCardType: (type: 'visa' | 'mastercard') => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  nameOnCard: string;
  setNameOnCard: (value: string) => void;
  expiryDate: string;
  setExpiryDate: (value: string) => void;
  cvv: string;
  setCvv: (value: string) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formatCardNumber: (value: string) => string;
  formatExpiryDate: (value: string) => string;
}

export function CreditCardForm({
  cardType,
  setCardType,
  cardNumber,
  setCardNumber,
  nameOnCard,
  setNameOnCard,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  onCancel,
  onSubmit,
  formatCardNumber,
  formatExpiryDate
}: CreditCardFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <CardTypeSelector cardType={cardType} setCardType={setCardType} />
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardNumber" className="block mb-2">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            className="neumorph-input"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="nameOnCard" className="block mb-2">Name on Card</Label>
          <Input
            id="nameOnCard"
            placeholder="John Doe"
            className="neumorph-input"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate" className="block mb-2">Expiry Date</Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              className="neumorph-input"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              maxLength={5}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="cvv" className="block mb-2">CVV</Label>
            <Input
              id="cvv"
              type="password"
              placeholder="123"
              className="neumorph-input"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
              maxLength={4}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mt-8">
        <Button
          type="button"
          variant="outline"
          className="flex-1 neumorph-button"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 neumorph-button bg-primary text-primary-foreground"
          disabled={!cardNumber || !nameOnCard || !expiryDate || !cvv}
        >
          Add Card
        </Button>
      </div>
    </form>
  );
}
