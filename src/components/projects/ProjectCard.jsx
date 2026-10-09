import { useMemo } from "react";
import { getSkillMatch } from "../../utils/skillMatching";

const statusStyles = {
  "In Progress":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Planning:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Completed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

const ProjectCard = ({ project, teamSize, employees }) => {
  const topMatches = useMemo(() => {
    return employees
      .map((employee) => {
        const match = getSkillMatch(
          employee.skills,
          project.requiredSkills
        );

        return {
          ...employee,
          ...match,
        };
      })
      .filter((employee) => employee.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 3);
  }, [employees, project.requiredSkills]);

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {project.client}
          </p>

          <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            {project.name}
          </h2>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[project.status] ||
            "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          {project.status}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
        {project.description}
      </p>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
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

      <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Top skill matches
        </h3>

        {topMatches.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No matching employee skills found.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {topMatches.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                    {employee.name}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {employee.matchedSkills.length} of{" "}
                    {project.requiredSkills.length} required skills
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  {employee.matchPercentage}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Team members
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {teamSize}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Project period
          </p>

          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {project.startDate} – {project.endDate}
          </p>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;