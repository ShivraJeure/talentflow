import { memo, useRef } from "react";

const EmployeeCard = ({ employee, onViewEmployee }) => {
  const renderCount = useRef(0);

  renderCount.current += 1;

  console.log(
    `${employee.name} rendered ${renderCount.current} time(s)`
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {employee.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {employee.email}
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {employee.role}
        </span>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          Skills
        </p>

        <div className="flex flex-wrap gap-2">
          {employee.skills?.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Availability
          </p>

          <p className="text-sm font-medium text-green-600">
            {employee.availability}
          </p>
        </div>

        <button
          onClick={() => onViewEmployee(employee)}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          View Profile
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Render count: {renderCount.current}
      </p>
    </div>
  );
};

export default memo(EmployeeCard);