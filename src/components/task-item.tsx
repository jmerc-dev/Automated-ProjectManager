import type { Comment } from "../types/comment";
import type { Task } from "../types/task";
import Modal from "./modal";
import { useEffect, useState } from "react";
import SendButton from "../assets/images/send.png";

interface TaskItemProps {
  task: Task;
  //comments: Comment[];
}

export default function TaskItem({ task }: TaskItemProps) {
  // Example comments array for modal
  const exampleComments: Comment[] = [
    {
      id: "c1",
      memberName: "Alex",
      text: "Hey team, I'm waiting for the requirements doc from Sam before I can start.",
      date: "2025-10-14",
    },
    {
      id: "c2",
      memberName: "Sam",
      text: "Uploading the requirements doc now!",
      date: "2025-10-14",
    },
    {
      id: "c3",
      memberName: "Jamie",
      text: "Let me know if you need anything else.",
      date: "2025-10-15",
    },
  ];

  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [thisTask, setThisTask] = useState<Task>(task);

  useEffect(() => {
    setThisTask(task);
  }, []);

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
          {thisTask.id}
        </span>
        <span className="font-semibold text-[#0f6cbd] text-base tracking-tight">
          {thisTask.name}
        </span>
      </div>
      {/* Task Dates and Progress */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">
            Start:{" "}
            <span className="font-medium text-[#0f6cbd]">
              {task.startDate.toLocaleString() || "N/A"}
            </span>
          </span>
          <span className="text-xs text-gray-500">
            End:{" "}
            <span className="font-medium text-[#0f6cbd]">
              {task.startDate.toLocaleString() || "N/A"}
            </span>
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500 mb-1">Progress</span>
          <div className="w-24 h-3 bg-[#e6f0fa] rounded-full border border-[#b3d1f7] overflow-hidden">
            <div
              className="h-full bg-[#0f6cbd]"
              style={{ width: `${Math.min(thisTask.progress ?? 0, 100)}%` }}
            ></div>
          </div>
          <span className="text-xs text-[#0f6cbd] mt-1">
            {Math.min(thisTask.progress ?? 0, 100)}%
          </span>
        </div>
      </div>
      <div className="mb-3">
        <span className="block text-sm font-medium text-[#0f6cbd] mb-1">
          Description
        </span>
        <div className="bg-white border border-[#b3d1f7] rounded px-2 py-1 text-sm text-gray-700">
          {thisTask.notes === "" ? "No description provided." : task.notes}
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
      {/* Example Collaborative Comment */}
      <div className="mb-2">
        <span className="block text-xs text-gray-500 mb-1">
          Recent comment:
        </span>
        <div className="flex items-center gap-2 bg-[#f7fafd] border border-dashed border-[#b3d1f7] rounded px-2 py-1 text-xs text-gray-700">
          <span className="font-semibold text-[#0f6cbd]">Alex:</span>
          <span className="italic text-gray-600">
            Hey team, I'm waiting for the requirements doc from Sam before I can
            start. Can someone upload it here?
          </span>
          <span className="text-[10px] text-gray-400 ml-2">2025-10-14</span>
        </div>
      </div>
      {/* Show Comments Button */}
      <div className="mb-2 flex justify-end">
        <button
          className="bg-[#e6f0fa] border border-[#b3d1f7] px-3 py-1 rounded text-[#0f6cbd] text-xs hover:bg-[#d0e3fa] transition"
          onClick={() => setShowCommentsModal(true)}
        >
          Show Comments
        </button>
        {/* Comments Modal */}
        <Modal
          open={showCommentsModal}
          title="All Comments"
          setIsOpen={setShowCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          onConfirm={() => setShowCommentsModal(false)}
          isViewOnly={true}
        >
          <ul className="space-y-2">
            {exampleComments.map((c) => (
              <li
                key={c.id}
                className="bg-[#f7fafd] border border-[#b3d1f7] rounded px-3 py-2 text-sm flex flex-col"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[#0f6cbd]">
                    {c.memberName}
                  </span>
                  <span className="text-xs text-gray-400">{c.date}</span>
                </div>
                <span className="text-gray-700">{c.text}</span>
              </li>
            ))}
          </ul>
        </Modal>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="border border-[#b3d1f7] rounded px-2 py-1 flex-1 text-sm focus:ring-2 focus:ring-[#0f6cbd]/30"
        />
        <button className="bg-[#0f6cbd] text-white px-3 py-1 rounded text-sm hover:bg-[#095a9d] transition">
          <img src={SendButton} alt="Send" className="w-4 h-4" />
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
