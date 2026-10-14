
import { useSelector } from "react-redux";

const Skills = () => {
  const employeesState = useSelector((state) => state.employees);
  const employees = Array.isArray(employeesState)
    ? employeesState
    : employeesState?.employees ?? employeesState?.data ?? [];

  const skillCounts = employees.reduce((counts, employee) => {
    const skills = Array.isArray(employee.skills) ? employee.skills : [];

    skills.forEach((skill) => {
      if (typeof skill !== "string" || !skill.trim()) return;

      const normalizedSkill = skill.trim();
      const key = normalizedSkill.toLowerCase();

      if (!counts[key]) {
        counts[key] = { name: normalizedSkill, count: 0 };
      }

      counts[key].count += 1;
    });

    return counts;
  }, {});

  const skills = Object.values(skillCounts).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="space-y-6 text-gray-900 dark:text-white">
      <div>
        <h1 className="text-2xl font-bold">Skills</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Explore employee skills and identify available expertise across your
          team.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Unique Skills
          </p>
          <p className="mt-2 text-3xl font-bold">{skills.length}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Employees Analyzed
          </p>
          <p className="mt-2 text-3xl font-bold">{employees.length}</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-5 dark:border-gray-700">
          <h2 className="font-semibold">Skill Matrix</h2>
        </div>

        {skills.length === 0 ? (
          <p className="p-5 text-sm text-gray-500 dark:text-gray-400">
            No skills found. Ensure employee records contain a skills array,
            such as ["React", "JavaScript", "CSS"].
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-5 py-3">Skill</th>
                  <th className="px-5 py-3">Employees</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr
                    key={skill.name}
                    className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                  >
                    <td className="px-5 py-3 font-medium">{skill.name}</td>
                    <td className="px-5 py-3">{skill.count}</td>
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

export default Skills;
