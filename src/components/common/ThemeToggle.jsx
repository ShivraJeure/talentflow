import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border border-gray-300
                 bg-gray-100 px-4 py-2
                 text-gray-800
                 hover:bg-gray-200
                 dark:border-gray-700
                 dark:bg-gray-800
                 dark:text-white
                 dark:hover:bg-gray-700"
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
};

export default ThemeToggle;