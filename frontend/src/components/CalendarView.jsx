import { useMemo, useState } from "react";

function CalendarView({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long"
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getDateString = (day) => {
    if (!day) return "";

    const monthNumber = String(month + 1).padStart(2, "0");
    const dayNumber = String(day).padStart(2, "0");

    return `${year}-${monthNumber}-${dayNumber}`;
  };

  const getTasksForDate = (day) => {
    const dateString = getDateString(day);

    return tasks.filter(
      (task) => task.dueDate === dateString
    );
  };

  const selectedTasks = useMemo(() => {
    if (!selectedDate) return [];

    return tasks.filter(
      (task) => task.dueDate === selectedDate
    );
  }, [tasks, selectedDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
    setSelectedDate(null);
  };

  const goToToday = () => {
    const today = new Date();

    setCurrentDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    const todayString = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

    setSelectedDate(todayString);
  };

  return (
    <div className="calendar-section">
      <div className="calendar-header">
        <div>
          <h2>📅 Calendar</h2>
          <p>View tasks by due date</p>
        </div>

        <div className="calendar-controls">
          <button onClick={goToPreviousMonth}>
            ◀
          </button>

          <button onClick={goToToday}>
            Today
          </button>

          <button onClick={goToNextMonth}>
            ▶
          </button>
        </div>
      </div>

      <h3 className="calendar-month">
        {monthName} {year}
      </h3>

      <div className="calendar-grid calendar-weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="calendar-grid calendar-days">
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <div
                className="calendar-day empty"
                key={`empty-${index}`}
              />
            );
          }

          const dateString = getDateString(day);
          const dayTasks = getTasksForDate(day);

          const today = new Date();

          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          const isSelected =
            selectedDate === dateString;

          return (
            <div
              className={`calendar-day ${
                isToday ? "today" : ""
              } ${isSelected ? "selected" : ""}`}
              key={dateString}
              onClick={() =>
                setSelectedDate(dateString)
              }
            >
              <span className="calendar-date">
                {day}
              </span>

              {dayTasks.length > 0 && (
                <div className="calendar-task-count">
                  {dayTasks.length}{" "}
                  {dayTasks.length === 1
                    ? "task"
                    : "tasks"}
                </div>
              )}

              <div className="calendar-task-dots">
                {dayTasks.slice(0, 3).map((task) => (
                  <span
                    key={task.id}
                    className={
                      task.status === "Completed"
                        ? "task-dot completed-dot"
                        : task.priority === "High"
                        ? "task-dot high-dot"
                        : "task-dot"
                    }
                    title={task.title}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="selected-date-tasks">
          <h3>
            📋 Tasks for {selectedDate}
          </h3>

          {selectedTasks.length === 0 ? (
            <p className="no-calendar-tasks">
              No tasks for this date.
            </p>
          ) : (
            <div className="calendar-task-list">
              {selectedTasks.map((task) => (
                <div
                  className="calendar-task-card"
                  key={task.id}
                >
                  <div>
                    <h4>{task.title}</h4>

                    {task.description && (
                      <p>{task.description}</p>
                    )}
                  </div>

                  <div className="calendar-task-meta">
                    <span
                      className={
                        task.status === "Completed"
                          ? "completed"
                          : "pending"
                      }
                    >
                      {task.status}
                    </span>

                    <span
                      className={
                        task.priority === "High"
                          ? "priority-high"
                          : task.priority === "Low"
                          ? "priority-low"
                          : "priority-medium"
                      }
                    >
                      {task.priority || "Medium"}
                    </span>

                    <span className="category-badge">
                      🏷️ {task.category || "Other"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CalendarView;