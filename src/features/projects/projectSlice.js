import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [
    {
      id: 101,
      name: "Banking Portal Modernization",
      client: "Apex Cooperative Bank",
      description: "Modernize the customer and employee banking experience.",
      requiredSkills: ["React", "JavaScript", "REST APIs"],
      status: "In Progress",
      startDate: "2026-10-01",
      endDate: "2027-01-31",
    },
    {
      id: 102,
      name: "Talent Analytics Platform",
      client: "TalentFlow Internal",
      description:
        "Build dashboards for workforce skills and resource planning.",
      requiredSkills: ["React", "Redux Toolkit", "SQL"],
      status: "Planning",
      startDate: "2026-10-15",
      endDate: "2027-02-28",
    },
    {
      id: 103,
      name: "Cloud Migration Dashboard",
      client: "Northstar Technologies",
      description: "Track cloud migration progress and operational metrics.",
      requiredSkills: ["AWS", "JavaScript", "REST APIs"],
      status: "In Progress",
      startDate: "2026-09-15",
      endDate: "2026-12-31",
    },
    {
      id: 104,
      name: "Quality Automation Suite",
      client: "Apex Cooperative Bank",
      description: "Improve automated testing and release quality.",
      requiredSkills: ["Jest", "Playwright", "React"],
      status: "Planning",
      startDate: "2026-11-01",
      endDate: "2027-01-15",
    },
  ],
  allocations: [],
  errorMessage: "",
  successMessage: "",
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    allocateEmployee: (state, action) => {
      state.errorMessage = "";
      state.successMessage = "";

      const { employeeId, projectId, allocationPercentage } = action.payload;
      const percentage = Number(allocationPercentage);

      if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) {
        state.errorMessage = "Allocation must be between 1% and 100%.";
        return;
      }

      const projectExists = state.projects.some(
        (project) => project.id === Number(projectId),
      );

      if (!projectExists) {
        state.errorMessage = "Please select a valid project.";
        return;
      }

      const existingAllocation = state.allocations.some(
        (allocation) =>
          allocation.employeeId === Number(employeeId) &&
          allocation.projectId === Number(projectId),
      );

      if (existingAllocation) {
        state.errorMessage =
          "This employee is already assigned to this project.";
        return;
      }

      const totalAllocated = state.allocations
        .filter((allocation) => allocation.employeeId === Number(employeeId))
        .reduce(
          (total, allocation) => total + allocation.allocationPercentage,
          0,
        );

      if (totalAllocated + percentage > 100) {
        state.errorMessage = `Only ${100 - totalAllocated}% capacity remains for this employee.`;
        return;
      }

      state.allocations.push({
        id: Date.now(),
        employeeId: Number(employeeId),
        projectId: Number(projectId),
        allocationPercentage: percentage,
        assignedAt: new Date().toISOString(),
      });

      state.successMessage = "Employee allocated successfully.";
    },

    removeAllocation: (state, action) => {
      state.allocations = state.allocations.filter(
        (allocation) => allocation.id !== action.payload,
      );
      state.errorMessage = "";
      state.successMessage = "Allocation removed successfully.";
    },

    clearAllocationMessages: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },

    setAllocationError: (state, action) => {
      state.errorMessage = action.payload;
      state.successMessage = "";
    },
  },
});

export const { allocateEmployee, removeAllocation, clearAllocationMessages,setAllocationError } =
  projectSlice.actions;

export default projectSlice.reducer;

export const allocateEmployeeWithValidation = (payload) => (
  dispatch,
  getState
) => {
  const employees = getState().employees.employees;

  const employee = employees.find(
    (item) => item.id === Number(payload.employeeId)
  );

  if (!employee) {
    dispatch(setAllocationError("Please select a valid employee."));
    return;
  }

  if (employee.availability === "Not Available") {
    dispatch(
      setAllocationError(
        "This employee is currently unavailable for project allocation."
      )
    );
    return;
  }

  dispatch(allocateEmployee(payload));
};
