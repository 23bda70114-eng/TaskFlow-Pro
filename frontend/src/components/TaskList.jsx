import API from "../services/api";

function TaskList({ tasks, getTasks, setEditTask, showToast }) {

  const deleteTask = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await API.delete(`/tasks/${id}`);

      showToast("Task deleted successfully!");

      getTasks();

    } catch (error) {

      console.log(error);

      showToast("Error deleting task");

    }

  };

  return (
    <div className="right">

      <h2>My Tasks</h2>

      {tasks.length === 0 ? (
        <div className="empty-state">

          <div className="empty-icon">📋</div>

          <h3>No Tasks Found</h3>

          <p>
            Try adding a new task or changing your search/filter.
          </p>

        </div>
      ) : (
        tasks.map((task) => (

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
                onClick={() => deleteTask(task.id)}
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