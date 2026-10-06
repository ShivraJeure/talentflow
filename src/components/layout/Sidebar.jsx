import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Employees", path: "/employees" },
    { name: "Projects", path: "/projects" },
    { name: "Skills", path: "/skills" },
  ];

  return (
    <aside
      className="w-64 border-r border-gray-200
                 bg-white p-4
                 dark:border-gray-700
                 dark:bg-gray-900"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          TalentFlow
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Resource Management
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm font-medium transition
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;