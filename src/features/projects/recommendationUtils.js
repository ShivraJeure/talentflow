
export const calculateEmployeeRecommendations = (
  project,
  employees,
  allocations
) => {
  if (!project || !Array.isArray(employees) || !Array.isArray(allocations)) {
    return [];
  }

  const requiredSkills = (project.requiredSkills || []).map((skill) =>
    skill.toLowerCase().trim()
  );

  return employees
    .filter((employee) => {
      const alreadyAssigned = allocations.some(
        (allocation) =>
          String(allocation.employeeId) === String(employee.id) &&
          String(allocation.projectId) === String(project.id)
      );

      return (
        !alreadyAssigned &&
        employee.availability !== "Not Available"
      );
    })
    .map((employee) => {
      const employeeSkills = (employee.skills || []).map((skill) =>
        skill.toLowerCase().trim()
      );

      const matchedSkills = requiredSkills.filter((skill) =>
        employeeSkills.includes(skill)
      );

      const missingSkills = requiredSkills.filter(
        (skill) => !employeeSkills.includes(skill)
      );

      const skillScore =
        requiredSkills.length > 0
          ? (matchedSkills.length / requiredSkills.length) * 50
          : 25;

      const experience = Number(employee.experience) || 0;
      const experienceScore = Math.min(experience / 5, 1) * 20;

      const currentAllocation = allocations
        .filter(
          (allocation) =>
            String(allocation.employeeId) === String(employee.id)
        )
        .reduce(
          (total, allocation) =>
            total + Number(allocation.allocationPercentage || 0),
          0
        );

      const remainingCapacity = Math.max(0, 100 - currentAllocation);

      const availabilityScore =
        employee.availability === "Available"
          ? 20
          : employee.availability === "Partially Available"
            ? 12
            : 0;

      const capacityScore = (remainingCapacity / 100) * 10;

      const score = Math.round(
        skillScore +
          experienceScore +
          availabilityScore +
          capacityScore
      );

      return {
        ...employee,
        score,
        matchedSkills,
        missingSkills,
        currentAllocation,
        remainingCapacity,
      };
    })
    .filter((employee) => employee.remainingCapacity > 0)
    .sort((a, b) => b.score - a.score);
};
