import { useEffect, useRef, useState } from "react";
import API from "../services/api";

function TaskList({ tasks, getTasks, setEditTask, showToast }) {

  const [pendingDelete, setPendingDelete] = useState(null);
  const deleteTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, []);

  const deleteTask = (task) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
    }

    setPendingDelete(task);
  };

  const confirmPermanentDelete = async () => {
    if (!pendingDelete) return;

    try {
      await API.delete(`/tasks/${pendingDelete.id}`);

      setPendingDelete(null);

      await getTasks();

      showToast("Task deleted permanently!");
    } catch (error) {
      console.log(error);
      showToast("Error deleting task");
      setPendingDelete(null);
    }
  };

  const undoDelete = () => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
    }

    setPendingDelete(null);

    showToast("Task restored!");
  };

  useEffect(() => {
    if (!pendingDelete) return;

    deleteTimerRef.current = setTimeout(() => {
      confirmPermanentDelete();
    }, 15000);

    return () => {
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, [pendingDelete]);

  const isOverdue = (task) => {
    if (!task.dueDate) return false;
    if (task.status === "Completed") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  };

  return (
    <div className="right">

      <h2>My Tasks</h2>

      {pendingDelete && (
        <div className="undo-delete-bar">
          <div>
            <strong>🗑️ Task deleted</strong>
            <span>{pendingDelete.title}</span>
          </div>

          <button onClick={undoDelete}>
            ↩️ Undo
          </button>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>

          <h3>No Tasks Found</h3>

          <p>
            Try adding a new task or changing your search/filter.
          </p>
        </div>
      ) : (
        tasks
          .filter((task) => !pendingDelete || task.id !== pendingDelete.id)
          .map((task) => (
            <div className="card" key={task.id}>

              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <div className="task-info">

                <span
                  className={
                    task.status === "Completed"
                      ? "completed"
                      : "pending"
                  }
                >
                  {task.status}
                </span>

                <span
                  className={
                    task.priority === "High"
                      ? "priority-high"
                      : task.priority === "Low"
                      ? "priority-low"
                      : "priority-medium"
                  }
                >
                  {task.priority || "Medium"}
                </span>

                <span className="category-badge">
                  🏷️ {task.category || "Other"}
                </span>

                {isOverdue(task) && (
                  <span className="overdue-badge">
                    ⚠️ Overdue
                  </span>
                )}

              </div>

              {task.dueDate && (
                <p className="due-date">
                  📅 Due: {task.dueDate}
                </p>
              )}

              <div className="buttons">

                <button
                  onClick={() => setEditTask(task)}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(task)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))
      )}

    </div>
  );
}

export default TaskList;