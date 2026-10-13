
const normalizeSkill = (skill) =>
  String(skill ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const uniqueSkills = (skills) =>
  [...new Set(
    skills
      .filter((skill) => typeof skill === "string")
      .map((skill) => skill.trim())
      .filter(Boolean)
  )];

const getSkillGaps = (requiredSkills, employeeSkills) => {
  const employeeSkillSet = new Set(
    employeeSkills.map(normalizeSkill)
  );

  return requiredSkills.filter(
    (skill) => !employeeSkillSet.has(normalizeSkill(skill))
  );
};

const getExperienceScore = (experience, requiredExperience) => {
  const years = Number(experience);
  const required = Number(requiredExperience);

  if (
    !Number.isFinite(years) ||
    years < 0 ||
    !Number.isFinite(required) ||
    required <= 0
  ) {
    return 1;
  }

  return Math.min(years / required, 1);
};

const getAvailabilityScore = (availability) => {
  const value = String(availability ?? "")
    .trim()
    .toLowerCase();

  if (value === "available") return 1;
  if (value === "partially available") return 0.5;
  if (value === "unavailable") return 0;

  return 0.5;
};

const getRecommendations = (missingSkills) =>
  missingSkills.map(
    (skill) =>
      `Build practical experience with ${skill} through guided learning and a small project.`
  );

export const generateRuleBasedMatches = ({
  project,
  employees,
}) => {
  const requiredSkills = uniqueSkills(project.requiredSkills);

  const matches = employees.map((employee) => {
    const employeeSkills = uniqueSkills(employee.skills ?? []);
    const employeeSkillSet = new Set(
      employeeSkills.map(normalizeSkill)
    );

    const matchedSkills = requiredSkills.filter(
      (skill) => employeeSkillSet.has(normalizeSkill(skill))
    );

    const missingSkills = getSkillGaps(
      requiredSkills,
      employeeSkills
    );

    const skillScore =
      requiredSkills.length > 0
        ? (matchedSkills.length / requiredSkills.length) * 100
        : 0;

    const requiredExperience = Number(project.requiredExperience);
    const experienceScore = getExperienceScore(
      employee.experience,
      requiredExperience
    ) * 100;

    const availabilityScore =
      getAvailabilityScore(employee.availability) * 100;

    const score = Math.round(
      skillScore * 0.7 +
      experienceScore * 0.2 +
      availabilityScore * 0.1
    );

    const explanations = [
      `${matchedSkills.length} of ${requiredSkills.length} required skills matched.`,
    ];

    if (missingSkills.length > 0) {
      explanations.push(
        `Missing skills: ${missingSkills.join(", ")}.`
      );
    } else {
      explanations.push("All required skills are covered.");
    }

    if (employee.availability) {
      explanations.push(
        `Availability: ${employee.availability}.`
      );
    }

    return {
      employeeId: String(employee.id),
      employeeName: employee.name,
      matchScore: score,
      matchedSkills,
      missingSkills,
      explanation: explanations.join(" "),
      recommendations: getRecommendations(missingSkills),
    };
  });

  matches.sort(
    (a, b) =>
      b.matchScore - a.matchScore ||
      a.employeeName.localeCompare(b.employeeName)
  );

  return {
    summary:
      `Rule-based analysis completed for ${matches.length} employees ` +
      `against ${requiredSkills.length} required skills.`,
    matchingMethod: "rule-based",
    matches,
    caveats: [
      "Scores are heuristic estimates, not validated predictions of job performance.",
      "Employee information and skill lists should be verified before making allocation decisions.",
      "The score uses 70% skill coverage, 20% experience and 10% availability.",
    ],
  };
};
