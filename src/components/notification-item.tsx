import { useEffect } from "react";
import type { Notification } from "../types/notification";
import { getRelativeTime } from "../util/date";
import { NotificationTypeToReadableString } from "../util/string-processing";
import { markNotificationAsRead } from "../services/firestore/notifications";
import { useAuth } from "../services/firebase/auth-context";
import { useState } from "react";

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const { user } = useAuth();
  const [thisNotification, setThisNotification] =
    useState<Notification>(notification);

  const [isUnread, setIsUnread] = useState<boolean>(true);

  useEffect(() => {
    setThisNotification(notification);

    if (notification.readBy.includes(user?.email ? user.email : "")) {
      setIsUnread(false);
    }
  }, [notification]);

  // Assume you pass currentUserEmail as a prop or get it from context
  // For demo, mark as unread if readBy does not include 'me@example.com'

  function handleClick() {
    if (isUnread && user?.email) {
      markNotificationAsRead(
        notification.projectId,
        notification.id,
        user?.email
      );
    }
  }

  return (
    <div
      className={
        `bg-[#f5faff] rounded-lg px-3 py-2 text-sm text-gray-700 relative hover:bg-gray-300 cursor-pointer` +
        (isUnread
          ? "border-[#0f6cbd] hover:bg-gray-300 cursor-pointer"
          : "border-transparent opacity-70 hover:bg-gray-300 cursor-pointer")
      }
      onClick={handleClick}
    >
      {isUnread && (
        <span
          className="absolute left-1 top-1 w-2 h-2 bg-[#0f6cbd] rounded-full"
          title="Unread"
        />
      )}
      <div className="font-medium text-[#155a8a]">
        {NotificationTypeToReadableString(thisNotification.type)}
      </div>
      <div>{thisNotification.message}</div>
      <div className="text-xs text-gray-400 mt-1">
        {getRelativeTime(thisNotification.createdAt)}
      </div>
    </div>
  );
}
