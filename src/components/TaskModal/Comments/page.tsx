import TaskComment from "../../task-comment";
import { useState, useEffect } from "react";
import type { Comment } from "../../../types/comment";
import { useAuth } from "../../../services/firebase/auth-context";
import {
  addCommentToTask,
  listenToTaskComments,
} from "../../../services/firestore/comments";
import SendButton from "../../../assets/images/send.png";

interface TaskCommentsPageProps {
  projectId: string;
  taskId: string;
}

export default function TaskCommentsPage({
  projectId,
  taskId,
}: TaskCommentsPageProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setcommentInput] = useState("");
  const { user } = useAuth();

  function handleAddComment() {
    if (commentInput.trim() && projectId && user) {
      addCommentToTask(projectId, taskId, {
        authorName: user?.displayName || "Unknown",
        authorId: user?.uid || "unknown",
        text: commentInput.trim(),
      });
      setcommentInput("");
    }
  }

  useEffect(() => {
    const unsubscribe = listenToTaskComments(
      projectId,
      taskId,
      (fetchedComments) => {
        // Update state with fetched comments
        setComments(fetchedComments);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="h-[400px] flex flex-col justify-between min-w-[400px] max-w-md">
      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No comments yet.</p>
      ) : (
        <ul className="space-y-2 mb-4 overflow-y-auto h-full">
          {comments.map((c) => (
            <TaskComment
              key={c.id}
              comment={c}
              user={user}
              projectId={projectId}
              taskId={taskId}
            />
          ))}
        </ul>
      )}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setcommentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddComment();
            }
          }}
          placeholder="Add a comment..."
          className="border border-[#b3d1f7] rounded px-2 py-1 flex-1 text-sm focus:ring-2 focus:ring-[#0f6cbd]/30"
        />
        <button
          className="bg-[#0f6cbd] text-white px-3 py-1 rounded text-sm hover:bg-[#095a9d] transition flex items-center"
          onClick={handleAddComment}
        >
          <img src={SendButton} alt="Send" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
