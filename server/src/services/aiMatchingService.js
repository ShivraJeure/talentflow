
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000,
  maxRetries: 1,
});

const instructions = `
You are TalentFlow, an employee project allocation assistant.

Analyze employee skills against project requirements.

Rules:
- Use only the supplied employee and project data.
- Never invent employee skills, experience, or availability.
- Rank candidates by relevance to the required skills.
- Consider experience and availability when supplied.
- Identify missing required skills.
- Give practical skill-gap recommendations.
- Treat the result as decision support, not an automatic hiring decision.
- Return only valid JSON, without Markdown fences.

Return this structure:
{
  "summary": "string",
  "matches": [
    {
      "employeeId": "string",
      "employeeName": "string",
      "matchScore": 0,
      "matchedSkills": ["string"],
      "missingSkills": ["string"],
      "explanation": "string",
      "recommendations": ["string"]
    }
  ],
  "caveats": ["string"]
}

matchScore must be an integer from 0 to 100.
Include only employees supplied in the request.
`;

export const generateEmployeeMatches = async ({
  project,
  employees,
}) => {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error(
      "The AI service is not configured."
    );

    error.status = 503;
    throw error;
  }

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    instructions,
    input: JSON.stringify({
      project,
      employees,
    }),
  });

  const rawOutput = response.output_text;

  if (!rawOutput) {
    throw new Error("The AI returned an empty response.");
  }

  let result;

  try {
    result = JSON.parse(rawOutput);
  } catch {
    throw new Error("The AI returned an invalid response format.");
  }

  if (
    !result ||
    typeof result.summary !== "string" ||
    !Array.isArray(result.matches) ||
    !Array.isArray(result.caveats)
  ) {
    throw new Error("The AI response failed validation.");
  }

  const suppliedEmployees = new Map(
    employees.map((employee) => [
      String(employee.id),
      employee,
    ])
  );

  const matches = result.matches
    .filter((match) => {
      return suppliedEmployees.has(String(match.employeeId));
    })
    .map((match) => {
      const employee = suppliedEmployees.get(
        String(match.employeeId)
      );

      const score = Number(match.matchScore);

      return {
        employeeId: String(employee.id),
        employeeName: employee.name,
        matchScore: Number.isFinite(score)
          ? Math.max(0, Math.min(100, Math.round(score)))
          : 0,
        matchedSkills: Array.isArray(match.matchedSkills)
          ? match.matchedSkills.filter(
              (skill) => typeof skill === "string"
            )
          : [],
        missingSkills: Array.isArray(match.missingSkills)
          ? match.missingSkills.filter(
              (skill) => typeof skill === "string"
            )
          : [],
        explanation:
          typeof match.explanation === "string"
            ? match.explanation
            : "No explanation was provided.",
        recommendations: Array.isArray(match.recommendations)
          ? match.recommendations.filter(
              (item) => typeof item === "string"
            )
          : [],
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return {
    summary: result.summary,
    matches,
    caveats: result.caveats.filter(
      (item) => typeof item === "string"
    ),
  };
};
