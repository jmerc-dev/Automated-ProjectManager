import { useEffect, useState } from "react";
import NotifIcon from "../assets/images/notification.png";
import { useAuth } from "../services/firebase/auth-context";
import { listenToNotifications } from "../services/firestore/notifications";
import type { Notification } from "../types/notification";
import NotificationItem from "./notification-item";
import Modal from "./modal";
import NotifModal from "./NotifModal/notif-modal";

interface NotificationDropdownProps {
  projectId: string;
}

export default function NotifDropdown({
  projectId,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const [notifModalOpen, setNotifModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.email) {
      listenToNotifications(projectId, user.email, setNotifications);
    }
  }, [user]);

  function handleNotificationClick(clickedNotification: Notification) {
    setNotifModalOpen(true);
    setSelectedNotification(clickedNotification);
    console.log("Clicked notification:", clickedNotification);
  }

  return (
    <div className="relative inline-block">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer rounded-full p-2 bg-white/70 hover:bg-[#e6f0fa] transition shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f6cbd]/30"
      >
        <img src={NotifIcon} className="w-6 h-6" />
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-[#e6f0fa] rounded-xl shadow-lg z-40">
          <div className="p-4">
            <div className="font-semibold text-[#0f6cbd] mb-2">
              Notifications
            </div>
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <div className="text-gray-500 text-sm">
                  No new notifications.
                </div>
              ) : (
                notifications.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    handleClick={() => handleNotificationClick(notif)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {selectedNotification && (
        <NotifModal
          notification={selectedNotification}
          notifModalOpen={notifModalOpen}
          setnotifModalOpen={setNotifModalOpen}
          onClose={() => {
            setNotifModalOpen(false);
            setSelectedNotification(null);
          }}
        />
      )}
    </div>
  );
}
