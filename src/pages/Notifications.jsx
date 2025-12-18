import React, { useEffect, useState } from "react";
import { getContactMessageById, getNotifications, markNotificationRead } from "../api/api";
import ContactMessageModal from "../components/ContactMessageModal";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const openNotification = async (n) => {
    // mark as read
    if (!n.isRead) {
      await markNotificationRead(n._id);
    }

    // fetch full contact message
    const res = await getContactMessageById(n.relatedId);
    setSelectedMessage(res.message);
    setModalOpen(true);

    loadNotifications();
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const res = await getNotifications();
    if (res) {
      setNotifications(res);
    }
  };

  const handleRead = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">🔔 No notifications available</div>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => openNotification(n)}
            className={`cursor-pointer p-4 mb-4 rounded-xl shadow border-l-4
  ${n.isRead ? "bg-gray-100 border-gray-400" : "bg-white border-green-600"}`}
          >
            <h3 className="font-semibold text-lg">{n.title}</h3>
            <p className="text-gray-700">{n.message}</p>

            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>{new Date(n.createdAt).toLocaleString()}</span>

              {!n.isRead && (
                <button onClick={() => handleRead(n._id)} className="text-green-600 font-medium hover:underline">
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))
      )}
      <ContactMessageModal
        open={modalOpen}
        data={selectedMessage}
        onClose={() => {
          setModalOpen(false);
          setSelectedMessage(null);
        }}
      />
    </div>
  );
};

export default Notifications;
