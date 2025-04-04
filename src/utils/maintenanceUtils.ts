
import { supabase } from "@/integrations/supabase/client";

export interface MaintenanceRequest {
  id: string;
  tenant_id: string;
  landlord_id: string;
  property_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  tenant?: {
    first_name: string;
    last_name: string;
    phone?: string;
  };
  landlord?: {
    first_name: string;
    last_name: string;
  };
  property_unit?: {
    unit_number: string;
    property: {
      name: string;
      address: string;
    };
  };
}

// Mock functions for maintenance requests
// These would be replaced with actual implementations once the maintenance_requests table is properly configured

export const createMaintenanceRequest = async (
  tenantId: string,
  landlordId: string,
  requestData: {
    title: string;
    description: string;
    priority: MaintenanceRequest['priority'];
    property_id: string;
  }
): Promise<MaintenanceRequest | null> => {
  try {
    console.log(`Mock: Creating maintenance request from tenant ${tenantId} to landlord ${landlordId}`);
    
    return {
      id: `mock-${Date.now()}`,
      tenant_id: tenantId,
      landlord_id: landlordId,
      property_id: requestData.property_id,
      title: requestData.title,
      description: requestData.description,
      priority: requestData.priority,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in createMaintenanceRequest:", error);
    return null;
  }
};

export const updateMaintenanceRequestStatus = async (
  requestId: string,
  status: MaintenanceRequest['status'],
  resolvedAt?: string
): Promise<MaintenanceRequest | null> => {
  try {
    console.log(`Mock: Updating maintenance request ${requestId} status to ${status}`);
    
    return {
      id: requestId,
      tenant_id: "mock-tenant-id",
      landlord_id: "mock-landlord-id",
      property_id: "mock-property-id",
      title: "Mock Maintenance Request",
      description: "This is a mock maintenance request",
      priority: 'medium',
      status: status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resolved_at: status === 'completed' ? (resolvedAt || new Date().toISOString()) : undefined
    };
  } catch (error) {
    console.error("Error in updateMaintenanceRequestStatus:", error);
    return null;
  }
};

export const getTenantMaintenanceRequests = async (tenantId: string): Promise<MaintenanceRequest[]> => {
  try {
    console.log(`Mock: Getting maintenance requests for tenant ${tenantId}`);
    
    return [
      {
        id: `mock-${Date.now()}-1`,
        tenant_id: tenantId,
        landlord_id: "mock-landlord-id",
        property_id: "mock-property-id",
        title: "Broken Faucet",
        description: "The kitchen faucet is leaking",
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        landlord: {
          first_name: "John",
          last_name: "Doe"
        },
        property_unit: {
          unit_number: "101",
          property: {
            name: "Oak Apartments",
            address: "123 Main St"
          }
        }
      },
      {
        id: `mock-${Date.now()}-2`,
        tenant_id: tenantId,
        landlord_id: "mock-landlord-id",
        property_id: "mock-property-id",
        title: "AC Not Working",
        description: "The air conditioner isn't cooling",
        priority: 'high',
        status: 'in_progress',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updated_at: new Date().toISOString(),
        landlord: {
          first_name: "John",
          last_name: "Doe"
        },
        property_unit: {
          unit_number: "101",
          property: {
            name: "Oak Apartments",
            address: "123 Main St"
          }
        }
      }
    ];
  } catch (error) {
    console.error("Error in getTenantMaintenanceRequests:", error);
    return [];
  }
};

export const getLandlordMaintenanceRequests = async (landlordId: string): Promise<MaintenanceRequest[]> => {
  try {
    console.log(`Mock: Getting maintenance requests for landlord ${landlordId}`);
    
    return [
      {
        id: `mock-${Date.now()}-1`,
        tenant_id: "mock-tenant-id-1",
        landlord_id: landlordId,
        property_id: "mock-property-id",
        title: "Broken Faucet",
        description: "The kitchen faucet is leaking",
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tenant: {
          first_name: "Jane",
          last_name: "Smith",
          phone: "555-1234"
        },
        property_unit: {
          unit_number: "101",
          property: {
            name: "Oak Apartments",
            address: "123 Main St"
          }
        }
      },
      {
        id: `mock-${Date.now()}-2`,
        tenant_id: "mock-tenant-id-2",
        landlord_id: landlordId,
        property_id: "mock-property-id",
        title: "AC Not Working",
        description: "The air conditioner isn't cooling",
        priority: 'high',
        status: 'in_progress',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updated_at: new Date().toISOString(),
        tenant: {
          first_name: "Bob",
          last_name: "Johnson",
          phone: "555-5678"
        },
        property_unit: {
          unit_number: "202",
          property: {
            name: "Oak Apartments",
            address: "123 Main St"
          }
        }
      }
    ];
  } catch (error) {
    console.error("Error in getLandlordMaintenanceRequests:", error);
    return [];
  }
};
