
import React from 'react';
import { PaymentMethodType } from './PaymentMethodCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MobileProviderSelector } from './MobileProviderSelector';

interface MobileMoneyFormProps {
  mobileType: 'mtn' | 'airtel';
  setMobileType: (type: 'mtn' | 'airtel') => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function MobileMoneyForm({
  mobileType,
  setMobileType,
  phoneNumber,
  setPhoneNumber,
  onCancel,
  onSubmit
}: MobileMoneyFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <MobileProviderSelector mobileType={mobileType} setMobileType={setMobileType} />
      
      <div className="mb-6">
        <Label htmlFor="phoneNumber" className="block mb-2">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="+256 70 123 4567"
          className="neumorph-input"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter the phone number registered with {mobileType === 'mtn' ? 'MTN' : 'Airtel'} Mobile Money
        </p>
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
          disabled={!phoneNumber}
        >
          Add Payment Method
        </Button>
      </div>
    </form>
  );
}
