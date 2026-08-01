import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "ប្តូរទៅផ្ទាំងភ្លឺ" : "ប្តូរទៅផ្ទាំងងងឹត"}
      title={isDark ? "ផ្ទាំងភ្លឺ" : "ផ្ទាំងងងឹត"}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface-raised text-ink-muted transition duration-200 ease-spring hover:border-line-strong hover:text-ink active:scale-95 sm:h-10 sm:w-10"
    >
      {/* Both icons stay mounted and cross-fade — no layout jump on toggle. */}
      <Sun
        size={17}
        className={`absolute transition-all duration-300 ease-spring ${
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        size={17}
        className={`absolute transition-all duration-300 ease-spring ${
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
