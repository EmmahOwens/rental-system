
import React from 'react';
import { PaymentMethodType } from './PaymentMethodCard';
import { Label } from '@/components/ui/label';

interface CardTypeSelectorProps {
  cardType: 'visa' | 'mastercard';
  setCardType: (type: 'visa' | 'mastercard') => void;
}

export function CardTypeSelector({ cardType, setCardType }: CardTypeSelectorProps) {
  return (
    <div className="mb-6">
      <Label className="block mb-3">Card Type</Label>
      <div className="grid grid-cols-2 gap-3">
        <div 
          className={`neumorph p-3 rounded-lg flex items-center cursor-pointer transition-all ${
            cardType === 'visa' ? 'neumorph-inset bg-primary/5' : ''
          }`}
          onClick={() => setCardType('visa')}
        >
          <img 
            src="https://www.visa.com/images/merchantoffers/card-image-800x450.png" 
            alt="Visa" 
            className="h-8 mr-2" 
          />
          <span>Visa</span>
        </div>
        <div 
          className={`neumorph p-3 rounded-lg flex items-center cursor-pointer transition-all ${
            cardType === 'mastercard' ? 'neumorph-inset bg-primary/5' : ''
          }`}
          onClick={() => setCardType('mastercard')}
        >
          <img 
            src="https://www.mastercard.us/content/dam/public/mastercard/assets/card-mockups/virtual-card/virtual-mastercard-card/Virtual-Mastercard_card_Mockup_Flat_Medium.png" 
            alt="Mastercard" 
            className="h-8 mr-2" 
          />
          <span>Mastercard</span>
        </div>
      </div>
    </div>
  );
}
