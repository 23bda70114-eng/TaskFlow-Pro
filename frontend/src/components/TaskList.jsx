import API from "../services/api";

function TaskList({ tasks, getTasks }) {

  const deleteTask = async (id) => {

    try {

      await API.delete(`/tasks/${id}`);

      getTasks();

    } catch (error) {
      console.log(error);
      alert("Error deleting task");
    }

  };

  return (
    <div className="right">

      <h2>My Tasks</h2>

      {tasks.length === 0 ? (
        <h3>No Tasks Found</h3>
      ) : (
        tasks.map((task) => (

          <div className="card" key={task.id}>

            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <span
              className={
                task.status === "Completed"
                  ? "completed"
                  : "pending"
              }
            >
              {task.status}
            </span>

            <div className="buttons">

              <button>Edit</button>

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