import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Employees from "../pages/Employees/Employees";
import EmployeeDetails from "../pages/Employees/EmployeeDetails"
import Projects from "../pages/Projects/Projects";
import Skills from "../pages/Skills/Skills";
import Analytics from "../pages/Analytics/Analytics";
import AIAssistant from "../pages/Ai/AIAssistant";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/:id" element={<EmployeeDetails />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;