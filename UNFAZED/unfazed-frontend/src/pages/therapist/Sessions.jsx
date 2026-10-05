
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function Sessions() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    clientId: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: 60,
    meetingType: "online",
    meetingLink: "",
    notes: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [sessionsResponse, clientsResponse] = await Promise.all([
        axiosInstance.get("/sessions"),
        axiosInstance.get("/clients"),
      ]);

      setSessions(sessionsResponse.data.sessions || []);
      setClients(clientsResponse.data.clients || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load sessions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateEndTime = (startTime, duration) => {
    if (!startTime) return "";

    const [hours, minutes] = startTime.split(":").map(Number);

    const totalMinutes = hours * 60 + minutes + Number(duration);

    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    if (endHours >= 24) {
      return "23:59";
    }

    return `${String(endHours).padStart(2, "0")}:${String(
      endMinutes
    ).padStart(2, "0")}`;
  };

  const handleDurationChange = (e) => {
    const duration = Number(e.target.value);

    setForm((prev) => ({
      ...prev,
      duration,
      endTime: calculateEndTime(prev.startTime, duration),
    }));
  };

  const handleStartTimeChange = (e) => {
    const startTime = e.target.value;

    setForm((prev) => ({
      ...prev,
      startTime,
      endTime: calculateEndTime(startTime, prev.duration),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.clientId) {
      setError("Please select a client.");
      return;
    }

    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    if (!form.startTime) {
      setError("Please select a start time.");
      return;
    }

    try {
      setSaving(true);

      const response = await axiosInstance.post("/sessions", {
        ...form,
        duration: Number(form.duration),
      });

      setSuccess(
        response.data.message || "Session booked successfully."
      );

      setForm({
        clientId: "",
        date: "",
        startTime: "",
        endTime: "",
        duration: 60,
        meetingType: "online",
        meetingLink: "",
        notes: "",
      });

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to book session."
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelSession = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this session?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await axiosInstance.patch(
        `/sessions/${id}/cancel`
      );

      setSuccess(
        response.data.message || "Session cancelled successfully."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to cancel session."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    if (status === "scheduled") return "status scheduled";
    if (status === "completed") return "status completed";
    if (status === "cancelled") return "status cancelled";
    if (status === "no-show") return "status noshow";

    return "status";
  };

  return (
    <div className="sessions-page">

      <button
        className="back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="page-header">
        <div>
          <p className="eyebrow">THERAPIST</p>
          <h1>Sessions</h1>
          <p className="page-subtitle">
            Book and manage client therapy sessions.
          </p>
        </div>
      </div>

      {error && <div className="message error">{error}</div>}

      {success && (
        <div className="message success">{success}</div>
      )}

      <div className="sessions-grid">
        <div className="booking-card">
          <div className="card-header">
            <h2>Book a Session</h2>
            <p>Create a new appointment for a client.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Client</label>

              <select
                name="clientId"
                value={form.clientId}
                onChange={handleChange}
              >
                <option value="">Select client</option>

                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Duration</label>

                <select
                  value={form.duration}
                  onChange={handleDurationChange}
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time</label>

                <input
                  type="time"
                  value={form.startTime}
                  onChange={handleStartTimeChange}
                />
              </div>

              <div className="form-group">
                <label>End Time</label>

                <input
                  type="time"
                  value={form.endTime}
                  readOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label>Meeting Type</label>

              <select
                name="meetingType"
                value={form.meetingType}
                onChange={handleChange}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            {form.meetingType === "online" && (
              <div className="form-group">
                <label>Meeting Link</label>

                <input
                  type="text"
                  name="meetingLink"
                  value={form.meetingLink}
                  onChange={handleChange}
                  placeholder="https://meet.google.com/..."
                />
              </div>
            )}

            <div className="form-group">
              <label>Notes</label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Optional session notes..."
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving ? "Booking..." : "Book Session"}
            </button>
          </form>
        </div>

        <div className="sessions-card">
          <div className="card-header">
            <h2>Upcoming & Past Sessions</h2>
            <p>{sessions.length} session(s) found.</p>
          </div>

          {loading ? (
            <div className="empty-state">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="empty-state">
              No sessions booked yet.
            </div>
          ) : (
            <div className="session-list">
              {sessions.map((session) => (
                <div
                  className="session-item"
                  key={session._id}
                >
                  <div className="session-main">
                    <div>
                      <h3>
                        {session.client?.name ||
                          "Unknown Client"}
                      </h3>

                      <p>
                        {formatDate(session.date)} •{" "}
                        {session.startTime} - {session.endTime}
                      </p>

                      <p>
                        {session.duration} minutes •{" "}
                        {session.meetingType}
                      </p>
                    </div>

                    <span
                      className={getStatusClass(
                        session.status
                      )}
                    >
                      {session.status}
                    </span>
                  </div>

                  {session.meetingLink && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="meeting-link"
                    >
                      Open Meeting
                    </a>
                  )}

                  {session.notes && (
                    <div className="session-notes">
                      <strong>Notes:</strong>{" "}
                      {session.notes}
                    </div>
                  )}

                  {session.status === "scheduled" && (
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() =>
                        cancelSession(session._id)
                      }
                    >
                      Cancel Session
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sessions-page {
          padding: 30px;
          min-height: 100vh;
          background: #f6f8fc;
        }

        .back-btn {
          border: none;
          background: transparent;
          color: #1f6feb;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          margin-bottom: 22px;
          transition: 0.2s ease;
        }

        .back-btn:hover {
          color: #1559bd;
          text-decoration: underline;
          transform: translateX(-2px);
        }

        .page-header {
          margin-bottom: 24px;
        }

        .eyebrow {
          margin: 0 0 6px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #667085;
        }

        .page-header h1 {
          margin: 0;
          font-size: 32px;
          color: #172033;
        }

        .page-subtitle {
          margin-top: 8px;
          color: #667085;
        }

        .message {
          padding: 13px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .message.error {
          background: #fff0f0;
          color: #c62828;
        }

        .message.success {
          background: #edf9f0;
          color: #237a3b;
        }

        .sessions-grid {
          display: grid;
          grid-template-columns: minmax(320px, 420px) 1fr;
          gap: 24px;
          align-items: start;
        }

        .booking-card,
        .sessions-card {
          background: white;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
          border: 1px solid #e8ecf3;
        }

        .card-header {
          margin-bottom: 22px;
        }

        .card-header h2 {
          margin: 0;
          color: #172033;
        }

        .card-header p {
          margin: 6px 0 0;
          color: #7a8497;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        label {
          display: block;
          margin-bottom: 7px;
          font-size: 14px;
          font-weight: 700;
          color: #344054;
        }

        input,
        select,
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d9deea;
          border-radius: 10px;
          padding: 11px 12px;
          font-size: 14px;
          outline: none;
          background: white;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #5b7cfa;
          box-shadow: 0 0 0 3px rgba(91, 124, 250, 0.1);
        }

        textarea {
          resize: vertical;
        }

        .primary-btn {
          width: 100%;
          border: none;
          border-radius: 11px;
          padding: 13px;
          background: #315efb;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .primary-btn:hover {
          background: #244bd4;
        }

        .primary-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .session-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .session-item {
          border: 1px solid #e5e9f1;
          border-radius: 14px;
          padding: 17px;
          background: #fbfcfe;
        }

        .session-main {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }

        .session-main h3 {
          margin: 0 0 6px;
          color: #172033;
        }

        .session-main p {
          margin: 4px 0;
          color: #687386;
          font-size: 14px;
        }

        .status {
          height: fit-content;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .status.scheduled {
          background: #eaf0ff;
          color: #315efb;
        }

        .status.completed {
          background: #eaf8ef;
          color: #238044;
        }

        .status.cancelled {
          background: #fff0f0;
          color: #c62828;
        }

        .status.noshow {
          background: #fff7e6;
          color: #a96800;
        }

        .meeting-link {
          display: inline-block;
          margin-top: 12px;
          color: #315efb;
          font-weight: 700;
          text-decoration: none;
        }

        .session-notes {
          margin-top: 12px;
          padding: 10px 12px;
          background: white;
          border-radius: 9px;
          color: #667085;
          font-size: 14px;
        }

        .cancel-btn {
          margin-top: 14px;
          border: 1px solid #f0b5b5;
          background: #fff5f5;
          color: #c62828;
          padding: 9px 13px;
          border-radius: 9px;
          font-weight: 700;
          cursor: pointer;
        }

        .cancel-btn:hover {
          background: #ffe9e9;
        }

        .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #7a8497;
        }

        @media (max-width: 900px) {
          .sessions-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .sessions-page {
            padding: 18px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .session-main {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default Sessions;

