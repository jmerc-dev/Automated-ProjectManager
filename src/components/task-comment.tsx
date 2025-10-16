import type { User } from "firebase/auth";
import type { Comment } from "../types/comment";
import { formatDateTime } from "../util/date";

interface TaskCommentProps {
  comment: Comment;
  user: User | null;
}

export default function TaskComment({ comment, user }: TaskCommentProps) {
  return (
    <li
      key={comment.id}
      className="bg-[#f7fafd] border border-[#b3d1f7] rounded px-3 py-2 text-sm flex flex-col"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-[#0f6cbd]">
          {comment.authorName === user?.displayName
            ? "You"
            : comment.authorName}
        </span>
        <span className="text-xs text-gray-400">
          {formatDateTime(comment.createdAt)}
        </span>
      </div>
      <span className="text-gray-700">{comment.text}</span>
    </li>
  );
}
