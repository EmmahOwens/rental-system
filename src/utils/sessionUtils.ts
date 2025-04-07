
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures the Supabase token is refreshed properly
 * Can be used to initialize the app to ensure proper authentication state
 */
export async function initializeAuthState() {
  try {
    // First, check if there's a valid session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error checking session:", error);
      return null;
    }
    
    // If no session, try to refresh token
    if (!session) {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error("Error refreshing token:", refreshError);
        return null;
      }
      
      return refreshData.session;
    }
    
    return session;
  } catch (error) {
    console.error("Error in initializeAuthState:", error);
    return null;
  }
}

/**
 * Updates user metadata
 */
export async function updateUserMetadata(metadata: Record<string, any>) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    });
    
    if (error) throw error;
    
    return data.user;
  } catch (error) {
    console.error("Error updating user metadata:", error);
    throw error;
  }
}

/**
 * Checks if the current user has a valid session
 */
export async function hasValidSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return !!data.session;
  } catch (error) {
    console.error("Error checking session validity:", error);
    return false;
  }
}
