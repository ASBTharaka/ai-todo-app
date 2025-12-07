import React, { useEffect, useState } from "react";
import Fuse from "fuse.js";

const ToDo = () => {
const [todos, setTodos] = useState([]);
const [newTask, setNewTask] = useState("");
const [editIndex, setEditIndex] = useState(null);
const [editText, setEditText] = useState("");
const [selectedPriority, setSelectedPriority] = useState("Low");
const [editPriority, setEditPriority] = useState("Low");
const [suggestions, setSuggestions] = useState([]);
const [searchQuery, setSearchQuery] = useState("");
const [summary, setSummary] = useState("");
const [filter, setFilter] = useState("all"); // all | completed | pending
const [darkMode, setDarkMode] = useState(false);

// Voice API
const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// Load Local Storage
useEffect(() => {
const saved = JSON.parse(localStorage.getItem("todos"));
const theme = JSON.parse(localStorage.getItem("darkMode"));
if (saved) setTodos(saved);
if (theme) setDarkMode(theme);
}, []);

// Save Local Storage
useEffect(() => {
localStorage.setItem("todos", JSON.stringify(todos));
}, [todos]);

useEffect(() => {
localStorage.setItem("darkMode", JSON.stringify(darkMode));
}, [darkMode]);

// AI Priority Prediction (mock)
const predictPriority = (task) => {
const t = task.toLowerCase();
if (t.includes("pay") || t.includes("submit") || t.includes("exam"))
return "High";
if (t.includes("clean") || t.includes("organize")) return "Medium";
return "Low";
};

// Smart AI Suggestions (mock)
const getMockSuggestions = (text) => {
const t = text.toLowerCase();
if (t.includes("buy")) return ["Buy milk", "Buy bread", "Buy eggs"];
if (t.includes("study"))
return ["Study 1 hour", "Revise notes", "Attempt past papers"];
if (t.includes("project"))
return ["Complete module", "Fix UI bugs", "Write documentation"];
return [];
};

// Smart AI Task Generator
const generateSmartTasks = () => {
const list = [
"Study React for 1 hour",
"Revise System Analysis notes",
"Practice JavaScript array methods",
"Upload AI images to Adobe Stock",
"Work on Gemini clone UI fixes",
"Prepare ARICT exhibition documents",
"Study Physics Practical for exam",
];
const newTasks = list.map((t) => ({
text: t,
done: false,
priority: predictPriority(t),
}));
setTodos([...todos, ...newTasks]);
};

// Add Task
const addTodo = () => {
if (!newTask.trim()) return;
setTodos([
...todos,
{ text: newTask, done: false, priority: selectedPriority },
]);
setNewTask("");
setSelectedPriority("Low");
setSuggestions([]);
};

// Save Edit
const saveEdit = () => {
const updated = [...todos];
updated[editIndex].text = editText;
updated[editIndex].priority = editPriority;
setTodos(updated);
setEditIndex(null);
setEditText("");
setEditPriority("Low");
};

// Toggle Done
const toggleDone = (index) => {
const updated = [...todos];
updated[index].done = !updated[index].done;
setTodos(updated);
};

// Delete
const deleteTodo = (index) => {
setTodos(todos.filter((_, i) => i !== index));
};

// Fuse.js Search
const fuse = new Fuse(todos, {
keys: ["text"],
threshold: 0.3,
});

let filteredTodos = searchQuery
? fuse.search(searchQuery).map((r) => r.item)
: todos;

// Apply Filter
if (filter === "completed") {
filteredTodos = filteredTodos.filter((t) => t.done);
}
if (filter === "pending") {
filteredTodos = filteredTodos.filter((t) => !t.done);
}

// Sort by Priority
const sortByPriority = () => {
const sorted = [...todos].sort((a, b) => {
const order = { High: 1, Medium: 2, Low: 3 };
return order[a.priority] - order[b.priority];
});
setTodos(sorted);
};

// AI Summary
const generateSummary = () => {
const done = todos.filter((t) => t.done).length;
const pending = todos.length - done;
setSummary(
`You completed ${done} tasks today. You still have ${pending} pending. Keep going!`
);
};

// Voice Input
const startVoiceInput = () => {
if (!recognition) return alert("Speech Recognition not supported.");
recognition.start();
recognition.onresult = (e) => {
const voiceText = e.results[0][0].transcript;
setNewTask(voiceText);
setSuggestions(getMockSuggestions(voiceText));
};
};

return (
<div
className={`min-h-screen p-6 flex items-center justify-center ${
        darkMode ? "bg-slate-900" : "bg-slate-200"
      }`}
> <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl"> <div className="flex justify-between items-center"> <h1 className="text-3xl font-bold text-slate-900">
AI Smart To-Do List </h1>


      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-3 py-1 bg-black text-white rounded-lg"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </div>

    {/* Priority Legend */}
    {/*<div className="flex gap-3 mt-3">
      <span className="px-2 py-1 text-white bg-red-500 rounded-full text-xs">
        High
      </span>
      <span className="px-2 py-1 text-white bg-yellow-500 rounded-full text-xs">
        Medium
      </span>
      <span className="px-2 py-1 text-white bg-green-500 rounded-full text-xs">
        Low
      </span>
    </div>*/}

    {/* Filter Tabs */}
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => setFilter("all")}
        className={`px-3 py-1 rounded ${
          filter === "all" ? "bg-slate-800 text-white" : "bg-slate-300"
        }`}
      >
        All
      </button>
      <button
        onClick={() => setFilter("completed")}
        className={`px-3 py-1 rounded ${
          filter === "completed"
            ? "bg-slate-800 text-white"
            : "bg-slate-300"
        }`}
      >
        Completed
      </button>
      <button
        onClick={() => setFilter("pending")}
        className={`px-3 py-1 rounded ${
          filter === "pending"
            ? "bg-slate-800 text-white"
            : "bg-slate-300"
        }`}
      >
        Pending
      </button>
    </div>

    {/* Sort by Priority */}
    <button
      onClick={sortByPriority}
      className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg"
    >
      🔥 Sort by Priority
    </button>

    {/* Search */}
    {/*<input
      type="text"
      placeholder="Search tasks..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full mt-4 p-2 border rounded-lg"
    />*/}

    {/* New Task + Priority */}
    <div className="flex flex-col gap-2 mt-4">
      {/* Priority Buttons */}
      <div className="flex gap-2">
        {["High", "Medium", "Low"].map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPriority(p)}
            className={`px-3 py-1 rounded-lg text-white ${
              selectedPriority === p
                ? p === "High"
                  ? "bg-red-600"
                  : p === "Medium"
                  ? "bg-yellow-600"
                  : "bg-green-600"
                : p === "High"
                ? "bg-red-400"
                : p === "Medium"
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input + Buttons */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter new task..."
          value={newTask}
          onChange={(e) => {
            setNewTask(e.target.value);
            setSuggestions(getMockSuggestions(e.target.value));
          }}
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={startVoiceInput}
          className="bg-purple-500 text-white px-3 py-2 rounded-lg"
        >
          🎤
        </button>
        <button
          onClick={addTodo}
          className="bg-slate-600 text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>
    </div>

    {/* AI Suggestions */}
    {suggestions.length > 0 && (
      <div className="mt-2 space-y-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() =>
              setTodos([
                ...todos,
                { text: s, done: false, priority: predictPriority(s) },
              ])
            }
            className="w-full bg-slate-200 px-2 py-1 rounded-lg"
          >
            ➕ {s}
          </button>
        ))}
      </div>
    )}

    {/* Smart Task Generator */}
    <button
      onClick={generateSmartTasks}
      className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg"
    >
      🧠 Generate Smart Study Tasks
    </button>

    {/* Todo List */}
    <ul className="mt-6 space-y-3">
      {filteredTodos.length === 0 && (
        <p className="text-center text-gray-500">No tasks found</p>
      )}

      {filteredTodos.map((todo, index) => (
        <li
          key={index}
          className="flex items-center justify-between bg-gray-50 p-3 rounded-xl shadow-sm"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleDone(index)}
              className="w-5 h-5"
            />

            {/* Edit mode */}
            {editIndex === index ? (
              <div className="flex items-center gap-2">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border p-1 rounded"
                />
                {["High", "Medium", "Low"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setEditPriority(p)}
                    className={`px-2 py-1 rounded-lg text-white text-xs ${
                      editPriority === p
                        ? p === "High"
                          ? "bg-red-600"
                          : p === "Medium"
                          ? "bg-yellow-600"
                          : "bg-green-600"
                        : p === "High"
                        ? "bg-red-400"
                        : p === "Medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            ) : (
              <span
                className={
                  todo.done ? "line-through text-gray-400" : "text-black"
                }
              >
                {todo.text}
              </span>
            )}

            {/* Priority badge */}
            <span
              className={`px-2 py-1 rounded-full text-xs text-white ${
                todo.priority === "High"
                  ? "bg-red-500"
                  : todo.priority === "Medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            >
              {todo.priority}
            </span>
          </div>

          <div className="flex gap-2">
            {editIndex === index ? (
              <button
                onClick={saveEdit}
                className="text-green-600 font-bold"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditIndex(index);
                  setEditText(todo.text);
                  setEditPriority(todo.priority);
                }}
                className="text-blue-600"
              >
                Edit
              </button>
            )}

            <button
              onClick={() => deleteTodo(index)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>

    {/* Summary */}
    <button
      onClick={generateSummary}
      className="w-full mt-6 bg-slate-700 text-white p-3 rounded-xl"
    >
      Generate AI Summary
    </button>

    {summary && (
      <p className="mt-4 p-3 bg-slate-100 rounded-lg text-slate-700">
        {summary}
      </p>
    )}
  </div>
</div>

);
};

export default ToDo;
