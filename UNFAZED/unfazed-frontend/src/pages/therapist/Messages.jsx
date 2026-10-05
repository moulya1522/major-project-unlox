import { useNavigate } from "react-router-dom";

export default function Messages() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <span className="topbar-label">MESSAGES</span>
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
              <span className="date-label">COMMUNICATION</span>

              <h1>Messages</h1>

              <p>
                Manage communication with your clients.
              </p>
            </div>
          </div>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <span className="panel-eyebrow">CLIENT MESSAGES</span>
                <h2>Recent conversations</h2>
              </div>
            </div>

            <div className="session-list">
              <button
                className="session-item"
                onClick={() => navigate("/clients")}
              >
                <div className="session-person">
                  <div className="session-avatar">RK</div>

                  <div>
                    <strong>Riya Kapoor</strong>
                    <span>Recent client conversation</span>
                  </div>
                </div>

                <span className="session-status upcoming">
                  Open
                </span>
              </button>

              <button
                className="session-item"
                onClick={() => navigate("/clients")}
              >
                <div className="session-person">
                  <div className="session-avatar">AS</div>

                  <div>
                    <strong>Arjun Shah</strong>
                    <span>Recent client conversation</span>
                  </div>
                </div>

                <span className="session-status upcoming">
                  Open
                </span>
              </button>

              <button
                className="session-item"
                onClick={() => navigate("/clients")}
              >
                <div className="session-person">
                  <div className="session-avatar">NP</div>

                  <div>
                    <strong>Neha Patel</strong>
                    <span>Recent client conversation</span>
                  </div>
                </div>

                <span className="session-status pending">
                  Pending
                </span>
              </button>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}