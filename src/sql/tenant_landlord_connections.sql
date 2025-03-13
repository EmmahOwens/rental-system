
-- Create a table to track tenant-landlord connections
CREATE TABLE IF NOT EXISTS public.tenant_landlord_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (tenant_id, landlord_id)
);

-- Enable Row Level Security
ALTER TABLE public.tenant_landlord_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant_landlord_connections
CREATE POLICY "Tenants can view their own connections"
  ON public.tenant_landlord_connections
  FOR SELECT
  USING (tenant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Landlords can view their own connections"
  ON public.tenant_landlord_connections
  FOR SELECT
  USING (landlord_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Add a trigger to update the updated_at column
CREATE TRIGGER update_tenant_landlord_connections_updated_at
  BEFORE UPDATE ON public.tenant_landlord_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
