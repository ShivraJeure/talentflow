import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getEmployees } from "../../features/employees/employeeSlice";
import EmployeeList from "../../components/employees/EmployeeList";
import { Loader } from "../../components/common/Loader";

const Employees = () => {
  const dispatch = useDispatch();

  const { employees, loading, error } = useSelector(
    (state) => state.employees
  );

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Employees
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage employees, skills and availability.
        </p>
      </div>

      {loading && <Loader />}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && <EmployeeList employees={employees} />}
    </div>
  );
};

export default Employees;