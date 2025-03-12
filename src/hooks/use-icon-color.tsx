
import { useTheme } from "@/contexts/ThemeContext";
import { useMemo } from "react";

export function useIconColor() {
  const { isDarkMode } = useTheme();
  return useMemo(() => 
    isDarkMode ? "hsl(var(--primary))" : "hsl(222.2 84% 4.9%)"
  , [isDarkMode]);
}
