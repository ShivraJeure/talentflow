const toArray = (value) => {
  if (Array.isArray(value)) return value;
  return [];
};

const getArray = (source, keys) => {
  if (Array.isArray(source)) return source;
  if (!source || typeof source !== "object") return [];

  for (const key of keys) {
    if (Array.isArray(source[key])) return source[key];
  }

  return [];
};

const firstArray = (...values) =>
  values.find((value) => Array.isArray(value) && value.length > 0) ??
  values.find(Array.isArray) ??
  [];

const getEmployees = (state) => {
  return firstArray(
    toArray(state.employees),
    getArray(state.employees, ["employees", "items", "list", "data"]),
    getArray(state.employee, ["employees", "items", "list", "data"]),
    getArray(state.employees?.data, ["employees", "items", "list"]),
  );
};

const getProjects = (state) => {
  return firstArray(
    toArray(state.projects),
    getArray(state.projects, ["projects", "items", "list", "data"]),
    getArray(state.project, ["projects", "items", "list", "data"]),
  );
};

const getAllocations = (state, projects) => {
  const allocationState = state.allocations;

  const allocations = firstArray(
    toArray(allocationState),
    getArray(allocationState, ["allocations", "items", "list", "data"]),
    getArray(state.projects, ["allocations"]),
    getArray(state.project, ["allocations"]),
  );

  if (allocations.length) return allocations;

  return projects.flatMap((project) =>
    toArray(project.allocations).map((allocation) => ({
      ...allocation,
      projectId: allocation.projectId ?? allocation.project_id ?? project.id,
    })),
  );
};

const getEmployeeId = (allocation) =>
  allocation.employeeId ??
  allocation.employee_id ??
  allocation.employee?.id ??
  allocation.employee?.employeeId;

const getAllocationPercentage = (allocation) =>
  Number(
    allocation.allocationPercentage ??
      allocation.allocation_percentage ??
      allocation.percentage ??
      allocation.allocation ??
      0,
  );

const getUtilization = (employee, allocations) => {
  const explicitValue =
    employee.utilizationPercentage ??
    employee.utilization ??
    employee.allocatedPercentage;

  if (explicitValue !== undefined && explicitValue !== null) {
    return Math.max(0, Number(explicitValue) || 0);
  }

  const employeeAllocations = allocations.filter(
    (allocation) => String(getEmployeeId(allocation)) === String(employee.id),
  );

  if (employeeAllocations.length) {
    return employeeAllocations.reduce(
      (total, allocation) => total + getAllocationPercentage(allocation),
      0,
    );
  }

  return 0;
};

const getStatus = (employee) =>
  String(employee.availability ?? employee.status ?? "").toLowerCase();

const getSkills = (employee) =>
  toArray(employee.skills)
    .map((skill) =>
      typeof skill === "string" ? skill : (skill?.name ?? skill?.skillName),
    )
    .filter(Boolean);

export const buildAnalytics = (state) => {
  const employees = getEmployees(state);
  const projects = getProjects(state);
  const allocations = getAllocations(state, projects);

  const employeeMetrics = employees.map((employee) => {
    const utilization = getUtilization(employee, allocations);
    const status = getStatus(employee);

    return {
      id: employee.id,
      name:
        employee.name ??
        employee.fullName ??
        employee.employeeName ??
        "Unknown Employee",
      role: employee.role ?? employee.designation ?? "Not specified",
      utilization,
      availability: status,
      skills: getSkills(employee),
    };
  });

  const availableEmployees = employeeMetrics.filter(
    (employee) =>
      employee.availability.includes("available") &&
      !employee.availability.includes("unavailable") &&
      !employee.availability.includes("not available"),
  ).length;

  const assignedEmployees = employeeMetrics.filter(
    (employee) => employee.utilization > 0,
  ).length;

  const overallocatedEmployees = employeeMetrics.filter(
    (employee) => employee.utilization > 100,
  ).length;

  const underutilizedEmployees = employeeMetrics.filter(
    (employee) => employee.utilization > 0 && employee.utilization < 50,
  ).length;

  const averageUtilization = employeeMetrics.length
    ? Math.round(
        employeeMetrics.reduce(
          (total, employee) => total + employee.utilization,
          0,
        ) / employeeMetrics.length,
      )
    : 0;

  const skillCounts = {};

  employeeMetrics.forEach((employee) => {
    employee.skills.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  const skillDistribution = Object.entries(skillCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const projectStatusCounts = {};

  projects.forEach((project) => {
    const status = String(project.status ?? "Unspecified");
    projectStatusCounts[status] = (projectStatusCounts[status] || 0) + 1;
  });

  const projectDistribution = Object.entries(projectStatusCounts).map(
    ([status, count]) => ({ status, count }),
  );

  const utilizationDistribution = [
    {
      name: "Available",
      value: availableEmployees,
    },
    {
      name: "Allocated",
      value: employeeMetrics.filter(
        (employee) => employee.utilization >= 50 && employee.utilization <= 100,
      ).length,
    },
    {
      name: "Underutilized",
      value: underutilizedEmployees,
    },
    {
      name: "Overallocated",
      value: overallocatedEmployees,
    },
  ];

  return {
    employees: employeeMetrics,
    totalEmployees: employees.length,
    totalProjects: projects.length,
    totalAllocations: allocations.length,
    availableEmployees,
    assignedEmployees,
    overallocatedEmployees,
    underutilizedEmployees,
    averageUtilization,
    skillDistribution,
    projectDistribution,
    utilizationDistribution,
  };
};
