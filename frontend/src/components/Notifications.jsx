function Notifications({ tasks }) {

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

    if (difference < 0) {

      notifications.push({
        type: "overdue",
        icon: "⚠️",
        title: task.title,
        message: "This task is overdue."
      });

    } else if (difference === 0) {

      notifications.push({
        type: "today",
        icon: "📅",
        title: task.title,
        message: "This task is due today."
      });

    } else if (difference === 1) {

      notifications.push({
        type: "tomorrow",
        icon: "⏰",
        title: task.title,
        message: "This task is due tomorrow."
      });

    } else if (difference <= 7) {

      notifications.push({
        type: "upcoming",
        icon: "🚀",
        title: task.title,
        message: `Due in ${difference} days.`
      });

    }

  });

  return (
    <div className="notifications-section">

      <div className="notifications-header">

        <h2>🔔 Notifications</h2>

        <span className="notification-count">
          {notifications.length}
        </span>

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

          {notifications.map((notification, index) => (

            <div
              className={`notification-item ${notification.type}`}
              key={`${notification.title}-${index}`}
            >

              <div className="notification-icon">
                {notification.icon}
              </div>

              <div className="notification-content">

                <h3>{notification.title}</h3>

                <p>{notification.message}</p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Notifications;