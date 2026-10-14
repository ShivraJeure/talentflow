
import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export const generateProjectMatches = async ({
  project,
  employees,
}) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/ai/match`,
    {
      project,
      employees,
    }
  );

  return response.data;
};
