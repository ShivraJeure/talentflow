
const normalizeSkill = (skill) => {
  if (typeof skill === "string") {
    return skill.trim().toLowerCase();
  }

  return skill?.name?.trim().toLowerCase() || "";
};

const getSkillName = (skill) => {
  if (typeof skill === "string") {
    return skill.trim();
  }

  return skill?.name?.trim() || "";
};

const getSkillLevel = (skill) => {
  if (typeof skill === "string") {
    return 3;
  }

  const level = skill?.proficiency ?? skill?.level ?? 3;

  if (typeof level === "number") {
    return Math.max(1, Math.min(5, level));
  }

  const levels = {
    beginner: 1,
    basic: 2,
    intermediate: 3,
    advanced: 4,
    expert: 5,
  };

  return levels[String(level).toLowerCase()] ?? 3;
};

export const analyzeEmployeeSkills = (employee, project) => {
  const employeeSkills = employee?.skills || [];
  const requiredSkills =
    project?.requiredSkills || project?.skills || [];

  const skillMap = new Map(
    employeeSkills.map((skill) => [
      normalizeSkill(skill),
      skill,
    ])
  );

  const matchedSkills = requiredSkills.filter((skill) =>
    skillMap.has(normalizeSkill(skill))
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !skillMap.has(normalizeSkill(skill))
  );

  const proficiencyScore = requiredSkills.length
    ? matchedSkills.reduce((total, skill) => {
        const employeeSkill = skillMap.get(normalizeSkill(skill));

        return total + getSkillLevel(employeeSkill) / 5;
      }, 0) / requiredSkills.length
    : 0;

  const coverage = requiredSkills.length
    ? (matchedSkills.length / requiredSkills.length) * 100
    : 0;

  return {
    matchedSkills: matchedSkills.map(getSkillName),
    missingSkills: missingSkills.map(getSkillName),
    coverage: Math.round(coverage),
    proficiencyScore: Math.round(proficiencyScore * 100),
    totalRequired: requiredSkills.length,
    totalMatched: matchedSkills.length,
  };
};

export { getSkillName, getSkillLevel, normalizeSkill };
