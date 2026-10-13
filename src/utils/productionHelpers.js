
export const normalizeApiError = (error) => {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (error.code === "ERR_NETWORK") {
    return "Unable to connect to the server. Please check your connection.";
  }

  if (error.response?.status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (error.response?.status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (error.response?.status === 404) {
    return "The requested resource was not found.";
  }

  if (error.response?.status >= 500) {
    return "The server is temporarily unavailable. Please try again later.";
  }

  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
};

export const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

export const isValidId = (value) => {
  return (
    (typeof value === "string" && value.trim().length > 0) ||
    (typeof value === "number" && Number.isFinite(value))
  );
};
