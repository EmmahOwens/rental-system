
import { supabase } from '@/integrations/supabase/client';

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
  connection_id?: string;
  connection_status?: string;
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

// Mock functions for tenant-landlord connections
// These would be implemented fully once the tenant_landlord_connections table is created

/**
 * Connect a tenant to a landlord (mock)
 */
export async function connectTenantToLandlord(tenantId: string, landlordId: string) {
  console.log(`Creating connection between tenant ${tenantId} and landlord ${landlordId}`);
  return {
    id: 'mock-connection-id',
    tenant_id: tenantId,
    landlord_id: landlordId,
    status: 'active',
    created_at: new Date().toISOString()
  };
}

/**
 * Assign a tenant to a landlord automatically (mock)
 */
export async function assignTenantToLandlord(tenantId: string) {
  const landlords = await getProfilesByType('landlord');
  if (landlords.length === 0) {
    console.warn('No landlord found to assign tenant to');
    return null;
  }
  
  const landlord = landlords[0];
  return await connectTenantToLandlord(tenantId, landlord.id);
}

/**
 * Find a landlord for a new tenant
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
 * Get a tenant's landlord (mock)
 */
export async function getTenantLandlord(tenantId: string) {
  const landlords = await getProfilesByType('landlord');
  if (landlords.length === 0) {
    throw new Error('No landlords available');
  }
  
  return landlords[0];
}

/**
 * Get all tenants for a landlord (mock)
 */
export async function getLandlordTenants(landlordId: string) {
  const tenants = await getProfilesByType('tenant');
  
  return tenants.map(tenant => ({
    ...tenant,
    connection_id: 'mock-connection-id',
    connection_status: 'active'
  } as TenantWithConnection));
}

/**
 * Get all landlords for a tenant (mock)
 */
export async function getTenantLandlords(tenantId: string) {
  const landlords = await getProfilesByType('landlord');
  
  return landlords.map(landlord => ({
    ...landlord,
    connection_id: 'mock-connection-id',
    connection_status: 'active'
  } as TenantWithConnection));
}
