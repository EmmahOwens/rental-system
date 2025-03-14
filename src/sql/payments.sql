-- Create a table for rent payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Tenants can view their own payments"
  ON public.payments
  FOR SELECT
  USING (tenant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Landlords can view payments made to them"
  ON public.payments
  FOR SELECT
  USING (landlord_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Tenants can insert their own payments"
  ON public.payments
  FOR INSERT
  WITH CHECK (tenant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Add a trigger to update the updated_at column
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();