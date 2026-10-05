const stats = [
  {
    title: 'Total Employees',
    value: '248',
  },
  {
    title: 'Active Projects',
    value: '32',
  },
  {
    title: 'Available Employees',
    value: '47',
  },
  {
    title: 'Average Utilization',
    value: '78%',
  },
]

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Overview of employees, projects and resource allocation.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.title}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard