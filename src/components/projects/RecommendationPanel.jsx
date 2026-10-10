
import { useMemo } from "react";
import { calculateEmployeeRecommendations } from "../../features/projects/recommendationUtils";

function RecommendationPanel({ project, employees, allocations }) {
  const recommendations = useMemo(
    () =>
      calculateEmployeeRecommendations(
        project,
        employees,
        allocations
      ),
    [project, employees, allocations]
  );

  const getScoreStyle = (score) => {
    if (score >= 80) {
      return "bg-green-100 text-green-700";
    }

    if (score >= 60) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <section className="mt-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Smart Employee Recommendations
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ranked using skills, experience and remaining capacity.
          </p>
        </div>

        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
          {recommendations.length} candidates
        </span>
      </div>

      {recommendations.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-5 text-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          No eligible employees are available for this project.
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.slice(0, 5).map((employee, index) => (
            <article
              key={employee.id}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                    {index + 1}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {employee.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {employee.role} · {employee.experience} years
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {employee.remainingCapacity}% capacity remaining
                    </p>
                  </div>
                </div>

                <div
                  className={`rounded-lg px-3 py-2 text-center ${getScoreStyle(
                    employee.score
                  )}`}
                >
                  <p className="text-xl font-bold">
                    {employee.score}%
                  </p>
                  <p className="text-xs">Match score</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Matched skills
                </p>

                <div className="flex flex-wrap gap-2">
                  {employee.matchedSkills.length > 0 ? (
                    employee.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      No required skills matched
                    </span>
                  )}
                </div>
              </div>

              {employee.missingSkills.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Skill gaps
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {employee.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Current utilization</span>
                  <span>{employee.currentAllocation}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{
                      width: `${Math.min(
                        employee.currentAllocation,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecommendationPanel;
