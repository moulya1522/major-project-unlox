import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function ClientBooking() {
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    duration: "60",
    type: "Online",
    notes: "",
  });

  useEffect(() => {
    loadClientData();
  }, []);

  const getClientToken = () => {
    return localStorage.getItem("clientToken");
  };

  const clientRequestConfig = () => {
    const token = getClientToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const loadClientData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getClientToken();

      if (!token) {
        navigate("/client-login");
        return;
      }

      const profileResponse = await axiosInstance.get(
        "/clients/portal/me",
        clientRequestConfig()
      );

      if (profileResponse.data.success) {
        setClient(profileResponse.data.client);
      }

      const sessionsResponse = await axiosInstance.get(
        "/sessions/client/my-sessions",
        clientRequestConfig()
      );

      if (sessionsResponse.data.success) {
        setSessions(sessionsResponse.data.sessions || []);
      }
    } catch (err) {
      console.error("Client booking load error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("clientToken");
        localStorage.removeItem("clientData");
        navigate("/client-login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load booking page."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleStartTimeChange = (e) => {
    const startTime = e.target.value;

    let endTime = "";

    if (startTime) {
      const [hours, minutes] = startTime
        .split(":")
        .map(Number);

      const duration = Number(form.duration) || 60;

      const date = new Date();

      date.setHours(hours);
      date.setMinutes(minutes + duration);

      const endHours = String(date.getHours()).padStart(
        2,
        "0"
      );

      const endMinutes = String(
        date.getMinutes()
      ).padStart(2, "0");

      endTime = `${endHours}:${endMinutes}`;
    }

    setForm((previous) => ({
      ...previous,
      startTime,
      endTime,
    }));
  };

  const handleDurationChange = (e) => {
    const duration = e.target.value;

    let endTime = form.endTime;

    if (form.startTime) {
      const [hours, minutes] = form.startTime
        .split(":")
        .map(Number);

      const date = new Date();

      date.setHours(hours);
      date.setMinutes(minutes + Number(duration));

      const endHours = String(date.getHours()).padStart(
        2,
        "0"
      );

      const endMinutes = String(
        date.getMinutes()
      ).padStart(2, "0");

      endTime = `${endHours}:${endMinutes}`;
    }

    setForm((previous) => ({
      ...previous,
      duration,
      endTime,
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    if (!form.startTime) {
      setError("Please select a start time.");
      return;
    }

    if (!form.endTime) {
      setError("Please select an end time.");
      return;
    }

    try {
      setBooking(true);

      const token = getClientToken();

      if (!token) {
        navigate("/client-login");
        return;
      }

      const response = await axiosInstance.post(
        "/sessions/client/book",
        {
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          duration: Number(form.duration),
          type: form.type,
          notes: form.notes,
        },
        clientRequestConfig()
      );

      if (response.data.success) {
        setSuccess(
          "Session booked successfully!"
        );

        setForm({
          date: "",
          startTime: "",
          endTime: "",
          duration: "60",
          type: "Online",
          notes: "",
        });

        await loadClientSessions();
      }
    } catch (err) {
      console.error("Book session error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to book session."
      );
    } finally {
      setBooking(false);
    }
  };

  const loadClientSessions = async () => {
    try {
      const token = getClientToken();

      if (!token) {
        navigate("/client-login");
        return;
      }

      const response = await axiosInstance.get(
        "/sessions/client/my-sessions",
        clientRequestConfig()
      );

      if (response.data.success) {
        setSessions(response.data.sessions || []);
      }
    } catch (err) {
      console.error(
        "Load client sessions error:",
        err
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientData");

    navigate("/client-login");
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="loading">
          Loading booking page...
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">

        <div className="top-bar">
          <button
            className="back-btn"
            onClick={() => navigate("/client-portal")}
          >
            ← Back to Portal
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="page-header">
          <div>
            <p className="label">
              CLIENT PORTAL
            </p>

            <h1>Book a Session</h1>

            <p className="subtitle">
              Choose a convenient date and time for
              your therapy session.
            </p>
          </div>
        </div>

        {client && (
          <div className="client-banner">
            <div className="avatar">
              {client.name?.charAt(0)?.toUpperCase() ||
                "C"}
            </div>

            <div>
              <strong>{client.name}</strong>
              <span>{client.email}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {success && (
          <div className="success-box">
            {success}
          </div>
        )}

        <div className="content-grid">

          <div className="booking-card">
            <div className="card-heading">
              <h2>Session Details</h2>
              <p>
                Select your preferred session timing.
              </p>
            </div>

            <form onSubmit={handleBooking}>

              <div className="form-grid">

                <div className="form-group">
                  <label>Date</label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Session Type</label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="Online">
                      Online
                    </option>

                    <option value="In-Person">
                      In-Person
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Start Time</label>

                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleStartTimeChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Duration</label>

                  <select
                    name="duration"
                    value={form.duration}
                    onChange={handleDurationChange}
                  >
                    <option value="30">
                      30 minutes
                    </option>

                    <option value="45">
                      45 minutes
                    </option>

                    <option value="60">
                      60 minutes
                    </option>

                    <option value="90">
                      90 minutes
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>End Time</label>

                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    readOnly
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes</label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Anything you would like your therapist to know..."
                  rows="5"
                />
              </div>

              <button
                type="submit"
                className="book-btn"
                disabled={booking}
              >
                {booking
                  ? "Booking Session..."
                  : "Book Session"}
              </button>
            </form>
          </div>

          <div className="sessions-card">
            <div className="card-heading">
              <h2>My Sessions</h2>

              <p>
                Your recently booked sessions.
              </p>
            </div>

            {sessions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  📅
                </div>

                <h3>No sessions yet</h3>

                <p>
                  Your booked sessions will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="sessions-list">
                {sessions.map((session) => (
                  <div
                    className="session-item"
                    key={session._id}
                  >
                    <div className="session-date">
                      <span>
                        {session.date
                          ? new Date(
                              session.date
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                              }
                            )
                          : "--"}
                      </span>

                      <small>
                        {session.date
                          ? new Date(
                              session.date
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                month: "short",
                              }
                            )
                          : ""}
                      </small>
                    </div>

                    <div className="session-info">
                      <strong>
                        {session.startTime ||
                          "Time not set"}
                      </strong>

                      <span>
                        {session.type ||
                          "Session"}
                      </span>

                      <small>
                        {session.status ||
                          "scheduled"}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
.booking-page {
  min-height: 100vh;
  background: #f6f8fc;
  padding: 30px;
  font-family: Arial, sans-serif;
  color: #172033;
}

.booking-container {
  max-width: 1150px;
  margin: 0 auto;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.back-btn,
.logout-btn {
  border: none;
  cursor: pointer;
  font-weight: 700;
  border-radius: 10px;
  padding: 10px 15px;
}

.back-btn {
  background: transparent;
  color: #1f6feb;
}

.back-btn:hover {
  text-decoration: underline;
}

.logout-btn {
  background: #fff1f2;
  color: #dc2626;
  border: 1px solid #fecdd3;
}

.logout-btn:hover {
  background: #ffe4e6;
}

.page-header {
  margin-bottom: 20px;
}

.label {
  color: #1f6feb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin: 0 0 8px;
}

.page-header h1 {
  margin: 0;
  font-size: 34px;
}

.subtitle {
  color: #718096;
  margin: 8px 0 0;
  line-height: 1.6;
}

.client-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  background: white;
  border: 1px solid #e5e9f0;
  border-radius: 16px;
  padding: 15px 18px;
  margin-bottom: 20px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #eaf2ff;
  color: #1f6feb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 20px;
}

.client-banner strong {
  display: block;
  margin-bottom: 4px;
}

.client-banner span {
  color: #718096;
  font-size: 13px;
}

.error-box {
  background: #fff1f2;
  color: #be123c;
  border: 1px solid #fecdd3;
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.success-box {
  background: #ecfdf3;
  color: #15803d;
  border: 1px solid #bbf7d0;
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 22px;
}

.booking-card,
.sessions-card {
  background: white;
  border: 1px solid #e5e9f0;
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(25, 45, 80, 0.05);
}

.card-heading {
  margin-bottom: 25px;
}

.card-heading h2 {
  margin: 0 0 6px;
  font-size: 20px;
}

.card-heading p {
  margin: 0;
  color: #718096;
  font-size: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.form-group label {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d8dee8;
  border-radius: 10px;
  padding: 12px 13px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  background: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #1f6feb;
  box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.book-btn {
  width: 100%;
  border: none;
  background: #1f6feb;
  color: white;
  padding: 14px;
  border-radius: 11px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 5px;
}

.book-btn:hover {
  background: #1559bd;
}

.book-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 45px 15px;
  color: #718096;
}

.empty-icon {
  font-size: 35px;
  margin-bottom: 12px;
}

.empty-state h3 {
  color: #334155;
  margin: 0 0 6px;
}

.empty-state p {
  margin: 0;
  font-size: 13px;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 13px;
  border: 1px solid #edf0f4;
  border-radius: 13px;
  padding: 12px;
}

.session-date {
  width: 48px;
  min-width: 48px;
  height: 52px;
  border-radius: 11px;
  background: #eaf2ff;
  color: #1f6feb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.session-date span {
  font-size: 18px;
  font-weight: 800;
}

.session-date small {
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 700;
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.session-info strong {
  font-size: 14px;
}

.session-info span {
  font-size: 12px;
  color: #64748b;
}

.session-info small {
  font-size: 11px;
  color: #1f6feb;
  text-transform: capitalize;
}

.loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

@media (max-width: 850px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .booking-page {
    padding: 18px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .booking-card,
  .sessions-card {
    padding: 20px;
  }
}
`;

export default ClientBooking;