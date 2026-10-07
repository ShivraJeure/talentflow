import React from "react";

const EmployeeCard = React.memo(({ employee }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {employee.name}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {employee.role}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            employee.availability === "Available"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {employee.availability}
        </span>
      </div>

      <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
        {employee.email}
      </p>

      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        Experience: {employee.experience} years
      </p>

      <div className="flex flex-wrap gap-2">
        {employee.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
});

export default EmployeeCard;