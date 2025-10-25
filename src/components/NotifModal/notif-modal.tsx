import Modal from "../modal";
import type { Dispatch, SetStateAction } from "react";
import type { Notification } from "../../types/notification";

interface NotifModalProps {
  notification: Notification;
  notifModalOpen: boolean;
  setnotifModalOpen: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
}

export default function NotifModal({
  notification,
  notifModalOpen,
  setnotifModalOpen,
  onClose,
}: NotifModalProps) {
  return (
    <Modal
      open={notifModalOpen}
      onClose={onClose}
      title="Notification Details"
      setIsOpen={setnotifModalOpen}
      onConfirm={() => {}}
      isViewOnly={true}
    >
      <div className="p-6 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e6f0fa]">
            <svg
              className="w-6 h-6 text-[#0f6cbd]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 20.5c4.142 0 7.5-3.358 7.5-7.5S16.142 5.5 12 5.5 4.5 8.858 4.5 13s3.358 7.5 7.5 7.5z"
              />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-[#0f6cbd] capitalize">
              {typeof notification.type === "string"
                ? notification.type
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c: string) => c.toUpperCase())
                : ""}
            </div>
            <div className="text-xs text-gray-400">
              {notification.createdAt instanceof Date
                ? notification.createdAt.toLocaleString()
                : String(notification.createdAt)}
            </div>
          </div>
        </div>
        <div className="mb-4 text-gray-800 text-base whitespace-pre-line border-l-4 border-[#0f6cbd] pl-4 bg-[#f5faff] py-2">
          {notification.message}
        </div>
        {notification.targetMembers &&
          notification.targetMembers.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span className="font-medium">Targeted to:</span>
              <span className="truncate">
                {notification.targetMembers.join(", ")}
              </span>
            </div>
          )}
        {notification.targetDepartment &&
          notification.targetDepartment.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">Department:</span>
              <span className="truncate">
                {notification.targetDepartment.join(", ")}
              </span>
            </div>
          )}
      </div>
    </Modal>
  );
}
