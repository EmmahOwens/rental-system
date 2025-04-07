
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

/**
 * Helper function to refresh the auth token periodically
 * Should be called on application init or when a user logs in
 */
export function setupTokenRefresh(intervalMinutes = 55) {
  // Supabase tokens expire after 60 minutes, so refresh slightly before that
  const intervalMs = intervalMinutes * 60 * 1000;
  
  const intervalId = setInterval(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Token refresh failed:", error);
      } else if (data.session) {
        console.log("Token refreshed successfully");
      } else {
        console.log("No session to refresh");
      }
    } catch (e) {
      console.error("Error in token refresh:", e);
    }
  }, intervalMs);
  
  // Return the interval ID so it can be cleared if needed
  return intervalId;
}
