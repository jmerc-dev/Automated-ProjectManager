import React, { useState } from "react";

// Mock data for tasks
const tasks = [
  {
    id: 1,
    description: "Design the login page UI",
    progress: 80,
  },
  {
    id: 2,
    description: "Implement authentication logic",
    progress: 40,
  },
  {
    id: 3,
    description: "Write unit tests for user module",
    progress: 10,
  },
];

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="bg-gray-100 rounded-md h-3 w-full border border-gray-200 overflow-hidden shadow-sm">
      <div
        className="h-full rounded-md transition-all duration-300"
        style={{
          width: `${progress}%`,
          background: "#0f6cbd",
        }}
      />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 mb-8">
      <div className="flex items-center justify-between px-6 py-3">
        <span className="text-lg font-bold text-[#0f6cbd] tracking-tight select-none">
          AutoProject
        </span>
        <div className="flex items-center gap-2">
          {/* Placeholder avatar */}
          <span className="rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
            U
          </span>
        </div>
      </div>
    </nav>
  );
}

export default function MyTasks() {
  const [taskStates, setTaskStates] = useState(
    tasks.map((task) => ({
      ...task,
      completed: task.progress === 100,
    }))
  );

  const handleCompleteToggle = (id: number) => {
    setTaskStates((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              progress: !task.completed ? 100 : 0,
            }
          : task
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-8">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">My Tasks</h2>
        <ul className="list-none p-0 m-0">
          {taskStates.map((task) => (
            <li
              key={task.id}
              className="bg-white border border-gray-200 rounded-lg p-5 mb-4 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleCompleteToggle(task.id)}
                  className="accent-[#0f6cbd] w-4 h-4"
                />
                <span
                  className={`font-medium text-base ${
                    task.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-800"
                  }`}
                >
                  {task.description}
                </span>
              </div>
              <ProgressBar progress={task.progress} />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {task.progress}% complete
                </span>
                <button
                  className="text-xs text-[#0f6cbd] hover:underline"
                  // onClick={handleShowComments} // To be implemented
                >
                  Comments
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
