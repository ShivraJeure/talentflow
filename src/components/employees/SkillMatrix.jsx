
import { memo } from "react";
import { getSkillName, getSkillLevel } from "../../utils/skillAnalysis";

const SkillMatrix = memo(function SkillMatrix({ employee }) {
  const skills = employee?.skills || [];

  const getLevelLabel = (level) => {
    const labels = {
      1: "Beginner",
      2: "Basic",
      3: "Intermediate",
      4: "Advanced",
      5: "Expert",
    };

    return labels[level] || "Intermediate";
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Skill Matrix
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {employee?.name || "Employee"} · {skills.length} skills
          </p>
        </div>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-slate-500">
          No skills recorded for this employee.
        </p>
      ) : (
        <div className="space-y-4">
          {skills.map((skill, index) => {
            const name = getSkillName(skill);
            const level = getSkillLevel(skill);

            return (
              <div key={`${name}-${index}`}>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {getLevelLabel(level)}
                  </span>
                </div>

                <div
                  className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
                  role="progressbar"
                  aria-label={`${name} proficiency`}
                  aria-valuemin={1}
                  aria-valuemax={5}
                  aria-valuenow={level}
                >
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${level * 20}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
});

export default SkillMatrix;
