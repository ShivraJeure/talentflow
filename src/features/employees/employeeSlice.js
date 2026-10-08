import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const employeesData = [
  {
  id: 1,
  name: "Rahul Sharma",
  email: "rahul.sharma@talentflow.com",
  role: "Frontend Developer",
  skills: ["React", "JavaScript", "Tailwind CSS"],
  availability: "Available",
},
{
  id: 2,
  name: "Priya Deshmukh",
  email: "priya.deshmukh@talentflow.com",
  role: "Backend Developer",
  skills: ["Node.js", "Express", "MySQL"],
  availability: "Partially Available",
},
{
  id: 3,
  name: "Amit Patil",
  email: "amit.patil@talentflow.com",
  role: "Full Stack Developer",
  skills: ["React", "Node.js", "MongoDB"],
  availability: "Available",
},
{
  id: 4,
  name: "Sneha Kulkarni",
  email: "sneha.kulkarni@talentflow.com",
  role: "UI/UX Designer",
  skills: ["Figma", "UI Design", "UX Design"],
  availability: "Not Available",
},
{
  id: 5,
  name: "Vikram Joshi",
  email: "vikram.joshi@talentflow.com",
  role: "Frontend Developer",
  skills: ["React", "TypeScript", "CSS"],
  availability: "Available",
},
{
  id: 6,
  name: "Neha Desai",
  email: "neha.desai@talentflow.com",
  role: "Backend Developer",
  skills: ["Java", "Spring Boot", "MySQL"],
  availability: "Partially Available",
},
{
  id: 7,
  name: "Arjun Mehta",
  email: "arjun.mehta@talentflow.com",
  role: "DevOps Engineer",
  skills: ["AWS", "Docker", "Kubernetes"],
  availability: "Available",
},
{
  id: 8,
  name: "Ananya Rao",
  email: "ananya.rao@talentflow.com",
  role: "Frontend Developer",
  skills: ["React", "Redux Toolkit", "JavaScript"],
  availability: "Available",
},
{
  id: 9,
  name: "Rohit Deshpande",
  email: "rohit.deshpande@talentflow.com",
  role: "Backend Developer",
  skills: ["Python", "Django", "PostgreSQL"],
  availability: "Not Available",
},
{
  id: 10,
  name: "Kavya Nair",
  email: "kavya.nair@talentflow.com",
  role: "QA Engineer",
  skills: ["Jest", "Cypress", "Selenium"],
  availability: "Available",
},
{
  id: 11,
  name: "Aditya Kulkarni",
  email: "aditya.kulkarni@talentflow.com",
  role: "Full Stack Developer",
  skills: ["React", "Node.js", "PostgreSQL"],
  availability: "Partially Available",
},
{
  id: 12,
  name: "Meera Iyer",
  email: "meera.iyer@talentflow.com",
  role: "Business Analyst",
  skills: ["Requirements Analysis", "SQL", "Jira"],
  availability: "Available",
},
{
  id: 13,
  name: "Karan Shah",
  email: "karan.shah@talentflow.com",
  role: "Frontend Developer",
  skills: ["React", "Next.js", "Tailwind CSS"],
  availability: "Partially Available",
},
{
  id: 14,
  name: "Pooja Verma",
  email: "pooja.verma@talentflow.com",
  role: "Data Engineer",
  skills: ["Python", "SQL", "Apache Spark"],
  availability: "Available",
},
{
  id: 15,
  name: "Siddharth More",
  email: "siddharth.more@talentflow.com",
  role: "DevOps Engineer",
  skills: ["AWS", "Terraform", "Jenkins"],
  availability: "Not Available",
},
{
  id: 16,
  name: "Riya Kapoor",
  email: "riya.kapoor@talentflow.com",
  role: "UI/UX Designer",
  skills: ["Figma", "Wireframing", "Prototyping"],
  availability: "Available",
},
{
  id: 17,
  name: "Manish Gupta",
  email: "manish.gupta@talentflow.com",
  role: "Backend Developer",
  skills: ["Java", "Spring Boot", "PostgreSQL"],
  availability: "Available",
},
{
  id: 18,
  name: "Tanvi Joshi",
  email: "tanvi.joshi@talentflow.com",
  role: "QA Engineer",
  skills: ["Playwright", "Jest", "React Testing Library"],
  availability: "Partially Available",
},
{
  id: 19,
  name: "Nikhil Bhosale",
  email: "nikhil.bhosale@talentflow.com",
  role: "Full Stack Developer",
  skills: ["React", "TypeScript", "Node.js"],
  availability: "Available",
},
{
  id: 20,
  name: "Ishita Singh",
  email: "ishita.singh@talentflow.com",
  role: "Data Engineer",
  skills: ["Python", "SQL", "AWS"],
  availability: "Partially Available",
},
];

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    return employeesData;
  }
);

const initialState = {
  employees: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message =
          action.error.message || "Unable to load employees";
      });
  },
});

export default employeeSlice.reducer;