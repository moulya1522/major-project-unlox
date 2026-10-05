import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function getGreeting(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";

  return "Good night";
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function Dashboard() {
  const { therapist, logout } = useAuth();

  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const firstName =
    therapist?.name?.split(" ")[0] || "Therapist";

  const greeting = getGreeting(currentTime.getHours());

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small">U</div>

          <div>
            <strong>Unfazed</strong>
            <span>Therapist workspace</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">WORKSPACE</div>

          <button className="nav-item active">
            <span>⌂</span>
            Dashboard
          </button>

          <button
            onClick={() => navigate("/clients")}
            className="nav-item"
          >
            <span>◉</span>
            Clients
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/schedule")}
          >
            <span>◷</span>
            Schedule
          </button>

          <button
            onClick={() => navigate("/sessions")}
            className="nav-item"
          >
            <span>▣</span>
            Sessions
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/notes")}
          >
            <span>▤</span>
            Clinical Notes
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/payments")}
          >
            <span>₹</span>
            Payments
          </button>

          <button
            onClick={() => navigate("/packages")}
            className="nav-item"
          >
            <span>📦</span>
            Packages
          </button>

          <div className="nav-section-title">INSIGHTS</div>

          <button
            className="nav-item"
            onClick={() => navigate("/analytics")}
          >
            <span>⌁</span>
            Analytics
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/messages")}
          >
            <span>◌</span>
            Messages
          </button>
        </nav>

        <div className="sidebar-bottom">
          {/* THERAPIST PROFILE */}
          <button
            type="button"
            className="mini-profile profile-clickable"
            onClick={() => navigate("/change-password")}
            title="Open profile settings"
          >
            <div className="avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{therapist?.name}</strong>
              <span>{therapist?.email}</span>
            </div>

            <span className="profile-arrow">›</span>
          </button>

          <button
            className="logout-button"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <span className="topbar-label">
              THERAPIST DASHBOARD
            </span>
          </div>

          <div className="topbar-actions">
            <div className="live-time">
              <span className="live-dot"></span>
              {formatTime(currentTime)}
            </div>

            <div className="top-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="welcome-row">
            <div>
              <span className="date-label">
                {formatDate(currentTime)}
              </span>

              <h1>
                {greeting}, {firstName}.
              </h1>

              <p>
                Here's what's happening with your practice today.
              </p>
            </div>

            <button
              type="button"
              className="primary-button dashboard-action"
              onClick={() => navigate("/sessions")}
            >
              + New session
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">◉</div>

              <div>
                <span>Active clients</span>
                <strong>24</strong>
                <small>+3 this month</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">◷</div>

              <div>
                <span>Today's sessions</span>
                <strong>5</strong>
                <small>2 completed</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">₹</div>

              <div>
                <span>This month's revenue</span>
                <strong>₹48,500</strong>
                <small>+12.4% from last month</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">◌</div>

              <div>
                <span>Pending requests</span>
                <strong>3</strong>
                <small>Needs attention</small>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <section className="panel schedule-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">TODAY</span>
                  <h2>Upcoming sessions</h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/schedule")}
                >
                  View schedule →
                </button>
              </div>

              <div className="session-list">
                <div className="session-item">
                  <div className="session-time">
                    <strong>10:00</strong>
                    <span>AM</span>
                  </div>

                  <div className="session-line"></div>

                  <div className="session-person">
                    <div className="session-avatar">RK</div>

                    <div>
                      <strong>Riya Kapoor</strong>
                      <span>Individual therapy</span>
                    </div>
                  </div>

                  <span className="session-status upcoming">
                    Upcoming
                  </span>
                </div>

                <div className="session-item">
                  <div className="session-time">
                    <strong>12:30</strong>
                    <span>PM</span>
                  </div>

                  <div className="session-line"></div>

                  <div className="session-person">
                    <div className="session-avatar">AS</div>

                    <div>
                      <strong>Arjun Shah</strong>
                      <span>Stress management</span>
                    </div>
                  </div>

                  <span className="session-status upcoming">
                    Upcoming
                  </span>
                </div>

                <div className="session-item">
                  <div className="session-time">
                    <strong>04:00</strong>
                    <span>PM</span>
                  </div>

                  <div className="session-line"></div>

                  <div className="session-person">
                    <div className="session-avatar">NP</div>

                    <div>
                      <strong>Neha Patel</strong>
                      <span>Anxiety support</span>
                    </div>
                  </div>

                  <span className="session-status pending">
                    Pending
                  </span>
                </div>
              </div>
            </section>

            <section className="panel activity-panel">
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">ACTIVITY</span>
                  <h2>Practice overview</h2>
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-number">86%</div>

                <div>
                  <strong>Client engagement</strong>

                  <p>
                    Your sessions and follow-ups are on track this
                    month.
                  </p>
                </div>
              </div>

              <div className="progress-bar">
                <span></span>
              </div>

              <div className="overview-row">
                <span>Completed sessions</span>
                <strong>42 / 50</strong>
              </div>

              <div className="overview-row">
                <span>Notes completed</span>
                <strong>38 / 42</strong>
              </div>

              <div className="overview-row">
                <span>Payments collected</span>
                <strong>₹48,500</strong>
              </div>
            </section>
          </div>

          <section className="quick-actions">
            <div>
              <span className="panel-eyebrow">QUICK ACTIONS</span>
              <h2>Manage your practice</h2>
            </div>

            <div className="quick-action-grid">
              <button
                type="button"
                onClick={() => navigate("/clients")}
              >
                <span>+</span>
                Add client
              </button>

              <button
                type="button"
                onClick={() => navigate("/schedule")}
              >
                <span>◷</span>
                Manage availability
              </button>

              <button
                type="button"
                onClick={() => navigate("/notes")}
              >
                <span>▤</span>
                Write a note
              </button>

              <button
                type="button"
                onClick={() => navigate("/packages")}
              >
                <span>₹</span>
                Create package
              </button>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}