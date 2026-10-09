import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "../features/employees/employeeSlice";
import projectReducer from "../features/projects/projectSlice";

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    projects: projectReducer,
  },
});