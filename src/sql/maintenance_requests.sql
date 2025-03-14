-- Create a table for maintenance requests
CREATE TABLE IF NOT EXISTS public.maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_unit_id UUID REFERENCES public.property_units(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for maintenance_requests
CREATE POLICY "Tenants can view and create their own maintenance requests"
  ON public.maintenance_requests
  USING (tenant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Landlords can view and manage maintenance requests for their properties"
  ON public.maintenance_requests
  USING (landlord_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Add a trigger to update the updated_at column
CREATE TRIGGER update_maintenance_requests_updated_at
  BEFORE UPDATE ON public.maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();