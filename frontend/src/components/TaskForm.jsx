import { useState } from "react";
import API from "../services/api";

function TaskForm({ getTasks }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");

  const addTask = async () => {

    if (title.trim() === "") {
      alert("Please enter task title");
      return;
    }

    try {

      await API.post("/tasks", {
        title,
        description,
        status,
      });

      setTitle("");
      setDescription("");
      setStatus("Pending");

      getTasks();

    } catch (error) {
      console.log(error);
      alert("Error while adding task");
    }
  };

  return (
    <div className="left">

      <h2>Add New Task</h2>

      <input
        type="text"
        placeholder="Enter Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Enter Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>Pending</option>
        <option>Completed</option>
      </select>

      <button onClick={addTask}>
        Add Task
      </button>

    </div>
  );
}

export default TaskForm;