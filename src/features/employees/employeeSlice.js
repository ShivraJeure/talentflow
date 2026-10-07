import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchEmployees } from "../../services/employeeService";

export const getEmployees = createAsyncThunk(
  "employees/getEmployees",
  async () => {
    const data = await fetchEmployees();
    return data;
  }
);

const initialState = {
  employees: [],
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employees",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })

      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default employeeSlice.reducer;