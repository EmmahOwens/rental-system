
import { useTheme } from "@/contexts/ThemeContext";

export function useIconColor() {
  const { isDarkMode } = useTheme();
  
  return isDarkMode ? "hsl(var(--primary))" : "black";
}
