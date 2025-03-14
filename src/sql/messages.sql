-- Create a table for messages between tenants and landlords
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.tenant_landlord_connections(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Users can view messages in their connections"
  ON public.messages
  FOR SELECT
  USING (
    connection_id IN (
      SELECT id FROM public.tenant_landlord_connections 
      WHERE tenant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      OR landlord_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in their connections"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    AND
    connection_id IN (
      SELECT id FROM public.tenant_landlord_connections 
      WHERE tenant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      OR landlord_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

-- Add a trigger to update the updated_at column
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();