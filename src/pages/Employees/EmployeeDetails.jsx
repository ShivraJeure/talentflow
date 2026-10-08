import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const EmployeeDetails = () => {
  const { id } = useParams();

  const employee = useSelector((state) =>
    state.employees.employees.find(
      (employee) => employee.id === Number(id)
    )
  );

  if (!employee) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Employee Not Found
        </h2>

        <Link
          to="/employees"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to Employees
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/employees"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Employees
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {employee.name}
            </h1>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {employee.email}
            </p>

            <span className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {employee.role}
            </span>
          </div>

          <div className="rounded-lg bg-gray-50 px-5 py-4 dark:bg-gray-700">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Availability
            </p>

            <p className="mt-1 font-semibold text-green-600">
              {employee.availability}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Skills
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">
            {employee.skills?.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Employee Information
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Employee ID
              </p>

              <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                {employee.id}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Role
              </p>

              <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                {employee.role}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Availability
              </p>

              <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                {employee.availability}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;