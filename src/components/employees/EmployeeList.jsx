import EmployeeCard from "./EmployeeCard";

const EmployeeList = ({ employees }) => {
  if (!employees.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          No employees found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
};

export default EmployeeList;