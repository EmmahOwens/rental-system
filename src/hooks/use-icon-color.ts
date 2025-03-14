import { useTheme } from "@/hooks/use-theme";

export function useIconColor() {
  const { theme } = useTheme();
  
  // Return a color based on the current theme
  return theme === "dark" ? "text-white" : "text-primary";
}