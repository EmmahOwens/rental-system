
import { useTheme } from "@/contexts/ThemeContext";

export function useIconColor() {
  const { isDarkMode } = useTheme();
  return isDarkMode ? "hsl(var(--primary))" : "hsl(222.2 84% 4.9%)";
}
