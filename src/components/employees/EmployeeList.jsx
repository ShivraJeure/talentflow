import EmployeeCard from "./EmployeeCard";

const EmployeeList = ({ employees, onViewEmployee }) => {
  if (!employees || employees.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          No employees found matching your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onViewEmployee={onViewEmployee}
        />
      ))}
    </div>
  );
};

export default EmployeeList;