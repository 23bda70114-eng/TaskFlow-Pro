function Navbar({
  search,
  setSearch,
  filter,
  setFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  darkMode,
  setDarkMode
}) {
  return (
    <nav className="navbar">

      <h2>🚀 TaskFlow</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >

        <input
          type="text"
          placeholder="Search Task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">Status: All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">Category: All</option>
          <option value="College">College</option>
          <option value="Work">Work</option>
          <option value="Project">Project</option>
          <option value="Personal">Personal</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="Default">Sort: Default</option>
          <option value="Priority">Priority</option>
          <option value="DueDate">Due Date</option>
          <option value="Newest">Newest</option>
          <option value="AZ">A → Z</option>
        </select>

        <button
          className="dark-mode-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

      </div>

    </nav>
  );
}

export default Navbar;