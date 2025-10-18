import type { User } from "firebase/auth";
import type { Comment } from "../types/comment";
import { formatDateTime } from "../util/date";
import { useEffect, useState } from "react";
import { deleteComment, updateComment } from "../services/firestore/comments";

interface TaskCommentProps {
  comment: Comment & { updatedAt?: Date };
  user: User | null;
  projectId: string;
  taskId: string;
}

export default function TaskComment({
  comment,
  user,
  projectId,
  taskId,
}: TaskCommentProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState(comment.text);
  const isUpdated =
    comment.updatedAt != null || comment.updatedAt !== undefined;

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const isOwnComment = comment.authorId === user?.uid;

  useEffect(() => {
    console.log("isEditing changed:", isEditing);
  }, [isEditing]);

  const handleDelete = () => {
    if (comment.id && user) {
      deleteComment(projectId, taskId, comment.id);
    }
  };

  return (
    <li
      key={comment.id}
      className="bg-[#f7fafd] border border-[#b3d1f7] rounded px-3 py-2 text-sm flex flex-col relative"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-[#0f6cbd]">
          {comment.authorName === user?.displayName
            ? "You"
            : comment.authorName}
        </span>
        <span className="flex items-center gap-2 text-xs text-gray-400 ml-4">
          {isUpdated && (
            <span className="ml-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-semibold border border-yellow-200">
              updated
            </span>
          )}
          {comment.updatedAt != null
            ? formatDateTime(new Date(comment.updatedAt))
            : formatDateTime(comment.createdAt)}

          {isOwnComment && (
            <div className="relative ml-2">
              <button
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 focus:outline-none"
                onClick={() => setShowMenu((v) => !v)}
                aria-label="More options"
              >
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <circle cx="4" cy="10" r="1.5" />
                  <circle cx="10" cy="10" r="1.5" />
                  <circle cx="16" cy="10" r="1.5" />
                </svg>
              </button>
              {showMenu && (
                <div
                  className="absolute z-50 w-28 bg-white border border-gray-200 rounded shadow-lg mt-2 right-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => {
                      setShowMenu(false);
                      setIsEditing(true);
                      setEditValue(comment.text);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => {
                      setShowMenu(false);
                      deleteComment(projectId, taskId, comment.id!);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </span>
      </div>
      {isEditing ? (
        <div className="flex gap-2 items-center mt-1">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="border border-[#b3d1f7] rounded px-2 py-1 flex-1 text-sm focus:ring-2 focus:ring-[#0f6cbd]/30"
          />
          <button
            className="bg-[#0f6cbd] text-white px-3 py-1 rounded text-sm hover:bg-[#095a9d] transition"
            onClick={() => {
              // TODO: Call update logic here, e.g. updateComment(comment.id, editValue)
              setIsEditing(false);
              updateComment(projectId, taskId, comment.id!, editValue);
            }}
          >
            Update
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
            onClick={() => {
              setIsEditing(false);
              setEditValue(comment.text);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <span className="text-gray-700 break-words">{comment.text}</span>
      )}
    </li>
  );
}
