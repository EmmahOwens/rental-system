
import { supabase } from '@/integrations/supabase/client';
import { createTenantLandlordConnection, getConnection } from './connectionUtils';

// Profile interface
export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  user_type: 'tenant' | 'landlord';
  created_at: string;
  updated_at: string | null;
}

export interface TenantWithConnection extends Profile {
  connection_id: string;
  connection_status: string;
  email?: string;
}

/**
 * Fetch a user profile by ID
 */
export async function getProfileById(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
  
  return data as Profile;
}

/**
 * Connect a tenant to a landlord
 */
export async function connectTenantToLandlord(tenantId: string, landlordId: string) {
  // Check if connection already exists
  const existingConnection = await getConnection(tenantId, landlordId);
  
  if (!existingConnection) {
    return await createTenantLandlordConnection(tenantId, landlordId);
  }
  
  return existingConnection;
}

/**
 * Assign a tenant to a landlord automatically
 */
export async function assignTenantToLandlord(tenantId: string) {
  // Find a suitable landlord
  const landlord = await findLandlordForTenant();
  if (!landlord) {
    console.warn('No landlord found to assign tenant to');
    return null;
  }
  
  return await connectTenantToLandlord(tenantId, landlord.id);
}

/**
 * Find a landlord for a new tenant
 * In a real app, this would have more sophisticated matching logic
 */
export async function findLandlordForTenant() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_type', 'landlord')
    .limit(1);
  
  if (error) {
    console.error('Error finding landlord:', error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    throw new Error('No landlords available');
  }
  
  return data[0] as Profile;
}

/**
 * Get a tenant's landlord
 */
export async function getTenantLandlord(tenantId: string) {
  const { data, error } = await supabase
    .from('tenant_landlord_connections')
    .select(`
      *,
      landlord:profiles!landlord_id(*)
    `)
    .eq('tenant_id', tenantId)
    .single();
  
  if (error) {
    console.error('Error fetching tenant landlord:', error);
    throw error;
  }
  
  return data.landlord as Profile;
}

/**
 * Get all tenants for a landlord
 */
export async function getLandlordTenants(landlordId: string) {
  const { data, error } = await supabase
    .from('tenant_landlord_connections')
    .select(`
      *,
      tenant:profiles!tenant_id(*)
    `)
    .eq('landlord_id', landlordId);
  
  if (error) {
    console.error('Error fetching landlord tenants:', error);
    throw error;
  }
  
  return data.map(connection => ({
    ...connection.tenant,
    connection_id: connection.id,
    connection_status: connection.status
  })) as TenantWithConnection[];
}

/**
 * Get all landlords for a tenant
 */
export async function getTenantLandlords(tenantId: string) {
  const { data, error } = await supabase
    .from('tenant_landlord_connections')
    .select(`
      *,
      landlord:profiles!landlord_id(*)
    `)
    .eq('tenant_id', tenantId);
  
  if (error) {
    console.error('Error fetching tenant landlords:', error);
    throw error;
  }
  
  return data.map(connection => ({
    ...connection.landlord,
    connection_id: connection.id,
    connection_status: connection.status
  })) as TenantWithConnection[];
}

/**
 * Get all profiles by type
 */
export async function getProfilesByType(type: 'tenant' | 'landlord') {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_type', type);
  
  if (error) {
    console.error(`Error fetching ${type} profiles:`, error);
    throw error;
  }
  
  return data as Profile[];
}
