
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const employeesState = useSelector((state) => state.employees);
  const employees = Array.isArray(employeesState)
    ? employeesState
    : employeesState?.employees ?? employeesState?.data ?? [];

  const projectsState = useSelector((state) => state.projects);
  const projects = Array.isArray(projectsState)
    ? projectsState
    : projectsState?.projects ?? projectsState?.data ?? [];

  const skillSet = [
    ...new Set(
      employees.flatMap((employee) =>
        Array.isArray(employee.skills) ? employee.skills : []
      )
    ),
  ];

  const stats = [
    { label: "Total Employees", value: employees.length },
    { label: "Total Projects", value: projects.length },
    { label: "Unique Skills", value: skillSet.length },
  ];

  return (
    <div className="space-y-6 text-gray-900 dark:text-white">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to TalentFlow Employee Management Platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Recent Employees</h2>
          <Link
            to="/employees"
            className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View all
          </Link>
        </div>

        {employees.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No employee data found. Check your employee Redux state or load the
            employee records first.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <tr>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Role</th>
                  <th className="py-3">Availability</th>
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 5).map((employee, index) => (
                  <tr
                    key={employee.id ?? employee._id ?? index}
                    className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                  >
                    <td className="py-3 pr-4 font-medium">
                      {employee.name ?? "Unnamed"}
                    </td>
                    <td className="py-3 pr-4">
                      {employee.role ?? "Not specified"}
                    </td>
                    <td className="py-3">
                      {employee.availability ?? "Not specified"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
