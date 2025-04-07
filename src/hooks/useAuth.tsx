
import { useAuth as useAuthContext } from "@/contexts/AuthContext";

// Re-export the hook to maintain compatibility
export function useAuth() {
  return useAuthContext();
}
