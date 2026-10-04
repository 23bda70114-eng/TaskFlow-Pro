import "./App.css";
import { useEffect, useState } from "react";
import API from "./services/api";

import Navbar from "./components/Navbar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState("");

  const getTasks = async () => {
    try {
      const response = await API.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "All" || task.status === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className={darkMode ? "app dark-mode" : "app"}>

      <Navbar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

      <div className="dashboard">

        <div className="box">
          <h3>Total Tasks</h3>
          <h1>{totalTasks}</h1>
        </div>

        <div className="box">
          <h3>Completed</h3>
          <h1>{completedTasks}</h1>
        </div>

        <div className="box">
          <h3>Pending</h3>
          <h1>{pendingTasks}</h1>
        </div>

        <div className="box progress-box">
          <h3>Progress</h3>

          <h1>{progress}%</h1>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p>
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>

      </div>

      <div className="main">

        <TaskForm
          getTasks={getTasks}
          editTask={editTask}
          setEditTask={setEditTask}
          showToast={showToast}
        />

        <TaskList
          tasks={filteredTasks}
          getTasks={getTasks}
          setEditTask={setEditTask}
          showToast={showToast}
        />

      </div>

    </div>
  );
}

export default App;