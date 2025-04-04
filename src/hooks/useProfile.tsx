
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Profile } from "@/utils/profileUtils";

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        throw error;
      }

      // Cast the user_type to ensure it's either 'tenant' or 'landlord'
      const typedData = {
        ...data,
        user_type: data.user_type as 'tenant' | 'landlord'
      };

      setProfile(typedData as Profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    
    // Set up listener for profile changes
    const profileSubscription = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles',
          filter: `user_id=eq.${user?.id}` 
        }, 
        () => {
          fetchProfile();
        }
      )
      .subscribe();

    return () => {
      profileSubscription.unsubscribe();
    };
  }, [user]);

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, error, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
