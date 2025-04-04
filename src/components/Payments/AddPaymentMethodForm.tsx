
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentMethodType } from './PaymentMethodCard';
import { CreditCard, Smartphone } from 'lucide-react';
import mtnLogo from '/src/assets/mtn-logo.png';
import airtelLogo from '/src/assets/airtel-logo.png';
import visaLogo from '/src/assets/visa-logo.png';
import mastercardLogo from '/src/assets/mastercard-logo.png';

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
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
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
          <form onSubmit={handleMobileSubmit}>
            <div className="mb-6">
              <Label className="block mb-3">Provider</Label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`neumorph p-3 rounded-lg flex items-center cursor-pointer transition-all ${
                    mobileType === 'mtn' ? 'neumorph-inset bg-primary/5' : ''
                  }`}
                  onClick={() => setMobileType('mtn')}
                >
                  <img src={mtnLogo} alt="MTN" className="h-8 mr-2" />
                  <span>MTN Mobile Money</span>
                </div>
                <div 
                  className={`neumorph p-3 rounded-lg flex items-center cursor-pointer transition-all ${
                    mobileType === 'airtel' ? 'neumorph-inset bg-primary/5' : ''
                  }`}
                  onClick={() => setMobileType('airtel')}
                >
                  <img src={airtelLogo} alt="Airtel" className="h-8 mr-2" />
                  <span>Airtel Money</span>
                </div>
              </div>
            </div>
            
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
        </TabsContent>
        
        <TabsContent value="card">
          <form onSubmit={handleCardSubmit}>
            <div className="mb-6">
              <Label className="block mb-3">Card Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`neumorph p-3 rounded-lg flex items-center cursor-pointer transition-all ${
                    cardType === 'visa' ? 'neumorph-inset bg-primary/5' : ''
                  }`}
                  onClick={() => setCardType('visa')}
                >
                  <img src={visaLogo} alt="Visa" className="h-8 mr-2" />
                  <span>Visa</span>
                </div>
                <div 
                  className={`neumorph p-3 rounded-lg flex items-center cursor-pointer transition-all ${
                    cardType === 'mastercard' ? 'neumorph-inset bg-primary/5' : ''
                  }`}
                  onClick={() => setCardType('mastercard')}
                >
                  <img src={mastercardLogo} alt="Mastercard" className="h-8 mr-2" />
                  <span>Mastercard</span>
                </div>
              </div>
            </div>
            
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
