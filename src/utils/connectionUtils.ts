
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './profileUtils';

export interface TenantLandlordConnection {
  id: string;
  tenant_id: string;
  landlord_id: string;
  status: string;
  unread_count: number;
  created_at: string;
  updated_at?: string;
}

export interface TenantWithConnection extends Profile {
  connection_id: string;
  unread_count: number;
}

export interface LandlordWithConnection extends Profile {
  connection_id: string;
  unread_count: number;
}

// Mock functions to simulate tenant-landlord connections
// These would be replaced with actual implementations once the tenant_landlord_connections table is created

/**
 * Create a connection between a tenant and a landlord (mock)
 */
export async function createTenantLandlordConnection(tenantId: string, landlordId: string) {
  console.log(`Mock: Creating connection between ${tenantId} and ${landlordId}`);
  
  return {
    id: `mock-${Date.now()}`,
    tenant_id: tenantId,
    landlord_id: landlordId,
    status: 'active',
    unread_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as TenantLandlordConnection;
}

/**
 * Get all connections for a tenant (mock)
 */
export async function getTenantConnections(tenantId: string) {
  console.log(`Mock: Getting connections for tenant ${tenantId}`);
  
  // Get a landlord to create a mock connection
  const { data: landlords } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_type', 'landlord')
    .limit(1);
  
  if (!landlords || landlords.length === 0) {
    return [];
  }
  
  return [{
    id: `mock-${Date.now()}`,
    tenant_id: tenantId,
    landlord_id: landlords[0].id,
    status: 'active',
    unread_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    landlord: landlords[0]
  }];
}

/**
 * Get all connections for a landlord (mock)
 */
export async function getLandlordConnections(landlordId: string) {
  console.log(`Mock: Getting connections for landlord ${landlordId}`);
  
  // Get a tenant to create a mock connection
  const { data: tenants } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_type', 'tenant')
    .limit(1);
  
  if (!tenants || tenants.length === 0) {
    return [];
  }
  
  return [{
    id: `mock-${Date.now()}`,
    tenant_id: tenants[0].id,
    landlord_id: landlordId,
    status: 'active',
    unread_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tenant: tenants[0]
  }];
}

/**
 * Update the status of a connection (mock)
 */
export async function updateConnectionStatus(connectionId: string, status: string) {
  console.log(`Mock: Updating connection ${connectionId} status to ${status}`);
  
  return {
    id: connectionId,
    tenant_id: 'mock-tenant-id',
    landlord_id: 'mock-landlord-id',
    status: status,
    unread_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as TenantLandlordConnection;
}

/**
 * Get a specific tenant-landlord connection (mock)
 */
export async function getConnection(tenantId: string, landlordId: string) {
  console.log(`Mock: Getting connection between ${tenantId} and ${landlordId}`);
  
  // 50% chance of returning a connection to simulate existence check
  if (Math.random() > 0.5) {
    return null;
  }
  
  return {
    id: `mock-${Date.now()}`,
    tenant_id: tenantId,
    landlord_id: landlordId,
    status: 'active',
    unread_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as TenantLandlordConnection;
}

/**
 * Get a connection by ID (mock)
 */
export async function getConnectionById(connectionId: string) {
  console.log(`Mock: Getting connection by ID ${connectionId}`);
  
  // Get sample tenant and landlord
  const { data: tenants } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_type', 'tenant')
    .limit(1);
    
  const { data: landlords } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_type', 'landlord')
    .limit(1);
  
  if (!tenants || !landlords || tenants.length === 0 || landlords.length === 0) {
    return null;
  }
  
  return {
    id: connectionId,
    tenant_id: tenants[0].id,
    landlord_id: landlords[0].id,
    status: 'active',
    unread_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tenant: tenants[0],
    landlord: landlords[0]
  };
}

/**
 * Get all tenants for a landlord with their connection details (mock)
 */
export async function getLandlordTenants(landlordId: string): Promise<TenantWithConnection[]> {
  console.log(`Mock: Getting tenants for landlord ${landlordId}`);
  
  const { data: tenants } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_type', 'tenant')
    .limit(5);
  
  if (!tenants || tenants.length === 0) {
    return [];
  }
  
  return tenants.map(tenant => ({
    ...tenant,
    connection_id: `mock-${Date.now()}-${tenant.id}`,
    unread_count: Math.floor(Math.random() * 5)
  })) as TenantWithConnection[];
}

/**
 * Get all landlords for a tenant with their connection details (mock)
 */
export async function getTenantLandlords(tenantId: string): Promise<LandlordWithConnection[]> {
  console.log(`Mock: Getting landlords for tenant ${tenantId}`);
  
  const { data: landlords } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_type', 'landlord')
    .limit(5);
  
  if (!landlords || landlords.length === 0) {
    return [];
  }
  
  return landlords.map(landlord => ({
    ...landlord,
    connection_id: `mock-${Date.now()}-${landlord.id}`,
    unread_count: Math.floor(Math.random() * 5)
  })) as LandlordWithConnection[];
}

/**
 * Update unread count in connection (mock)
 */
export async function updateConnectionUnreadCount(connectionId: string, count: number) {
  console.log(`Mock: Updating unread count for connection ${connectionId} to ${count}`);
  return true;
}
