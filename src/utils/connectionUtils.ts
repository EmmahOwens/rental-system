
import { supabase } from '@/integrations/supabase/client';

export interface TenantLandlordConnection {
  id: string;
  tenant_id: string;
  landlord_id: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Create a connection between a tenant and a landlord
 */
export async function createTenantLandlordConnection(tenantId: string, landlordId: string) {
  const { data, error } = await supabase
    .from('tenant_landlord_connections')
    .insert({
      tenant_id: tenantId,
      landlord_id: landlordId,
      status: 'active'
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('Error creating tenant-landlord connection:', error);
    throw error;
  }
  
  return data as TenantLandlordConnection;
}

/**
 * Get all connections for a tenant
 */
export async function getTenantConnections(tenantId: string) {
  const { data, error } = await supabase
    .from('tenant_landlord_connections')
    .select(`
      *,
      landlord:profiles!landlord_id(id, first_name, last_name, avatar_url, user_type)
    `)
    .eq('tenant_id', tenantId);
  
  if (error) {
    console.error('Error fetching tenant connections:', error);
    throw error;
  }
  
  return data;
}

/**
 * Get all connections for a landlord
 */
export async function getLandlordConnections(landlordId: string) {
  const { data, error } = await supabase
    .from('tenant_landlord_connections')
    .select(`
      *,
      tenant:profiles!tenant_id(id, first_name, last_name, avatar_url, user_type)
    `)
    .eq('landlord_id', landlordId);
  
  if (error) {
    console.error('Error fetching landlord connections:', error);
    throw error;
  }
  
  return data;
}

/**
 * Update the status of a connection
 */
export async function updateConnectionStatus(connectionId: string, status: string) {
  const { data, error } = await supabase
    .from('tenant_landlord_connections')
    .update({ status })
    .eq('id', connectionId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating connection status:', error);
    throw error;
  }
  
  return data;
}

/**
 * Get a specific tenant-landlord connection
 */
export async function getConnection(tenantId: string, landlordId: string) {
  const { data, error } = await supabase
    .from('tenant_landlord_connections')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('landlord_id', landlordId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // Not found
    console.error('Error fetching connection:', error);
    throw error;
  }
  
  return data as TenantLandlordConnection | null;
}
