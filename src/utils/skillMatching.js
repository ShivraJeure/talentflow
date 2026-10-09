export const getSkillMatch = (employeeSkills = [], requiredSkills = []) => {
  const employeeSkillSet = new Set(
    employeeSkills.map((skill) => skill.trim().toLowerCase())
  );

  const matchedSkills = requiredSkills.filter((skill) =>
    employeeSkillSet.has(skill.trim().toLowerCase())
  );

  const matchPercentage =
    requiredSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return {
    matchedSkills,
    missingSkills: requiredSkills.filter(
      (skill) => !employeeSkillSet.has(skill.trim().toLowerCase())
    ),
    matchPercentage,
  };
};