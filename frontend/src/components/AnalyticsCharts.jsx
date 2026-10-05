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

  const completedAngle =
    totalStatus === 0
      ? 0
      : (completed / totalStatus) * 360;

  const productivity =
    totalStatus === 0
      ? 0
      : Math.round((completed / totalStatus) * 100);

  return (
    <div className="charts-section">

      {/* ================= STATUS OVERVIEW ================= */}

      <div className="chart-card professional-chart-card">

        <div className="chart-header">
          <div>
            <h2>📌 Status Overview</h2>
            <p>Current task completion status</p>
          </div>

          <span className="chart-badge">
            {productivity}% Done
          </span>
        </div>

        <div className="donut-layout">

          <div className="donut-container">

            <div
              className="donut-chart"
              style={{
                background:
                  totalStatus === 0
                    ? "#e5e7eb"
                    : `conic-gradient(
                        #16a34a 0deg ${completedAngle}deg,
                        #f59e0b ${completedAngle}deg 360deg
                      )`
              }}
            >
              <div className="donut-center">
                <strong>{totalStatus}</strong>
                <span>Total Tasks</span>
              </div>
            </div>

          </div>

          <div className="status-summary">

            <div className="status-summary-item completed-summary">
              <div className="summary-icon">
                ✓
              </div>

              <div>
                <span>Completed</span>
                <strong>{completed}</strong>
                <small>{completedPercent}%</small>
              </div>
            </div>

            <div className="status-summary-item pending-summary">
              <div className="summary-icon">
                ⏳
              </div>

              <div>
                <span>Pending</span>
                <strong>{pending}</strong>
                <small>{pendingPercent}%</small>
              </div>
            </div>

          </div>

        </div>

        <div className="chart-legend">

          <div className="legend-item">

            <span className="legend-dot completed-dot"></span>

            <span>Completed</span>

            <strong>
              {completed} ({completedPercent}%)
            </strong>

          </div>

          <div className="legend-item">

            <span className="legend-dot pending-dot"></span>

            <span>Pending</span>

            <strong>
              {pending} ({pendingPercent}%)
            </strong>

          </div>

        </div>

      </div>


      {/* ================= PRIORITY OVERVIEW ================= */}

      <div className="chart-card professional-chart-card">

        <div className="chart-header">
          <div>
            <h2>🔥 Priority Overview</h2>
            <p>Task distribution by priority</p>
          </div>

          <span className="chart-badge priority-badge">
            {totalPriority} Tasks
          </span>
        </div>


        <div className="priority-chart">

          {/* HIGH */}

          <div className="priority-chart-row">

            <div className="priority-chart-label">

              <div className="priority-title">
                <span className="priority-dot high-priority-dot"></span>
                <span>High</span>
              </div>

              <strong>{high}</strong>

            </div>

            <div className="priority-chart-bar">

              <div
                className="priority-chart-fill high-fill"
                style={{
                  width: `${highPercent}%`
                }}
              >
                {high > 0 && (
                  <span>{highPercent}%</span>
                )}
              </div>

            </div>

          </div>


          {/* MEDIUM */}

          <div className="priority-chart-row">

            <div className="priority-chart-label">

              <div className="priority-title">
                <span className="priority-dot medium-priority-dot"></span>
                <span>Medium</span>
              </div>

              <strong>{medium}</strong>

            </div>

            <div className="priority-chart-bar">

              <div
                className="priority-chart-fill medium-fill"
                style={{
                  width: `${mediumPercent}%`
                }}
              >
                {medium > 0 && (
                  <span>{mediumPercent}%</span>
                )}
              </div>

            </div>

          </div>


          {/* LOW */}

          <div className="priority-chart-row">

            <div className="priority-chart-label">

              <div className="priority-title">
                <span className="priority-dot low-priority-dot"></span>
                <span>Low</span>
              </div>

              <strong>{low}</strong>

            </div>

            <div className="priority-chart-bar">

              <div
                className="priority-chart-fill low-fill"
                style={{
                  width: `${lowPercent}%`
                }}
              >
                {low > 0 && (
                  <span>{lowPercent}%</span>
                )}
              </div>

            </div>

          </div>

        </div>


        <div className="priority-total">

          <div>
            <span>Total Priority Tasks</span>
            <small>Across all priority levels</small>
          </div>

          <strong>{totalPriority}</strong>

        </div>

      </div>

    </div>
  );
}

export default AnalyticsCharts;