
import React from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';

export type PaymentMethodType = 'credit_card' | 'visa' | 'mastercard' | 'mtn' | 'airtel';

interface PaymentMethodCardProps {
  type: PaymentMethodType;
  cardNumber?: string;
  phoneNumber?: string;
  expiryDate?: string;
  isDefault: boolean;
  onSetDefault: () => void;
  onRemove: () => void;
}

export function PaymentMethodCard({
  type,
  cardNumber,
  phoneNumber,
  expiryDate,
  isDefault,
  onSetDefault,
  onRemove,
}: PaymentMethodCardProps) {
  const getPaymentMethodInfo = () => {
    switch (type) {
      case 'mtn':
        return {
          logo: "https://cdn.britannica.com/97/177897-050-08BACF73/MTN-Group-logo.jpg",
          name: 'MTN Mobile Money',
          number: phoneNumber,
          bgGradient: 'from-yellow-400 to-yellow-500',
          textColor: 'text-black',
        };
      case 'airtel':
        return {
          logo: "https://1000logos.net/wp-content/uploads/2021/11/Airtel-Logo-2010.png",
          name: 'Airtel Money',
          number: phoneNumber,
          bgGradient: 'from-red-500 to-red-600',
          textColor: 'text-white',
        };
      case 'visa':
        return {
          logo: "https://www.visa.com/images/merchantoffers/card-image-800x450.png",
          name: 'Visa',
          number: formatCardNumber(cardNumber),
          bgGradient: 'from-blue-500 to-blue-600',
          textColor: 'text-white',
        };
      case 'mastercard':
        return {
          logo: "https://www.mastercard.us/content/dam/public/mastercard/assets/card-mockups/virtual-card/virtual-mastercard-card/Virtual-Mastercard_card_Mockup_Flat_Medium.png",
          name: 'Mastercard',
          number: formatCardNumber(cardNumber),
          bgGradient: 'from-orange-500 to-red-500',
          textColor: 'text-white',
        };
      default:
        return {
          logo: null,
          name: 'Credit Card',
          number: formatCardNumber(cardNumber),
          bgGradient: 'from-gray-700 to-gray-800',
          textColor: 'text-white',
        };
    }
  };

  const formatCardNumber = (number?: string) => {
    if (!number) return '•••• •••• •••• ••••';
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  const info = getPaymentMethodInfo();

  return (
    <div className="p-1 rounded-xl neumorph">
      <div 
        className={`p-5 rounded-lg relative overflow-hidden bg-gradient-to-r ${info.bgGradient} ${info.textColor}`}
        style={{ 
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Embossed effect patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10" 
          style={{
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '15px 15px',
          }}
        />
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            {info.logo ? (
              <img 
                src={info.logo} 
                alt={info.name} 
                className="h-10 object-contain mr-2"
                style={{ filter: type === 'visa' || type === 'mastercard' ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' : 'none' }}
              />
            ) : (
              <CreditCard className="h-8 w-8 mr-2" />
            )}
            <h3 className="font-bold">{info.name}</h3>
          </div>
          {isDefault && (
            <span className="bg-white/20 text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Default
            </span>
          )}
        </div>
        
        <div className="mb-4">
          <p className="text-lg font-mono tracking-wider">{info.number}</p>
        </div>
        
        {expiryDate && (
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-70">Expires</p>
              <p className="font-mono">{expiryDate}</p>
            </div>
            <div className="h-6 w-9 bg-gold rounded opacity-60" style={{ background: 'linear-gradient(120deg, #d4af37, #f9f295, #d4af37)' }}></div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between p-2 mt-2">
        {!isDefault ? (
          <button 
            onClick={onSetDefault}
            className="text-sm text-primary hover:underline"
          >
            Set as default
          </button>
        ) : (
          <span className="text-sm text-muted-foreground">Default method</span>
        )}
        
        <button 
          onClick={onRemove}
          className="text-sm text-destructive hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
