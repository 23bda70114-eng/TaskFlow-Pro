import "./App.css";
import { useEffect, useState } from "react";
import API from "./services/api";

import Navbar from "./components/Navbar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {

  const [tasks, setTasks] = useState([]);

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

  return (
    <div className="app">

      <Navbar />

      <div className="main">

        <TaskForm getTasks={getTasks} />

        <TaskList tasks={tasks} getTasks={getTasks} />

      </div>

    </div>
  );
}

export default App;