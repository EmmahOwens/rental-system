
import React from 'react';
import { PaymentMethodType } from './PaymentMethodCard';
import { Label } from '@/components/ui/label';

interface MobileProviderSelectorProps {
  mobileType: 'mtn' | 'airtel';
  setMobileType: (type: 'mtn' | 'airtel') => void;
}

export function MobileProviderSelector({ mobileType, setMobileType }: MobileProviderSelectorProps) {
  return (
    <div className="mb-6">
      <Label className="block mb-3">Provider</Label>
      <div className="grid grid-cols-2 gap-3">
        <div 
          className={`neumorph p-3 rounded-lg flex items-center cursor-pointer transition-all ${
            mobileType === 'mtn' ? 'neumorph-inset bg-primary/5' : ''
          }`}
          onClick={() => setMobileType('mtn')}
        >
          <img 
            src="https://cdn.britannica.com/97/177897-050-08BACF73/MTN-Group-logo.jpg" 
            alt="MTN" 
            className="h-8 mr-2" 
          />
          <span>MTN Mobile Money</span>
        </div>
        <div 
          className={`neumorph p-3 rounded-lg flex items-center cursor-pointer transition-all ${
            mobileType === 'airtel' ? 'neumorph-inset bg-primary/5' : ''
          }`}
          onClick={() => setMobileType('airtel')}
        >
          <img 
            src="https://1000logos.net/wp-content/uploads/2021/11/Airtel-Logo-2010.png" 
            alt="Airtel" 
            className="h-8 mr-2" 
          />
          <span>Airtel Money</span>
        </div>
      </div>
    </div>
  );
}
