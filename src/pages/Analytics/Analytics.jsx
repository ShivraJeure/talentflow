
import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import MetricCard from "../../components/analytics/MetricCard";
import { buildAnalytics } from "../../utils/analyticsUtils";

const CHART_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
  "#84cc16",
];

const Panel = ({ title, subtitle, children }) => (
  <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
      {title}
    </h2>

    <p className="mb-5 mt-1 text-sm text-gray-500 dark:text-gray-400">
      {subtitle}
    </p>

    {children}
  </section>
);

const EmptyState = ({ message }) => (
  <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
    {message}
  </div>
);

const Analytics = () => {
  const state = useSelector((store) => store);

  const analytics = useMemo(
    () => buildAnalytics(state),
    [state]
  );

  const {
    employees,
    totalEmployees,
    totalProjects,
    availableEmployees,
    assignedEmployees,
    overallocatedEmployees,
    underutilizedEmployees,
    averageUtilization,
    skillDistribution,
    projectDistribution,
    utilizationDistribution,
  } = analytics;

  const hasEmployees = totalEmployees > 0;

  const resourceRows = [...employees].sort(
    (a, b) => b.utilization - a.utilization
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            TALENTFLOW / INSIGHTS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Monitor workforce capacity, project distribution, and skill coverage.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800">
          <span className="text-gray-500 dark:text-gray-400">
            Resource health
          </span>
          <p className="mt-1 font-semibold text-gray-900 dark:text-white">
            {overallocatedEmployees > 0
              ? `${overallocatedEmployees} overallocated`
              : "No recorded over-allocation"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Employees"
          value={totalEmployees}
          description="Employees in the current dataset"
          icon="👥"
        />

        <MetricCard
          title="Total Projects"
          value={totalProjects}
          description="Projects in the current dataset"
          icon="📁"
        />

        <MetricCard
          title="Available Employees"
          value={availableEmployees}
          description="Marked available in employee records"
          icon="✅"
        />

        <MetricCard
          title="Average Utilization"
          value={`${averageUtilization}%`}
          description={`${assignedEmployees} employees with recorded allocation`}
          icon="📊"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel
          title="Workforce Utilization"
          subtitle="Employee counts grouped by allocation and availability"
        >
          {hasEmployees ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={utilizationDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={95}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {utilizationDistribution.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Employee data will appear here when loaded." />
          )}
        </Panel>

        <Panel
          title="Skill Distribution"
          subtitle="Most frequently recorded employee skills"
        >
          {skillDistribution.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={skillDistribution}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#9ca3af"
                  opacity={0.25}
                />

                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  dataKey="skill"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  name="Employees"
                  fill="#6366f1"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No employee skills found. Add skills to employee records to populate this chart." />
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel
          title="Project Status"
          subtitle="Distribution of projects by their current status"
        >
          {projectDistribution.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={projectDistribution}
                margin={{ top: 10, right: 15, left: 0, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#9ca3af"
                  opacity={0.25}
                />

                <XAxis
                  dataKey="status"
                  tick={{ fontSize: 12 }}
                />

                <YAxis allowDecimals={false} />
                <Tooltip />

                <Bar
                  dataKey="count"
                  name="Projects"
                  fill="#06b6d4"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Project status data will appear here when projects are loaded." />
          )}
        </Panel>

        <Panel
          title="Resource Health"
          subtitle="Identify employees who may need allocation adjustments"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-red-50 p-4 dark:bg-red-950/30">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Overallocated
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Utilization above 100%
                </p>
              </div>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {overallocatedEmployees}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-amber-50 p-4 dark:bg-amber-950/30">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Underutilized
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Utilization above 0% and below 50%
                </p>
              </div>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {underutilizedEmployees}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Allocated Employees
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Employees with recorded allocation
                </p>
              </div>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {assignedEmployees}
              </span>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="Employee Utilization Details"
        subtitle="Review individual resource utilization and skills"
      >
        {resourceRows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  <th className="px-3 py-3 font-medium">Employee</th>
                  <th className="px-3 py-3 font-medium">Role</th>
                  <th className="px-3 py-3 font-medium">Skills</th>
                  <th className="px-3 py-3 font-medium">Utilization</th>
                </tr>
              </thead>

              <tbody>
                {resourceRows.map((employee, index) => (
                  <tr
                    key={employee.id ?? `${employee.name}-${index}`}
                    className="border-b border-gray-100 last:border-0 dark:border-gray-700"
                  >
                    <td className="px-3 py-4 font-medium text-gray-900 dark:text-white">
                      {employee.name}
                    </td>

                    <td className="px-3 py-4 text-gray-600 dark:text-gray-300">
                      {employee.role}
                    </td>

                    <td className="max-w-[250px] px-3 py-4 text-gray-600 dark:text-gray-300">
                      {employee.skills.slice(0, 4).join(", ") || "—"}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={`h-full rounded-full ${
                              employee.utilization > 100
                                ? "bg-red-500"
                                : employee.utilization >= 80
                                  ? "bg-emerald-500"
                                  : "bg-indigo-500"
                            }`}
                            style={{
                              width: `${Math.min(employee.utilization, 100)}%`,
                            }}
                          />
                        </div>

                        <span
                          className={`whitespace-nowrap font-medium ${
                            employee.utilization > 100
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {employee.utilization}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No employees available. Load your employee data to view utilization details." />
        )}
      </Panel>
    </div>
  );
};

export default Analytics;
