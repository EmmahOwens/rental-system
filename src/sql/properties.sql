-- Create a table for properties
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a table for property units
CREATE TABLE IF NOT EXISTS public.property_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  rent_amount DECIMAL(10, 2) NOT NULL,
  size_sqft INTEGER,
  status TEXT NOT NULL DEFAULT 'available',
  tenant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (property_id, unit_number)
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_units ENABLE ROW LEVEL SECURITY;

-- Create policies for properties
CREATE POLICY "Landlords can manage their own properties"
  ON public.properties
  USING (landlord_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Properties are viewable by all authenticated users"
  ON public.properties
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create policies for property units
CREATE POLICY "Property units are viewable by all authenticated users"
  ON public.property_units
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Landlords can manage units in their properties"
  ON public.property_units
  USING (
    property_id IN (
      SELECT id FROM public.properties 
      WHERE landlord_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

-- Add triggers to update the updated_at columns
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_units_updated_at
  BEFORE UPDATE ON public.property_units
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();