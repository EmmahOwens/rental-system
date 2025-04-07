
import { useAuth as useAuthContext } from "@/contexts/AuthContext";

// Re-export the hook to maintain compatibility
export function useAuth() {
  const auth = useAuthContext();
  // Return the original auth context with an additional 'user' property
  // that references 'currentUser' for backward compatibility
  return {
    ...auth,
    user: auth.currentUser
  };
}
