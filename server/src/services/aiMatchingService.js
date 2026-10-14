
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

const openai = apiKey
  ? new OpenAI({ apiKey })
  : null;

export const generateEmployeeMatches = async (employees, project) => {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an employee-project matching assistant. Recommend employees based on project skills, experience, and availability. Return concise, useful recommendations.",
          },
          {
            role: "user",
            content: JSON.stringify({ employees, project }),
          },
        ],
      });

      return {
        source: "openai",
        recommendations: response.choices[0].message.content,
      };
    } catch (error) {
      console.error("OpenAI request failed:", error.message);
    }
  }

  const requiredSkills = (project?.requiredSkills || []).map((skill) =>
    String(skill).toLowerCase()
  );

  const recommendations = (employees || [])
    .map((employee) => {
      const skills = (employee.skills || []).map((skill) =>
        String(skill).toLowerCase()
      );

      const matchedSkills = requiredSkills.filter((skill) =>
        skills.includes(skill)
      );

      return {
        employeeId: employee.id,
        name: employee.name,
        matchedSkills,
        matchPercentage: requiredSkills.length
          ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
          : 0,
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    source: "rule-based",
    recommendations,
  };
};
