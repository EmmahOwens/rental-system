
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

// Add these functions to the existing profileUtils.ts file

export const updateUserProfile = async (
  profileId: string,
  profileData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    bio?: string;
  }
): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", profileId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating profile:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return null;
  }
};

export const uploadProfileAvatar = async (
  profileId: string,
  file: File
): Promise<string | null> => {
  try {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${profileId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
      
    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      return null;
    }
    
    // Get the public URL
    const { data } = await supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    const avatarUrl = data.publicUrl;
    
    // Update the profile with the new avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", profileId);
      
    if (updateError) {
      console.error("Error updating profile with avatar URL:", updateError);
      return null;
    }
    
    return avatarUrl;
  } catch (error) {
    console.error("Error in uploadProfileAvatar:", error);
    return null;
  }
};

export const updateUserSettings = async (
  userId: string,
  settings: {
    email_notifications?: boolean;
    sms_notifications?: boolean;
    theme_preference?: string;
    language_preference?: string;
  }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      });
      
    if (error) {
      console.error("Error updating user settings:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateUserSettings:", error);
    return false;
  }
};

export const getUserSettings = async (userId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error("Error fetching user settings:", error);
      return null;
    }
    
    // Return default settings if none exist
    if (!data) {
      return {
        email_notifications: true,
        sms_notifications: false,
        theme_preference: 'light',
        language_preference: 'en'
      };
    }
    
    return data;
  } catch (error) {
    console.error("Error in getUserSettings:", error);
    return null;
  }
};
