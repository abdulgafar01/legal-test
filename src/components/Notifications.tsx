"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Bell } from "lucide-react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationProps {
  notification: { text: string; timestamp: Date };
}

const Notifications: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations("settingsSeeker");
  const [notifications, setNotifications] = useState<{ text: string; timeStamp: Date }[]>([]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto text-center border-0 shadow-lg max-h-80 overflow-y-auto">
        <div className="py-6">
          <div className="w-14 py-4 bg-yellow-100 rounded-full mx-auto flex items-center justify-center">
            <div className=" bg-yellow-500 rounded-full flex items-center justify-center">
              <Bell />
            </div>
          </div>
        </div>
        <DialogTitle>{t("Your Notifications")}</DialogTitle>
        {notifications.length > 0 ? (
          <div className="flex flex-col">
            {notifications.map((item, index) => (
              <Notification
                key={`notification-${index}`}
                notification={{ text: item.text, timestamp: item.timeStamp }}
              ></Notification>
            ))}
          </div>
        ) : (
          <p className="my-8">{t("noNotifications")}</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const [isRead, setIsRead] = useState(false);
  return (
    <div className="py-4 relative border-b border-b-[#444]">
      <button
        title="Mark as read"
        className="flex items-center"
        onClick={() => setIsRead(true)}
      >
        <div
          className={`p-1 ${
            isRead ? "bg-green-500" : "bg-[tomato]"
          } rounded-full flex items-center justify-center cursor-pointer hover:opacity-80`}
        >
          {isRead ? (
            <FaCheck className="text-white" />
          ) : (
            <FaTimes className="text-white" />
          )}
        </div>
        {notification.text}
      </button>
      <span className="absolute bottom-1 right-1 text-sm">
        {new Date(notification.timestamp).toLocaleDateString("en-US", {
          dateStyle: "short",
        })}
      </span>
    </div>
  );
};

export default Notifications;
