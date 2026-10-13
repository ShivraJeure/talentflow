import { useState } from "react";
import { generateProjectMatches } from "../../services/aiService";
import { normalizeApiError } from "../../utils/productionHelpers";

const initialEmployees = [
  {
    id: "EMP-101",
    name: "Vikram Joshi",
    skills: ["React", "JavaScript", "CSS", "Redux Toolkit"],
    experience: 4,
    availability: "Available",
  },
  {
    id: "EMP-102",
    name: "Priya Sharma",
    skills: ["JavaScript", "HTML", "CSS", "React"],
    experience: 3,
    availability: "Available",
  },
  {
    id: "EMP-103",
    name: "Rahul Patil",
    skills: ["React", "TypeScript", "Node.js", "REST APIs"],
    experience: 5,
    availability: "Partially Available",
  },
];

const AIAssistant = () => {
  const [projectName, setProjectName] = useState(
    "Employee Allocation Dashboard",
  );

  const [requiredSkills, setRequiredSkills] = useState(
    "React, JavaScript, Redux Toolkit, REST APIs",
  );

  const [employeeJson, setEmployeeJson] = useState(
    JSON.stringify(initialEmployees, null, 2),
  );

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      let employees;

      try {
        employees = JSON.parse(employeeJson);
      } catch {
        throw new Error("Employee data must contain valid JSON.");
      }

      if (!Array.isArray(employees)) {
        throw new Error("Employee data must be a JSON array.");
      }

      const skills = requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const data = await generateProjectMatches({
        project: {
          name: projectName.trim(),
          requiredSkills: skills,
        },
        employees,
      });

      setResult(data);
    } catch (err) {
      setError(
        err.message === "Employee data must contain valid JSON." ||
          err.message === "Employee data must be a JSON array."
          ? err.message
          : normalizeApiError(err),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          TalentFlow Intelligence
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          TalentFlow Project Allocation Assistant
        </h1>

        <p className="mt-2 text-sm text-indigo-600">
          {result?.matchingMethod === "rule-based"
            ? "Rule-Based Matching · No API credits required"
            : result
              ? "OpenAI-Powered Matching"
              : "Employee matching and skill-gap analysis"}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Discover suitable employees, identify missing skills, and review
          explainable project-match recommendations.
        </p>
      </div>

      <form
        onSubmit={handleAnalyze}
        className="space-y-5 rounded-2xl border border-gray-200 p-5 shadow-sm dark:border-gray-700"
      >
        <div>
          <label
            htmlFor="projectName"
            className="mb-2 block text-sm font-medium"
          >
            Project name
          </label>

          <input
            id="projectName"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            required
            maxLength={150}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="requiredSkills"
            className="mb-2 block text-sm font-medium"
          >
            Required skills (comma-separated)
          </label>

          <input
            id="requiredSkills"
            value={requiredSkills}
            onChange={(event) => setRequiredSkills(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="React, JavaScript, Redux Toolkit"
          />
        </div>

        <div>
          <label
            htmlFor="employeeJson"
            className="mb-2 block text-sm font-medium"
          >
            Employee data (JSON array)
          </label>

          <textarea
            id="employeeJson"
            value={employeeJson}
            onChange={(event) => setEmployeeJson(event.target.value)}
            required
            rows={12}
            spellCheck={false}
            className="w-full rounded-lg border border-gray-300 bg-transparent p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <p className="mt-2 text-xs text-gray-500">
            Use authorized project data and avoid including personal or
            confidential employee information.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Analyzing candidates..." : "Generate AI Recommendations"}
        </button>
      </form>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
        >
          {error}
        </div>
      )}

      {loading && (
        <div role="status" className="rounded-xl border p-4 text-sm">
          AI is evaluating the supplied skills and project requirements. Please
          wait.
        </div>
      )}

      {result && (
        <section className="space-y-5">
          <div className="rounded-2xl border p-5">
            <h2 className="text-xl font-bold">Matching Summary</h2>

            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {result.summary}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {result.matches.map((match) => (
              <article
                key={match.employeeId}
                className="space-y-4 rounded-2xl border border-gray-200 p-5 shadow-sm dark:border-gray-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {match.employeeName}
                    </h3>

                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      ID: {match.employeeId}
                    </p>
                  </div>

                  <div className="rounded-xl bg-indigo-50 px-3 py-2 text-center dark:bg-indigo-950">
                    <p className="text-2xl font-bold text-indigo-600">
                      {match.matchScore}%
                    </p>
                    <p className="text-xs">
                      {result.matchingMethod === "rule-based"
                        ? "Rule-Based Score"
                        : "AI Match Score"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Matching skills</h4>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {match.matchedSkills.length > 0 ? (
                      match.matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-800 dark:bg-green-950 dark:text-green-200"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No matching skills identified.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Skill gaps</h4>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {match.missingSkills.length > 0 ? (
                      match.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No skill gaps reported.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Why this candidate?</h4>

                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {match.explanation}
                  </p>
                </div>

                {match.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold">
                      Development recommendations
                    </h4>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
                      {match.recommendations.map((recommendation, index) => (
                        <li key={`${index}-${recommendation}`}>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>

          {result.caveats.length > 0 && (
            <div className="rounded-xl border p-4">
              <h3 className="font-semibold">Considerations</h3>

              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-500">
                {result.caveats.map((caveat, index) => (
                  <li key={`${index}-${caveat}`}>{caveat}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-gray-500">
            AI scores are estimates, not objective measurements of employee
            performance. Validate recommendations against actual skills,
            availability, and project needs.
          </p>
        </section>
      )}
    </div>
  );
};

export default AIAssistant;
