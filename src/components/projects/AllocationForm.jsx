import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  allocateEmployeeWithValidation,
  clearAllocationMessages,
} from "../../features/projects/projectSlice";
import { getSkillMatch } from "../../utils/skillMatching";

const AllocationForm = () => {
  const dispatch = useDispatch();

  const { projects, allocations, errorMessage, successMessage } = useSelector(
    (state) => state.projects,
  );

  const employees = useSelector((state) => state.employees.employees);

  const [employeeId, setEmployeeId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [allocationPercentage, setAllocationPercentage] = useState("50");

  const selectedEmployee = employees.find(
    (employee) => employee.id === Number(employeeId),
  );

  const selectedProject = projects.find(
    (project) => project.id === Number(projectId),
  );

  const totalAllocated = allocations
    .filter((allocation) => allocation.employeeId === Number(employeeId))
    .reduce((total, allocation) => total + allocation.allocationPercentage, 0);

  const remainingCapacity = employeeId ? 100 - totalAllocated : 100;

  const skillMatch =
    selectedEmployee && selectedProject
      ? getSkillMatch(selectedEmployee.skills, selectedProject.requiredSkills)
      : null;

  const duplicateAllocation = allocations.some(
    (allocation) =>
      allocation.employeeId === Number(employeeId) &&
      allocation.projectId === Number(projectId),
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(
      allocateEmployeeWithValidation({
        employeeId: Number(employeeId),
        projectId: Number(projectId),
        allocationPercentage: Number(allocationPercentage),
      }),
    );
  };

  const handleFieldChange = (setter) => (event) => {
    dispatch(clearAllocationMessages());
    setter(event.target.value);
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Allocate Employee
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Review skills and available capacity before assigning an employee.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="employeeId"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Employee
          </label>

          <select
            id="employeeId"
            value={employeeId}
            onChange={handleFieldChange(setEmployeeId)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select employee</option>

            {employees.map((employee) => (
              <option
                key={employee.id}
                value={employee.id}
                disabled={employee.availability === "Not Available"}
              >
                {employee.name} — {employee.role} — {employee.availability}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="projectId"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Project
          </label>

          <select
            id="projectId"
            value={projectId}
            onChange={handleFieldChange(setProjectId)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select project</option>

            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {skillMatch && (
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Skill Match
              </h3>

              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {skillMatch.matchPercentage}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${skillMatch.matchPercentage}%` }}
              />
            </div>

            <p className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-300">
              Matching skills
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {skillMatch.matchedSkills.length > 0 ? (
                skillMatch.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  No matching skills
                </span>
              )}
            </div>

            {skillMatch.missingSkills.length > 0 && (
              <>
                <p className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-300">
                  Skill gaps
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {skillMatch.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="allocationPercentage"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Allocation percentage
            </label>

            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {remainingCapacity}% available
            </span>
          </div>

          <input
            id="allocationPercentage"
            type="number"
            min="1"
            max={remainingCapacity}
            step="1"
            value={allocationPercentage}
            onChange={handleFieldChange(setAllocationPercentage)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {duplicateAllocation && (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            This employee is already assigned to this project.
          </p>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300"
          >
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p
            role="status"
            className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300"
          >
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={
            !employeeId ||
            !projectId ||
            remainingCapacity <= 0 ||
            duplicateAllocation
          }
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Allocate Employee
        </button>
      </form>
    </section>
  );
};

export default AllocationForm;
