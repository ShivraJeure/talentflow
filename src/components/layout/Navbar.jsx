import ThemeToggle from "../common/ThemeToggle";

const Navbar = () => {
  return (
    <header
      className="flex h-16 items-center justify-between
                 border-b border-gray-200
                 bg-white px-6
                 dark:border-gray-700
                 dark:bg-gray-900"
    >
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          TalentFlow
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Welcome, Shivraj
        </span>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;