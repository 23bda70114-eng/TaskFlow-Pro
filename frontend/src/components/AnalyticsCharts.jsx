function AnalyticsCharts({
  pending,
  completed,
  high,
  medium,
  low
}) {

  const totalStatus = pending + completed;

  const pendingPercent =
    totalStatus === 0
      ? 0
      : Math.round((pending / totalStatus) * 100);

  const completedPercent =
    totalStatus === 0
      ? 0
      : Math.round((completed / totalStatus) * 100);

  const totalPriority = high + medium + low;

  const highPercent =
    totalPriority === 0
      ? 0
      : Math.round((high / totalPriority) * 100);

  const mediumPercent =
    totalPriority === 0
      ? 0
      : Math.round((medium / totalPriority) * 100);

  const lowPercent =
    totalPriority === 0
      ? 0
      : Math.round((low / totalPriority) * 100);

  const pendingAngle =
    totalStatus === 0
      ? 0
      : (pending / totalStatus) * 360;

  return (
    <div className="charts-section">

      {/* Status Chart */}

      <div className="chart-card">

        <h2>📌 Status Overview</h2>

        <div className="donut-container">

          <div
            className="donut-chart"
            style={{
              background: `conic-gradient(
                #f59e0b 0deg ${pendingAngle}deg,
                #16a34a ${pendingAngle}deg 360deg
              )`
            }}
          >

            <div className="donut-center">

              <strong>{totalStatus}</strong>

              <span>Tasks</span>

            </div>

          </div>

        </div>

        <div className="chart-legend">

          <div className="legend-item">

            <span className="legend-dot pending-dot"></span>

            <span>Pending</span>

            <strong>
              {pending} ({pendingPercent}%)
            </strong>

          </div>

          <div className="legend-item">

            <span className="legend-dot completed-dot"></span>

            <span>Completed</span>

            <strong>
              {completed} ({completedPercent}%)
            </strong>

          </div>

        </div>

      </div>

      {/* Priority Chart */}

      <div className="chart-card">

        <h2>🔥 Priority Overview</h2>

        <div className="priority-chart">

          <div className="priority-chart-row">

            <div className="priority-chart-label">
              <span>High</span>
              <strong>{high}</strong>
            </div>

            <div className="priority-chart-bar">

              <div
                className="priority-chart-fill high-fill"
                style={{
                  width: `${highPercent}%`
                }}
              ></div>

            </div>

          </div>

          <div className="priority-chart-row">

            <div className="priority-chart-label">
              <span>Medium</span>
              <strong>{medium}</strong>
            </div>

            <div className="priority-chart-bar">

              <div
                className="priority-chart-fill medium-fill"
                style={{
                  width: `${mediumPercent}%`
                }}
              ></div>

            </div>

          </div>

          <div className="priority-chart-row">

            <div className="priority-chart-label">
              <span>Low</span>
              <strong>{low}</strong>
            </div>

            <div className="priority-chart-bar">

              <div
                className="priority-chart-fill low-fill"
                style={{
                  width: `${lowPercent}%`
                }}
              ></div>

            </div>

          </div>

        </div>

        <div className="priority-total">

          Total Priority Tasks:
          {" "}
          <strong>{totalPriority}</strong>

        </div>

      </div>

    </div>
  );
}

export default AnalyticsCharts;