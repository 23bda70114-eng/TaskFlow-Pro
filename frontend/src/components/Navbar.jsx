function Navbar({
  search,
  setSearch,
  filter,
  setFilter,
  darkMode,
  setDarkMode
}) {
  return (
    <nav className="navbar">

      <h2>🚀 TaskFlow</h2>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

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
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
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