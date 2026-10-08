import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../../features/employees/employeeSlice";
import EmployeeList from "../../components/employees/EmployeeList";
import EmployeeFilters from "../../components/employees/EmployeeFilters";


const Employees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { employees, isLoading } = useSelector(
    (state) => state.employees
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const roles = useMemo(() => {
    return [...new Set(employees.map((employee) => employee.role))];
  }, [employees]);

  const skills = useMemo(() => {
    return [
      ...new Set(
        employees.flatMap((employee) => employee.skills || [])
      ),
    ].sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    const filtered = employees.filter((employee) => {
      const matchesSearch =
        employee.name?.toLowerCase().includes(search) ||
        employee.email?.toLowerCase().includes(search);

      const matchesRole =
        roleFilter === "All" || employee.role === roleFilter;

      const matchesSkill =
        skillFilter === "All" ||
        employee.skills?.some(
          (skill) => skill.toLowerCase() === skillFilter.toLowerCase()
        );

      const matchesAvailability =
        availabilityFilter === "All" ||
        employee.availability === availabilityFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesSkill &&
        matchesAvailability
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      if (sortBy === "role-asc") {
        return a.role.localeCompare(b.role);
      }

      if (sortBy === "availability") {
        const order = {
          Available: 1,
          "Partially Available": 2,
          "Not Available": 3,
        };

        return (
          (order[a.availability] || 99) -
          (order[b.availability] || 99)
        );
      }

      return 0;
    });
  }, [
    employees,
    searchTerm,
    roleFilter,
    skillFilter,
    availabilityFilter,
    sortBy,
  ]);

  const handleViewEmployee = useCallback(
    (employee) => {
      navigate(`/employees/${employee.id}`);
    },
    [navigate]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading employees...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Employees
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Search, filter, sort and manage employees.
        </p>
      </div>

      <EmployeeFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        skillFilter={skillFilter}
        setSkillFilter={setSkillFilter}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        roles={roles}
        skills={skills}
      />

      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredEmployees.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {employees.length}
          </span>{" "}
          employees
        </p>
      </div>

      <EmployeeList
        employees={filteredEmployees}
        onViewEmployee={handleViewEmployee}
      />
    </div>
  );
};

export default Employees;