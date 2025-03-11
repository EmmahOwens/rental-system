
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useIconColor } from "@/hooks/use-icon-color";

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  const iconColor = useIconColor();

  return (
    <button
      onClick={toggleTheme}
      className="neumorph p-2 rounded-full h-10 w-10 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Moon className="h-5 w-5" color={iconColor} />
      ) : (
        <Sun className="h-5 w-5" color={iconColor} />
      )}
    </button>
  );
}
