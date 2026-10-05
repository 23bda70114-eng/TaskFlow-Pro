import { useEffect, useState } from "react";
import API from "../services/api";

function ActivityHistory({ taskId }) {
  const [activities, setActivities] = useState([]);

  const getActivities = async () => {
    try {
      const response = await API.get(`/activities/task/${taskId}`);
      setActivities(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (taskId) {
      getActivities();
    }
  }, [taskId]);

  return (
    <div className="activity-history">
      <h4>📜 Activity History</h4>

      {activities.length === 0 ? (
        <p className="no-activity">
          No activity recorded yet.
        </p>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <div
              className="activity-item"
              key={activity.id}
            >
              <div className="activity-icon">
                📝
              </div>

              <div className="activity-content">
                <strong>
                  {activity.action}
                </strong>

                <span>
                  👤 {activity.author || "User"}
                </span>

                <small>
                  🕒 {activity.createdAt}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityHistory;