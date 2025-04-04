
-- Create the tenant_landlord_connections table
CREATE TABLE tenant_landlord_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES profiles(id),
  landlord_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indices for faster lookups
CREATE INDEX idx_tenant_landlord_tenant_id ON tenant_landlord_connections(tenant_id);
CREATE INDEX idx_tenant_landlord_landlord_id ON tenant_landlord_connections(landlord_id);

-- Add RLS policies
ALTER TABLE tenant_landlord_connections ENABLE ROW LEVEL SECURITY;

-- Allow tenants to see their own connections
CREATE POLICY tenant_read_own_connections ON tenant_landlord_connections
  FOR SELECT USING (auth.uid() = tenant_id);

-- Allow landlords to see their own connections
CREATE POLICY landlord_read_own_connections ON tenant_landlord_connections
  FOR SELECT USING (auth.uid() = landlord_id);

-- Allow system to insert new connections
CREATE POLICY insert_connections ON tenant_landlord_connections
  FOR INSERT WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the timestamp
CREATE TRIGGER update_tenant_landlord_connections_timestamp
  BEFORE UPDATE ON tenant_landlord_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();
