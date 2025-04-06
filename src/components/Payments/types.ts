
import { PaymentMethodType } from "./PaymentMethodCard";

// Payment method interface
export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  cardNumber?: string;
  phoneNumber?: string;
  nameOnCard?: string;
  expiryDate?: string;
  isDefault: boolean;
}

// Payment history interface
export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  property: string;
  description?: string;
}
