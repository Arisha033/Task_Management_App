import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [priority, setPriority] = useState("Low");

  // Load tasks from localstorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localstorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Add a new Task
  const addTask = () => {
    if (newTitle.trim() === "" || newDescription.trim === "") {
      alert("Please enter a valid title and description");
      return;
    }
    const newTask = {
      id: Date.now(),
      title: newTitle,
      description: newDescription,
      completed: false,
      priority: priority,
    };
    setTasks([...tasks, newTask]);
    setNewTitle("");
    setNewDescription("");
    setPriority("Low");
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Edit a task
  const editTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setNewTitle(taskToEdit.title);
    setNewDescription(taskToEdit.description);
    setPriority(taskToEdit.priority);
    setEditingTask(id);
  };

  // Save Edited task
  const saveEdit = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editingTask
          ? {
              ...task,
              title: newTitle,
              description: newDescription,
              priority: priority,
            }
          : task
      )
    );
    setNewTitle("");
    setNewDescription("");
    setPriority("Low");
    setEditingTask(null);
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  // Sort task by priority
  const sortTasks = (task1, task2) => {
    const priorities = { High: 1, Medium: 2, Low: 3 };
    // if the result is - then task1 has higher priority and viceversa
    return priorities[task1.priority] - priorities[task2.priority];
  };

  return (
    <>
      <div className="p-6 max-w-lg mx-auto mt-10 bg-white shadow-md rounded-lg space-y-6">
        <h1 className="text-4xl font-bold text-center text-blue-600 font-mono">
          Task Manager
        </h1>

        {/* Task Input Section */}
        <div className="space-y-6">
          {/* Title Input */}
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full px-4 py-2 border 
            border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {/* Description Input */}
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter task description"
            className="w-full h-24 px-4 py-2 border
            border-gray-300 rounded-md focus-outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Priority Dropdowm */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2 border 
            rounded-md focus-outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Add or Save Button */}
          <button
            onClick={editingTask ? saveEdit : addTask}
            className="text-xl w-full px-6 py-3 
            bg-blue-500 text-white rounded-md hover:bg-blue-600 
            transition duration-200"
          >
            {editingTask ? "Save" : "Add"}
          </button>
        </div>

        {/* Task List Section */}

        <ul className="space-y-6">
          {tasks.sort(sortTasks).map((task) => (
            <li
              key={task.id}
              className="flex justify-between 
              items-center p-4 bg-gray-50 border border-gray-200 
              shadow-md rounded-md hover:bg-gray-100 transition duration-200"
            >
              <div className="flex flex-col space-y-1">
                <h3
                  className={
                    task.completed
                      ? "line-through text-gray-400"
                      : "font-bold text-lg"
                  }
                >
                  {task.title}{" "}
                  <span
                    className={
                      task.priority === "Low"
                        ? "text-green-500"
                        : task.priority === "Medium"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }
                  >
                    ({task.priority})
                  </span>
                </h3>
                <p
                  className={
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }
                >
                  {task.description}
                </p>
              </div>

              {/* Task Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="ml-2 px-3 py-2 bg-green-500 text-white rounded-md"
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => editTask(task.id)}
                  className="px-3 py-2 bg-yellow-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
