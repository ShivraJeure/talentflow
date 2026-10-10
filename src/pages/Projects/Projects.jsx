import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectCard from "../../components/projects/ProjectCard";
import AllocationForm from "../../components/projects/AllocationForm";
import EmployeeUtilization from "../../components/projects/EmployeeUtilization";
import { fetchEmployees } from "../../features/employees/employeeSlice";
import { removeAllocation } from "../../features/projects/projectSlice";
import RecommendationPanel from "../../components/projects/RecommendationPanel";

const Projects = () => {
  const dispatch = useDispatch();

  const { projects, allocations } = useSelector((state) => state.projects);

  const { employees, loading } = useSelector((state) => state.employees);

  useEffect(() => {
    if (!employees.length && !loading) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employees.length, loading]);

  const allocationRecords = useMemo(() => {
    return allocations.map((allocation) => {
      const employee = employees.find(
        (item) => item.id === allocation.employeeId,
      );

      const project = projects.find((item) => item.id === allocation.projectId);

      return {
        ...allocation,
        employeeName: employee?.name ?? "Unknown employee",
        employeeRole: employee?.role ?? "Unknown role",
        projectName: project?.name ?? "Unknown project",
      };
    });
  }, [allocations, employees, projects]);

  const getTeamSize = (projectId) =>
    allocations.filter((allocation) => allocation.projectId === projectId)
      .length;

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Project Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage projects, allocate employees, and monitor resource capacity.
        </p>
      </div>

      <EmployeeUtilization />

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Available Projects
        </h2>

        {projects.length === 0 ? (
          <p className="rounded-xl border border-gray-200 p-5 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No projects available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {projects.map((project) => (
              <div>
                <ProjectCard
                  key={project.id}  
                  project={project}
                  teamSize={getTeamSize(project.id)}
                  employees={employees.filter(
                    (employee) => employee.availability !== "Not Available",
                  )}
                />
                <RecommendationPanel
                  project={project}
                  employees={employees}
                  allocations={allocations}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Allocate Resources
        </h2>
        <AllocationForm />
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-5 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Allocation History
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review and manage current employee assignments.
          </p>
        </div>

        {allocationRecords.length === 0 ? (
          <p className="p-5 text-sm text-gray-500 dark:text-gray-400">
            No allocations yet. Use the allocation form to assign an employee.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium">Allocation</th>
                  <th className="px-5 py-3 font-medium">Assigned On</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {allocationRecords.map((allocation) => (
                  <tr key={allocation.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {allocation.employeeName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {allocation.employeeRole}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                      {allocation.projectName}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {allocation.allocationPercentage}%
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                      {allocation.assignedAt
                        ? new Date(allocation.assignedAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(removeAllocation(allocation.id))
                        }
                        className="font-medium text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        Remove
                      </button>
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

export default Projects;
