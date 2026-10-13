
import { Router } from "express";
import {
  generateEmployeeMatches,
} from "../services/aiMatchingService.js";
import {
  generateRuleBasedMatches,
} from "../services/ruleBasedMatchingService.js";
import {
  validateMatchingInput,
} from "../utils/validateMatchingInput.js";

const router = Router();

router.post("/match", async (req, res) => {
  const validationError = validateMatchingInput(req.body);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  const matchingMode = (
    process.env.MATCHING_MODE || "rule-based"
  ).toLowerCase();

  if (!["rule-based", "openai"].includes(matchingMode)) {
    return res.status(500).json({
      message: "Invalid matching mode configuration.",
    });
  }

  try {
    const result =
      matchingMode === "rule-based"
        ? generateRuleBasedMatches(req.body)
        : await generateEmployeeMatches(req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Employee matching failed:", {
      name: error.name,
      message: error.message,
      status: error.status,
      code: error.code,
    });

    const status = error.status === 503 ? 503 : 502;

    return res.status(status).json({
      message:
        status === 503
          ? "AI service is not configured."
          : "Unable to generate recommendations right now.",
    });
  }
});

export default router;
