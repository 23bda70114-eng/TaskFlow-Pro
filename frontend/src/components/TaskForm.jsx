import { useState, useEffect } from "react";
import API from "../services/api";

function TaskForm({ getTasks, editTask, setEditTask, showToast }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || "");
      setDescription(editTask.description || "");
      setStatus(editTask.status || "Pending");
      setPriority(editTask.priority || "Medium");
      setDueDate(editTask.dueDate || "");
    }
  }, [editTask]);

  const saveTask = async () => {

    if (title.trim() === "") {
      alert("Please enter task title");
      return;
    }

    try {

      if (editTask) {

        await API.put(`/tasks/${editTask.id}`, {
          title,
          description,
          status,
          priority,
          dueDate,
        });

        showToast("Task updated successfully!");

      } else {

        await API.post("/tasks", {
          title,
          description,
          status,
          priority,
          dueDate,
        });

        showToast("Task added successfully!");
      }

      setTitle("");
      setDescription("");
      setStatus("Pending");
      setPriority("Medium");
      setDueDate("");

      setEditTask(null);

      await getTasks();

    } catch (error) {

      console.log(error);
      alert("Something went wrong");

    }
  };

  return (
    <div className="left">

      <h2>
        {editTask ? "Update Task" : "Add New Task"}
      </h2>

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
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button onClick={saveTask}>
        {editTask ? "Update Task" : "Add Task"}
      </button>

    </div>
  );
}

export default TaskForm;