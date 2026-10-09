
import { useMemo } from "react";
import { useSelector } from "react-redux";

const EmployeeUtilization = () => {
  const employees = useSelector(
    (state) => state.employees.employees
  );

  const { projects, allocations } = useSelector(
    (state) => state.projects
  );

  const employeeUtilization = useMemo(() => {
    return employees
      .map((employee) => {
        const employeeAllocations = allocations.filter(
          (allocation) => allocation.employeeId === employee.id
        );

        const allocatedPercentage = employeeAllocations.reduce(
          (total, allocation) =>
            total + allocation.allocationPercentage,
          0
        );

        return {
          ...employee,
          allocatedPercentage,
          remainingCapacity: Math.max(0, 100 - allocatedPercentage),
          projectCount: employeeAllocations.length,
        };
      })
      .sort(
        (a, b) => b.allocatedPercentage - a.allocatedPercentage
      );
  }, [employees, allocations]);

  const projectStaffing = useMemo(() => {
    return projects.map((project) => {
      const teamSize = allocations.filter(
        (allocation) => allocation.projectId === project.id
      ).length;

      return {
        ...project,
        teamSize,
      };
    });
  }, [projects, allocations]);

  const totalAllocated = allocations.reduce(
    (total, allocation) =>
      total + allocation.allocationPercentage,
    0
  );

  const averageUtilization = employees.length
    ? Math.round(totalAllocated / employees.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Employees
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {employees.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Active Allocations
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {allocations.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Average Team Utilization
          </p>
          <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
            {averageUtilization}%
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Employee Resource Utilization
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor allocated workload and remaining employee capacity.
        </p>

        <div className="mt-5 space-y-5">
          {employeeUtilization.map((employee) => (
            <div key={employee.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {employee.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {employee.role} · {employee.projectCount} project(s)
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {employee.allocatedPercentage}% allocated
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {employee.remainingCapacity}% remaining
                  </p>
                </div>
              </div>

              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full rounded-full transition-all ${
                    employee.allocatedPercentage >= 100
                      ? "bg-red-500"
                      : employee.allocatedPercentage >= 75
                        ? "bg-amber-500"
                        : "bg-blue-600"
                  }`}
                  style={{
                    width: `${Math.min(
                      employee.allocatedPercentage,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Project Staffing Overview
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {projectStaffing.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {project.name}
                </h3>

                <span className="shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {project.teamSize} assigned
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {project.client}
              </p>

              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Required skills
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {project.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EmployeeUtilization;
