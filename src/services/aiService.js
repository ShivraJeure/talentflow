
import axios from "axios";

export const generateProjectMatches = async ({
  project,
  employees,
}) => {
  const response = await axios.post("/api/ai/match", {
    project,
    employees,
  });

  return response.data;
};
