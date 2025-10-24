import type { Comment } from "../types/comment";
import type { Task } from "../types/task";
import { useEffect, useState } from "react";
import { useAuth } from "../services/firebase/auth-context";
import {
  addCommentToTask,
  getRecentComment,
} from "../services/firestore/comments";
import { addDays } from "../util/date";
import TaskCommentsModal from "./task-comment-modal";

interface TaskItemProps {
  task: Task;
  projectId?: string;
  //comments: Comment[];
}

export default function TaskItem({ task, projectId }: TaskItemProps) {
  const { user } = useAuth();
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [thisTask, setThisTask] = useState<Task>(task);
  const [modalCommentInput, setModalCommentInput] = useState("");
  const [lastComment, setLastComment] = useState<Comment | null>(null);

  useEffect(() => {
    setThisTask(task);

    getRecentComment(projectId || "", task.docId).then((comment) => {
      setLastComment(comment);
    });
  }, [task]);

  return (
    <li
      key={thisTask.docId}
      className="bg-gradient-to-r from-[#e6f0fa] via-white to-[#f7fafd] rounded-xl px-5 py-4 shadow border border-[#b3d1f7] flex flex-col"
      style={{
        boxShadow: "0 2px 8px 0 rgba(15,108,189,0.07)",
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0f6cbd]/10 border border-[#b3d1f7] text-[#0f6cbd] font-bold text-lg shadow-sm">
          {thisTask.docId}
        </span>
        <span className="font-semibold text-[#0f6cbd] text-base tracking-tight">
          {thisTask.name}
        </span>
      </div>
      {/* Task Dates and Progress */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col">
          <div className="flex gap-4 items-center">
            <span className="text-xs text-gray-500 flex items-center">
              Start:
              <span className="font-medium text-[#0f6cbd] ml-1">
                {new Date(thisTask.startDate as any).toLocaleDateString() ||
                  "N/A"}
              </span>
            </span>
            <span className="text-xs text-gray-500 flex items-center">
              End:
              <span className="font-medium text-[#d1502f] ml-1">
                {addDays(
                  new Date(thisTask.startDate as any),
                  7
                ).toLocaleDateString() || "N/A"}
              </span>
            </span>
          </div>
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
          {thisTask.notes === "" ? "No description provided." : thisTask.notes}
        </div>
      </div>
      {/* Comments List */}
      {/*comments[thisTask.id]?.length > 0 && (
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
          <span className="font-semibold text-[#0f6cbd]">
            {lastComment?.authorName ?? "No recent comments"}
          </span>
          <span className="italic text-gray-600">
            {lastComment?.text ?? "No comments yet."}
          </span>
          <span className="text-[10px] text-gray-400 ml-2">
            {lastComment?.createdAt?.toLocaleDateString() ?? "Unknown date"}
          </span>
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
        <TaskCommentsModal
          showCommentsModal={showCommentsModal}
          user={user}
          setShowCommentsModal={setShowCommentsModal}
          taskId={thisTask.docId}
          projectId={projectId || ""}
        />
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
