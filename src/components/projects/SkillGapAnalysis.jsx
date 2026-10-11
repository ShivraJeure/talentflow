
import { memo, useMemo, useState } from "react";
import { analyzeEmployeeSkills } from "../../utils/skillAnalysis";

const SkillGapAnalysis = memo(function SkillGapAnalysis({
  project,
  employees = [],
}) {
  const [search, setSearch] = useState("");

  const analysis = useMemo(() => {
    const results = employees.map((employee) => ({
      employee,
      ...analyzeEmployeeSkills(employee, project),
    }));

    return results.sort(
      (a, b) =>
        b.coverage - a.coverage ||
        b.proficiencyScore - a.proficiencyScore
    );
  }, [employees, project]);

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return analysis;

    return analysis.filter(({ employee }) => {
      const nameMatches = employee.name
        ?.toLowerCase()
        .includes(query);

      const roleMatches = employee.role
        ?.toLowerCase()
        .includes(query);

      const skillMatches = (employee.skills || []).some(
        (skill) => {
          const skillName =
            typeof skill === "string" ? skill : skill?.name;

          return skillName?.toLowerCase().includes(query);
        }
      );

      return nameMatches || roleMatches || skillMatches;
    });
  }, [analysis, search]);

  const requiredSkills =
    project?.requiredSkills || project?.skills || [];

  if (requiredSkills.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Skill-Gap Analysis
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Add required skills to this project to analyze employee matches.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Skill-Gap Analysis
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Project: {project.name || project.title || "Selected project"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {requiredSkills.map((skill, index) => {
          const name =
            typeof skill === "string" ? skill : skill?.name;

          return (
            <span
              key={`${name}-${index}`}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
            >
              {name}
            </span>
          );
        })}
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search employees, roles or skills..."
        aria-label="Search skill analysis results"
        className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:text-white"
      />

      {filteredResults.length === 0 ? (
        <p className="text-sm text-slate-500">
          No employees match your search.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredResults.map(
            ({
              employee,
              matchedSkills,
              missingSkills,
              coverage,
              proficiencyScore,
            }) => (
              <article
                key={employee.id}
                className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {employee.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {employee.role || "Employee"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600">
                      {coverage}%
                    </p>
                    <p className="text-xs text-slate-500">
                      Skill coverage
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${coverage}%` }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Proficiency score: {proficiencyScore}%
                </p>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Matched skills
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {matchedSkills.length ? (
                      matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">
                        No matching skills yet
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Skills to develop
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {missingSkills.length ? (
                      missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-600">
                        All required skills matched
                      </span>
                    )}
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
});

export default SkillGapAnalysis;
