
export const validateMatchingInput = (body) => {
  const project = body?.project;
  const employees = body?.employees;

  if (!project || typeof project !== "object") {
    return "A project object is required.";
  }

  if (
    typeof project.name !== "string" ||
    !project.name.trim()
  ) {
    return "Project name is required.";
  }

  if (
    !Array.isArray(project.requiredSkills) ||
    project.requiredSkills.length === 0
  ) {
    return "At least one required skill is needed.";
  }

  if (project.requiredSkills.length > 30) {
    return "A maximum of 30 required skills is allowed.";
  }

  if (!Array.isArray(employees) || employees.length === 0) {
    return "At least one employee is required.";
  }

  if (employees.length > 100) {
    return "A maximum of 100 employees can be analyzed at once.";
  }

  for (const employee of employees) {
    if (
      !employee ||
      (typeof employee.id !== "string" &&
        typeof employee.id !== "number") ||
      typeof employee.name !== "string" ||
      !Array.isArray(employee.skills)
    ) {
      return "Each employee must have an ID, name, and skills array.";
    }

    if (employee.skills.length > 50) {
      return "Each employee can have at most 50 listed skills.";
    }
  }

  return null;
};
