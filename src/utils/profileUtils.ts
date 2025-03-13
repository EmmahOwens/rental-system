
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/contexts/AuthContext";

// Connect a tenant to a landlord automatically
export const assignTenantToLandlord = async (tenantId: string) => {
  try {
    // Find a landlord to assign the tenant to
    const { data: landlords, error: landlordError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_type", "landlord")
      .limit(1);
    
    if (landlordError || !landlords || landlords.length === 0) {
      console.error("No landlords found to assign tenant to:", landlordError);
      return null;
    }
    
    const landlordId = landlords[0].id;
    
    // Create a connection record between tenant and landlord
    const { data, error } = await supabase
      .from("tenant_landlord_connections")
      .insert({
        tenant_id: tenantId,
        landlord_id: landlordId,
        status: "active",
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error connecting tenant to landlord:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in assignTenantToLandlord:", error);
    return null;
  }
};

// Update profile with additional details
export const updateUserProfileDetails = async (
  userId: string, 
  profileData: { first_name?: string; last_name?: string; phone?: string; avatar_url?: string }
) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("user_id", userId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating profile details:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateUserProfileDetails:", error);
    return null;
  }
};

// Get tenant's landlord information
export const getTenantLandlord = async (tenantId: string) => {
  try {
    const { data, error } = await supabase
      .from("tenant_landlord_connections")
      .select(`
        landlord_id,
        landlords:profiles!tenant_landlord_connections_landlord_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url,
          user_type,
          phone
        )
      `)
      .eq("tenant_id", tenantId)
      .eq("status", "active")
      .single();
      
    if (error) {
      console.error("Error getting tenant's landlord:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getTenantLandlord:", error);
    return null;
  }
};

// Get landlord's tenants
export const getLandlordTenants = async (landlordId: string) => {
  try {
    const { data, error } = await supabase
      .from("tenant_landlord_connections")
      .select(`
        tenant_id,
        tenants:profiles!tenant_landlord_connections_tenant_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url,
          user_type,
          phone
        )
      `)
      .eq("landlord_id", landlordId)
      .eq("status", "active");
      
    if (error) {
      console.error("Error getting landlord's tenants:", error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("Error in getLandlordTenants:", error);
    return [];
  }
};
