import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../../features/employees/employeeSlice";
import EmployeeList from "../../components/employees/EmployeeList";
import EmployeeFilters from "../../components/employees/EmployeeFilters";

const getSkillName = (skill) => {
  if (typeof skill === "string") {
    return skill.trim();
  }

  return skill?.name?.trim() || "";
};

const Employees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { employees = [], isLoading = false } = useSelector(
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
    return [
      ...new Set(
        employees.map((employee) => employee.role).filter(Boolean)
      ),
    ].sort();
  }, [employees]);

  const skills = useMemo(() => {
    return [
      ...new Set(
        employees
          .flatMap((employee) => employee.skills || [])
          .map(getSkillName)
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    const filtered = employees.filter((employee) => {
      const matchesSearch =
        employee.name?.toLowerCase().includes(search) ||
        employee.email?.toLowerCase().includes(search) ||
        employee.role?.toLowerCase().includes(search) ||
        (employee.skills || []).some((skill) =>
          getSkillName(skill).toLowerCase().includes(search)
        );

      const matchesRole =
        roleFilter === "All" || employee.role === roleFilter;

      const matchesSkill =
        skillFilter === "All" ||
        (employee.skills || []).some(
          (skill) =>
            getSkillName(skill).toLowerCase() ===
            skillFilter.toLowerCase()
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
        return (a.name || "").localeCompare(b.name || "");
      }

      if (sortBy === "name-desc") {
        return (b.name || "").localeCompare(a.name || "");
      }

      if (sortBy === "role-asc") {
        return (a.role || "").localeCompare(b.role || "");
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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Employees
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Search, filter, sort and explore employee skills.
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

      <div className="flex items-center justify-between">
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

      {filteredEmployees.length === 0 ? (
        <div className="rounded-xl border border-gray-200 p-8 text-center dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">
            No employees found
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <EmployeeList
          employees={filteredEmployees}
          onViewEmployee={handleViewEmployee}
        />
      )}
    </div>
  );
};

export default Employees;
