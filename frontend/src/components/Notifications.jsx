import { useEffect, useState } from "react";

function Notifications({ tasks }) {

  const [readNotifications, setReadNotifications] = useState(() => {
    const saved = localStorage.getItem("taskflowReadNotifications");

    return saved ? JSON.parse(saved) : [];
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const notifications = [];

  tasks.forEach((task) => {

    if (!task.dueDate || task.status === "Completed") {
      return;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const difference = Math.ceil(
      (dueDate - today) / (1000 * 60 * 60 * 24)
    );

    let notification = null;

    if (difference < 0) {
      notification = {
        id: `${task.id}-overdue`,
        type: "overdue",
        icon: "⚠️",
        title: task.title,
        message: "This task is overdue."
      };
    } else if (difference === 0) {
      notification = {
        id: `${task.id}-today`,
        type: "today",
        icon: "📅",
        title: task.title,
        message: "This task is due today."
      };
    } else if (difference === 1) {
      notification = {
        id: `${task.id}-tomorrow`,
        type: "tomorrow",
        icon: "⏰",
        title: task.title,
        message: "This task is due tomorrow."
      };
    } else if (difference <= 7) {
      notification = {
        id: `${task.id}-upcoming`,
        type: "upcoming",
        icon: "🚀",
        title: task.title,
        message: `Due in ${difference} days.`
      };
    }

    if (notification) {
      notifications.push(notification);
    }
  });

  const unreadCount = notifications.filter(
    (notification) => !readNotifications.includes(notification.id)
  ).length;

  const markAsRead = (id) => {

    if (readNotifications.includes(id)) {
      return;
    }

    const updated = [...readNotifications, id];

    setReadNotifications(updated);

    localStorage.setItem(
      "taskflowReadNotifications",
      JSON.stringify(updated)
    );
  };

  const markAllAsRead = () => {

    const allIds = notifications.map(
      (notification) => notification.id
    );

    setReadNotifications(allIds);

    localStorage.setItem(
      "taskflowReadNotifications",
      JSON.stringify(allIds)
    );
  };

  const markAllAsUnread = () => {

    setReadNotifications([]);

    localStorage.removeItem(
      "taskflowReadNotifications"
    );
  };

  useEffect(() => {

    const currentIds = notifications.map(
      (notification) => notification.id
    );

    const cleaned = readNotifications.filter(
      (id) => currentIds.includes(id)
    );

    if (cleaned.length !== readNotifications.length) {

      setReadNotifications(cleaned);

      localStorage.setItem(
        "taskflowReadNotifications",
        JSON.stringify(cleaned)
      );
    }

  }, [tasks]);

  return (
    <div className="notifications-section">

      <div className="notifications-header">

        <div className="notifications-title">
          <h2>🔔 Notifications</h2>

          <span className="notification-count">
            {unreadCount}
          </span>
        </div>

        {notifications.length > 0 && (
          <div className="notification-actions">

            <button onClick={markAllAsRead}>
              ✓ Mark all as read
            </button>

            <button onClick={markAllAsUnread}>
              ↺ Mark all unread
            </button>

          </div>
        )}

      </div>

      {notifications.length === 0 ? (

        <div className="no-notifications">

          <div className="notification-empty-icon">
            🎉
          </div>

          <h3>You're all caught up!</h3>

          <p>
            No upcoming reminders or overdue tasks.
          </p>

        </div>

      ) : (

        <div className="notification-list">

          {notifications.map((notification) => {

            const isRead = readNotifications.includes(
              notification.id
            );

            return (
              <div
                className={`notification-item ${
                  notification.type
                } ${isRead ? "read" : "unread"}`}
                key={notification.id}
              >

                <div className="notification-icon">
                  {notification.icon}
                </div>

                <div className="notification-content">

                  <h3>{notification.title}</h3>

                  <p>{notification.message}</p>

                </div>

                <div className="notification-status">

                  {isRead ? (
                    <span className="read-label">
                      ✓ Read
                    </span>
                  ) : (
                    <button
                      className="mark-read-btn"
                      onClick={() =>
                        markAsRead(notification.id)
                      }
                    >
                      Mark as read
                    </button>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Notifications;