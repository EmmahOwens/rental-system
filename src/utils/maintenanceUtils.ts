import { supabase } from "@/integrations/supabase/client";

export interface MaintenanceRequest {
  id: string;
  tenant_id: string;
  landlord_id: string;
  property_unit_id?: string;
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

export const createMaintenanceRequest = async (
  tenantId: string,
  landlordId: string,
  requestData: {
    title: string;
    description: string;
    priority: MaintenanceRequest['priority'];
    property_unit_id?: string;
  }
): Promise<MaintenanceRequest | null> => {
  try {
    const { data, error } = await supabase
      .from("maintenance_requests")
      .insert({
        tenant_id: tenantId,
        landlord_id: landlordId,
        ...requestData
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating maintenance request:", error);
      return null;
    }
    
    return data;
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
    const updateData: any = { status };
    if (status === 'completed' && !resolvedAt) {
      updateData.resolved_at = new Date().toISOString();
    } else if (resolvedAt) {
      updateData.resolved_at = resolvedAt;
    }
    
    const { data, error } = await supabase
      .from("maintenance_requests")
      .update(updateData)
      .eq("id", requestId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating maintenance request status:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateMaintenanceRequestStatus:", error);
    return null;
  }
};

export const getTenantMaintenanceRequests = async (tenantId: string): Promise<MaintenanceRequest[]> => {
  try {
    const { data, error } = await supabase
      .from("maintenance_requests")
      .select(`
        *,
        landlord:profiles!maintenance_requests_landlord_id_fkey(first_name, last_name),
        property_unit:property_units(
          unit_number,
          property:properties(name, address)
        )
      `)
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching tenant maintenance requests:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getTenantMaintenanceRequests:", error);
    return [];
  }
};

export const getLandlordMaintenanceRequests = async (landlordId: string): Promise<MaintenanceRequest[]> => {
  try {
    const { data, error } = await supabase
      .from("maintenance_requests")
      .select(`
        *,
        tenant:profiles!maintenance_requests_tenant_id_fkey(first_name, last_name, phone),
        property_unit:property_units(
          unit_number,
          property:properties(name, address)
        )
      `)
      .eq("landlord_id", landlordId)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching landlord maintenance requests:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getLandlordMaintenanceRequests:", error);
    return [];
  }
};