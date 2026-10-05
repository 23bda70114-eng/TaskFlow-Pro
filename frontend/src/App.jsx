import "./App.css";
import { useEffect, useState } from "react";
import API from "./services/api";

import Navbar from "./components/Navbar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import AnalyticsCharts from "./components/AnalyticsCharts";
import Notifications from "./components/Notifications";
import CalendarView from "./components/CalendarView";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dueFilter, setDueFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Default");

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

  // =========================
  // DASHBOARD STATISTICS
  // =========================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "Completed") {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  });

  const dueTodayTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "Completed") {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate.getTime() === today.getTime();
  });

  const upcomingTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "Completed") {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate > today;
  });

  const highPriorityTasks = tasks.filter(
    (task) =>
      task.priority === "High" &&
      task.status !== "Completed"
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  // =========================
  // CATEGORY STATISTICS
  // =========================

  const categoryCounts = {
    College: tasks.filter(
      (task) => (task.category || "Other") === "College"
    ).length,

    Work: tasks.filter(
      (task) => (task.category || "Other") === "Work"
    ).length,

    Project: tasks.filter(
      (task) => (task.category || "Other") === "Project"
    ).length,

    Personal: tasks.filter(
      (task) => (task.category || "Other") === "Personal"
    ).length,

    Other: tasks.filter(
      (task) => (task.category || "Other") === "Other"
    ).length
  };

  const maxCategoryCount = Math.max(
    ...Object.values(categoryCounts),
    1
  );

  // =========================
  // STATUS STATISTICS
  // =========================

  const statusCounts = {
    Pending: pendingTasks,
    "In Progress": inProgressTasks,
    Completed: completedTasks
  };

  const maxStatusCount = Math.max(
    ...Object.values(statusCounts),
    1
  );

  // =========================
  // PRIORITY STATISTICS
  // =========================

  const priorityCounts = {
    High: tasks.filter(
      (task) => task.priority === "High"
    ).length,

    Medium: tasks.filter(
      (task) => task.priority === "Medium"
    ).length,

    Low: tasks.filter(
      (task) => task.priority === "Low"
    ).length
  };

  const maxPriorityCount = Math.max(
    ...Object.values(priorityCounts),
    1
  );

  // =========================
  // ADVANCED SEARCH
  // =========================

  const filteredTasks = tasks
    .filter((task) => {
      const searchText = search.toLowerCase().trim();

      const matchSearch =
        searchText === "" ||
        (task.title || "")
          .toLowerCase()
          .includes(searchText) ||
        (task.description || "")
          .toLowerCase()
          .includes(searchText) ||
        (task.tags || "")
          .toLowerCase()
          .includes(searchText) ||
        (task.category || "")
          .toLowerCase()
          .includes(searchText) ||
        (task.priority || "")
          .toLowerCase()
          .includes(searchText) ||
        (task.status || "")
          .toLowerCase()
          .includes(searchText);

      const matchStatus =
        filter === "All" ||
        task.status === filter;

      const matchCategory =
        categoryFilter === "All" ||
        (task.category || "Other") === categoryFilter;

      const matchPriority =
        priorityFilter === "All" ||
        (task.priority || "Medium") === priorityFilter;

      const matchDue = (() => {
        if (dueFilter === "All") {
          return true;
        }

        if (dueFilter === "NoDate") {
          return !task.dueDate;
        }

        if (!task.dueDate) {
          return false;
        }

        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        const taskDueDate = new Date(task.dueDate);
        taskDueDate.setHours(0, 0, 0, 0);

        if (dueFilter === "Overdue") {
          return (
            task.status !== "Completed" &&
            taskDueDate < todayDate
          );
        }

        if (dueFilter === "Today") {
          return (
            taskDueDate.getTime() ===
            todayDate.getTime()
          );
        }

        if (dueFilter === "Upcoming") {
          return taskDueDate > todayDate;
        }

        return true;
      })();

      return (
        matchSearch &&
        matchStatus &&
        matchCategory &&
        matchPriority &&
        matchDue
      );
    })
    .sort((a, b) => {
      if (sortBy === "Priority") {
        const priorityOrder = {
          High: 1,
          Medium: 2,
          Low: 3
        };

        return (
          (priorityOrder[a.priority] || 2) -
          (priorityOrder[b.priority] || 2)
        );
      }

      if (sortBy === "DueDate") {
        if (!a.dueDate && !b.dueDate) {
          return 0;
        }

        if (!a.dueDate) {
          return 1;
        }

        if (!b.dueDate) {
          return -1;
        }

        return (
          new Date(a.dueDate) -
          new Date(b.dueDate)
        );
      }

      if (sortBy === "Newest") {
        return b.id - a.id;
      }

      if (sortBy === "AZ") {
        return (a.title || "").localeCompare(
          b.title || ""
        );
      }

      return 0;
    });

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearch("");
    setFilter("All");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setDueFilter("All");
    setSortBy("Default");
  };

  return (
    <div
      className={
        darkMode
          ? "app dark-mode"
          : "app"
      }
    >
      {/* Navbar */}

      <Navbar
        search={search}
        setSearch={setSearch}

        filter={filter}
        setFilter={setFilter}

        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}

        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}

        dueFilter={dueFilter}
        setDueFilter={setDueFilter}

        sortBy={sortBy}
        setSortBy={setSortBy}

        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Toast */}

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

      {/* Dashboard */}

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

        <div className="box">
          <h3>In Progress</h3>
          <h1>{inProgressTasks}</h1>
        </div>

        <div className="box">
          <h3>Due Today</h3>
          <h1>{dueTodayTasks.length}</h1>
        </div>

        <div className="box">
          <h3>Upcoming</h3>
          <h1>{upcomingTasks.length}</h1>
        </div>

        <div className="box">
          <h3>Overdue</h3>
          <h1>{overdueTasks.length}</h1>
        </div>

        <div className="box">
          <h3>High Priority</h3>
          <h1>{highPriorityTasks}</h1>
        </div>

        <div className="box progress-box">
          <h3>Progress</h3>

          <h1>{progress}%</h1>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`
              }}
            ></div>
          </div>

          <p>
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>
      </div>

      {/* Calendar */}

      <CalendarView tasks={tasks} />

      {/* Kanban Board */}

      <KanbanBoard
        tasks={tasks}
        getTasks={getTasks}
        showToast={showToast}
      />

      {/* Task Analytics */}

      <div className="analytics-section">
        <h2>📊 Task Analytics</h2>

        <p className="analytics-subtitle">
          Overview of your tasks
        </p>

        {/* Category */}

        <h3 className="analytics-heading">
          🏷️ By Category
        </h3>

        {Object.entries(categoryCounts).map(
          ([category, count]) => (
            <div
              className="analytics-row"
              key={category}
            >
              <div className="analytics-label">
                <span>{category}</span>
                <strong>{count}</strong>
              </div>

              <div className="analytics-bar">
                <div
                  className="analytics-fill"
                  style={{
                    width: `${
                      (count / maxCategoryCount) * 100
                    }%`
                  }}
                ></div>
              </div>
            </div>
          )
        )}

        {/* Status */}

        <h3 className="analytics-heading">
          📌 By Status
        </h3>

        {Object.entries(statusCounts).map(
          ([status, count]) => (
            <div
              className="analytics-row"
              key={status}
            >
              <div className="analytics-label">
                <span>{status}</span>
                <strong>{count}</strong>
              </div>

              <div className="analytics-bar">
                <div
                  className="analytics-fill status-fill"
                  style={{
                    width: `${
                      (count / maxStatusCount) * 100
                    }%`
                  }}
                ></div>
              </div>
            </div>
          )
        )}

        {/* Priority */}

        <h3 className="analytics-heading">
          🔥 By Priority
        </h3>

        {Object.entries(priorityCounts).map(
          ([priority, count]) => (
            <div
              className="analytics-row"
              key={priority}
            >
              <div className="analytics-label">
                <span>{priority}</span>
                <strong>{count}</strong>
              </div>

              <div className="analytics-bar">
                <div
                  className="analytics-fill priority-fill"
                  style={{
                    width: `${
                      (count / maxPriorityCount) * 100
                    }%`
                  }}
                ></div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Visual Charts */}

      <AnalyticsCharts
        pending={pendingTasks}
        completed={completedTasks}
        high={priorityCounts.High}
        medium={priorityCounts.Medium}
        low={priorityCounts.Low}
      />

      {/* Notifications */}

      <Notifications tasks={tasks} />

      {/* Task Area */}

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