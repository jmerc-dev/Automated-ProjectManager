import type { Comment } from "../types/comment";
import type { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  //comments: Comment[];
}

export default function TaskItem({ task }: TaskItemProps) {
  return (
    <li
      key={task.id}
      className="bg-gradient-to-r from-[#e6f0fa] via-white to-[#f7fafd] rounded-xl px-5 py-4 shadow border border-[#b3d1f7] flex flex-col"
      style={{
        boxShadow: "0 2px 8px 0 rgba(15,108,189,0.07)",
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0f6cbd]/10 border border-[#b3d1f7] text-[#0f6cbd] font-bold text-lg shadow-sm">
          {task.id}
        </span>
        <span className="font-semibold text-[#0f6cbd] text-base tracking-tight">
          {task.name}
        </span>
      </div>
      {/* Notes/Description at top */}
      <div className="mb-3">
        <span className="block text-sm font-medium text-[#0f6cbd] mb-1">
          Description
        </span>
        <div className="bg-white border border-[#b3d1f7] rounded px-2 py-1 text-sm text-gray-700">
          {task.notes === "" ? "No description provided." : task.notes}
        </div>
      </div>
      {/* Comments List */}
      {/*comments[task.id]?.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm">
          {comments[task.id].map((c, idx) => (
            <li
              key={idx}
              className="bg-white rounded px-2 py-1 border border-gray-200"
            >
              {c}
            </li>
          ))}
        </ul>
      )*/}
      {/* Add Comment Input */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="border border-[#b3d1f7] rounded px-2 py-1 flex-1 text-sm focus:ring-2 focus:ring-[#0f6cbd]/30"
        />
        <button className="bg-[#0f6cbd] text-white px-3 py-1 rounded text-sm hover:bg-[#095a9d] transition">
          Add
        </button>
      </div>
      {/* Upload Feature */}
      <div className="mt-3 flex items-center gap-2">
        {/* <label
          htmlFor={`upload-${task.id}`}
          className="bg-[#e6f0fa] border border-[#b3d1f7] px-3 py-1 rounded cursor-pointer text-[#0f6cbd] text-sm hover:bg-[#d0e3fa] transition"
        >
          Upload file
        </label>
        <input
          type="file"
          id={`upload-${task.id}`}
          className="hidden"
          onChange={(e) => handleUpload(task.id, e.target.files?.[0] || null)}
        /> */}
        {/*uploads[task.id] && (
          <>
            <span className="text-xs text-gray-700 ml-2">
              Uploaded: {uploads[task.id]?.name}
            </span>
            <button
              className="ml-2 px-2 py-1 rounded bg-[#0f6cbd] text-white text-xs hover:bg-[#095a9d] transition"
              onClick={() => {
                const file = uploads[task.id];
                if (file) {
                  const url = URL.createObjectURL(file);
                  window.open(url, "_blank");
                  setTimeout(() => URL.revokeObjectURL(url), 10000);
                }
              }}
            >
              Show Uploaded File
            </button>
          </>
        )*/}
      </div>
    </li>
  );
}
