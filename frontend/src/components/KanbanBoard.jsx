import { useState } from "react";
import API from "../services/api";

function KanbanBoard({ tasks, getTasks, showToast }) {
  const [draggedTask, setDraggedTask] = useState(null);

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  );

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (newStatus) => {
    if (!draggedTask) return;

    if (draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      await API.put(`/tasks/${draggedTask.id}`, {
        title: draggedTask.title,
        description: draggedTask.description,
        status: newStatus,
        priority: draggedTask.priority,
        dueDate: draggedTask.dueDate,
        category: draggedTask.category,
        tags: draggedTask.tags
      });

      await getTasks();

      showToast(
        `Task moved to ${newStatus}!`
      );
    } catch (error) {
      console.log(error);
      showToast("Failed to update task");
    }

    setDraggedTask(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const renderTask = (task) => (
    <div
      className="kanban-task"
      key={task.id}
      draggable
      onDragStart={() =>
        handleDragStart(task)
      }
    >
      <div className="kanban-task-header">
        <h4>{task.title}</h4>

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
      </div>

      {task.description && (
        <p className="kanban-description">
          {task.description}
        </p>
      )}

      <div className="kanban-meta">
        <span className="category-badge">
          🏷️ {task.category || "Other"}
        </span>

        {task.dueDate && (
          <span className="kanban-due-date">
            📅 {task.dueDate}
          </span>
        )}
      </div>

      {task.tags && (
        <div className="kanban-tags">
          {task.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "")
            .map((tag, index) => (
              <span
                className="custom-tag"
                key={`${tag}-${index}`}
              >
                #{tag}
              </span>
            ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="kanban-section">
      <div className="kanban-heading">
        <div>
          <h2>📋 Kanban Board</h2>
          <p>
            Drag and drop tasks between columns
          </p>
        </div>
      </div>

      <div className="kanban-board">

        {/* Pending */}

        <div
          className="kanban-column pending-column"
          onDragOver={handleDragOver}
          onDrop={() =>
            handleDrop("Pending")
          }
        >
          <div className="kanban-column-header">
            <h3>📝 Pending</h3>

            <span>
              {pendingTasks.length}
            </span>
          </div>

          <div className="kanban-task-list">
            {pendingTasks.length === 0 ? (
              <div className="kanban-empty">
                Drop tasks here
              </div>
            ) : (
              pendingTasks.map(renderTask)
            )}
          </div>
        </div>

        {/* In Progress */}

        <div
          className="kanban-column progress-column"
          onDragOver={handleDragOver}
          onDrop={() =>
            handleDrop("In Progress")
          }
        >
          <div className="kanban-column-header">
            <h3>🔄 In Progress</h3>

            <span>
              {inProgressTasks.length}
            </span>
          </div>

          <div className="kanban-task-list">
            {inProgressTasks.length === 0 ? (
              <div className="kanban-empty">
                Drop tasks here
              </div>
            ) : (
              inProgressTasks.map(renderTask)
            )}
          </div>
        </div>

        {/* Completed */}

        <div
          className="kanban-column completed-column"
          onDragOver={handleDragOver}
          onDrop={() =>
            handleDrop("Completed")
          }
        >
          <div className="kanban-column-header">
            <h3>✅ Completed</h3>

            <span>
              {completedTasks.length}
            </span>
          </div>

          <div className="kanban-task-list">
            {completedTasks.length === 0 ? (
              <div className="kanban-empty">
                Drop tasks here
              </div>
            ) : (
              completedTasks.map(renderTask)
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default KanbanBoard;