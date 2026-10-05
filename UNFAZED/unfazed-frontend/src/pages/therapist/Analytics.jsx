import { useNavigate } from "react-router-dom";

export default function Analytics() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <span className="topbar-label">ANALYTICS</span>
          </div>
        </header>

        <section className="dashboard-content">
          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <div className="welcome-row">
            <div>
              <span className="date-label">INSIGHTS</span>

              <h1>Practice Analytics</h1>

              <p>
                Track your practice performance and activity.
              </p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">◉</div>

              <div>
                <span>Active Clients</span>
                <strong>24</strong>
                <small>+3 this month</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">◷</div>

              <div>
                <span>Completed Sessions</span>
                <strong>42</strong>
                <small>Out of 50 sessions</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">₹</div>

              <div>
                <span>Total Revenue</span>
                <strong>₹48,500</strong>
                <small>This month</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">▤</div>

              <div>
                <span>Notes Completed</span>
                <strong>38</strong>
                <small>Out of 42 sessions</small>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">
                    PERFORMANCE
                  </span>

                  <h2>Client engagement</h2>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-number">86%</div>

                <div>
                  <strong>Engagement rate</strong>

                  <p>
                    Sessions and follow-ups are progressing
                    this month.
                  </p>
                </div>
              </div>

              <div className="progress-bar">
                <span style={{ width: "86%" }}></span>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">
                    MONTHLY
                  </span>

                  <h2>Practice overview</h2>
                </div>
              </div>

              <div className="overview-row">
                <span>Completed sessions</span>
                <strong>42</strong>
              </div>

              <div className="overview-row">
                <span>Notes completed</span>
                <strong>38</strong>
              </div>

              <div className="overview-row">
                <span>Payments collected</span>
                <strong>₹48,500</strong>
              </div>

              <div className="overview-row">
                <span>Active clients</span>
                <strong>24</strong>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}