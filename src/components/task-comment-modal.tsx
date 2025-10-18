import Modal from "./modal";
import type { User } from "firebase/auth";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import TaskComment from "./task-comment";
import type { Comment } from "../types/comment";
import SendButton from "../assets/images/send.png";
import { listenToTaskComments } from "../services/firestore/comments";
import { useState } from "react";
import { addCommentToTask } from "../services/firestore/comments";

interface TaskCommentsModalProps {
  setShowCommentsModal: Dispatch<SetStateAction<boolean>>;
  showCommentsModal: boolean;
  user: User | null;
  taskId: string;
  projectId: string;
}

export default function TaskCommentsModal({
  showCommentsModal,
  setShowCommentsModal,
  user,
  projectId,
  taskId,
}: TaskCommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [modalCommentInput, setModalCommentInput] = useState("");

  function handleAddComment() {
    console.log("Adding comment:", modalCommentInput);
    if (modalCommentInput.trim() && projectId && user) {
      addCommentToTask(projectId, taskId, {
        authorName: user?.displayName || "Unknown",
        authorId: user?.uid || "unknown",
        text: modalCommentInput.trim(),
      });
      setModalCommentInput("");
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
    <Modal
      open={showCommentsModal}
      title="All Comments"
      setIsOpen={setShowCommentsModal}
      onClose={() => setShowCommentsModal(false)}
      onConfirm={() => setShowCommentsModal(false)}
      isViewOnly={true}
    >
      <div className="h-[70vh] flex flex-col justify-between">
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
            value={modalCommentInput}
            onChange={(e) => setModalCommentInput(e.target.value)}
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
    </Modal>
  );
}
