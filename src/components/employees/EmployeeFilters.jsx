const EmployeeFilters = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  skillFilter,
  setSkillFilter,
  availabilityFilter,
  setAvailabilityFilter,
  sortBy,
  setSortBy,
  roles,
  skills,
}) => {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <input
          type="text"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />

        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="All">All Roles</option>

          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <select
          value={skillFilter}
          onChange={(event) => setSkillFilter(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="All">All Skills</option>

          {skills.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>

        <select
          value={availabilityFilter}
          onChange={(event) => setAvailabilityFilter(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="All">All Availability</option>
          <option value="Available">Available</option>
          <option value="Partially Available">Partially Available</option>
          <option value="Not Available">Not Available</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="role-asc">Role A-Z</option>
          <option value="availability">Availability</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearchTerm("");
            setRoleFilter("All");
            setSkillFilter("All");
            setAvailabilityFilter("All");
            setSortBy("name-asc");
          }}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default EmployeeFilters;