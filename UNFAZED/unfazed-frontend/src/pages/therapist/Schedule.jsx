
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function Schedule() {
  const navigate = useNavigate();

  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    type: "weekly",
    dayOfWeek: "1",
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    sessionDuration: "60",
    timezone: "Asia/Kolkata",
    note: "",
  });

  const days = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
  ];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/availability");

      if (response.data.success) {
        setAvailability(response.data.availability);
      }
    } catch (err) {
      console.error("Fetch availability error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load availability."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      type: "weekly",
      dayOfWeek: "1",
      date: "",
      startTime: "09:00",
      endTime: "17:00",
      sessionDuration: "60",
      timezone: "Asia/Kolkata",
      note: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.date && form.type !== "weekly") {
      setError("Please select a date.");
      return;
    }

    if (form.startTime >= form.endTime) {
      setError("End time must be after start time.");
      return;
    }

    try {
      setSaving(true);

      const data = {
        type: form.type,
        dayOfWeek:
          form.type === "weekly"
            ? Number(form.dayOfWeek)
            : undefined,
        date:
          form.type !== "weekly"
            ? form.date
            : undefined,
        startTime: form.startTime,
        endTime: form.endTime,
        sessionDuration: Number(form.sessionDuration),
        timezone: form.timezone,
        isAvailable: form.type !== "blocked",
        note: form.note,
      };

      let response;

      if (editingId) {
        response = await axiosInstance.put(
          `/availability/${editingId}`,
          data
        );
      } else {
        response = await axiosInstance.post(
          "/availability",
          data
        );
      }

      if (response.data.success) {
        if (editingId) {
          setAvailability((previous) =>
            previous.map((item) =>
              item._id === editingId
                ? response.data.availability
                : item
            )
          );

          setSuccess(
            "Availability updated successfully."
          );
        } else {
          setAvailability((previous) => [
            ...previous,
            response.data.availability,
          ]);

          setSuccess(
            form.type === "blocked"
              ? "Date blocked successfully."
              : form.type === "override"
              ? "One-time availability added successfully."
              : "Weekly availability added successfully."
          );
        }

        resetForm();
      }
    } catch (err) {
      console.error("Save availability error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save availability."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setError("");
    setSuccess("");

    setEditingId(item._id);

    let formattedDate = "";

    if (item.date) {
      formattedDate = new Date(item.date)
        .toISOString()
        .split("T")[0];
    }

    setForm({
      type: item.type || "weekly",
      dayOfWeek: String(item.dayOfWeek ?? "1"),
      date: formattedDate,
      startTime: item.startTime || "09:00",
      endTime: item.endTime || "17:00",
      sessionDuration: String(
        item.sessionDuration || "60"
      ),
      timezone: item.timezone || "Asia/Kolkata",
      note: item.note || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this availability?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await axiosInstance.delete(
        `/availability/${id}`
      );

      if (response.data.success) {
        setAvailability((previous) =>
          previous.filter((item) => item._id !== id)
        );

        if (editingId === id) {
          resetForm();
        }

        setSuccess(
          "Availability deleted successfully."
        );
      }
    } catch (err) {
      console.error("Delete availability error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete availability."
      );
    }
  };

  const getDayName = (dayNumber) => {
    const day = days.find(
      (item) => Number(item.value) === Number(dayNumber)
    );

    return day ? day.label : "Unknown";
  };

  const getTypeLabel = (type) => {
    if (type === "weekly") return "Weekly";
    if (type === "override") return "One-time";
    if (type === "blocked") return "Blocked";
    return type;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="schedule-page">
      <div className="schedule-container">

        {/* BACK TO DASHBOARD */}
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="page-header">
          <div>
            <p className="page-label">
              THERAPIST SCHEDULE
            </p>

            <h1>Availability</h1>

            <p>
              Set your working hours so clients know when
              they can book sessions.
            </p>
          </div>
        </div>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {success && (
          <div className="message success">
            {success}
          </div>
        )}

        <div className="schedule-grid">
          <div className="schedule-card">
            <div className="card-header">
              <h2>
                {editingId
                  ? "Edit Availability"
                  : "Add Availability"}
              </h2>

              <span>
                {editingId ? "Editing" : "Schedule"}
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Availability Type</label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  disabled={Boolean(editingId)}
                >
                  <option value="weekly">
                    Weekly Schedule
                  </option>

                  <option value="override">
                    One-Time Availability
                  </option>

                  <option value="blocked">
                    Block a Date
                  </option>
                </select>
              </div>

              {form.type === "weekly" ? (
                <div className="form-group">
                  <label>Day</label>

                  <select
                    name="dayOfWeek"
                    value={form.dayOfWeek}
                    onChange={handleChange}
                  >
                    {days.map((day) => (
                      <option
                        key={day.value}
                        value={day.value}
                      >
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label>
                    {form.type === "blocked"
                      ? "Date to Block"
                      : "Override Date"}
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="time-grid">
                <div className="form-group">
                  <label>Start Time</label>

                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>End Time</label>

                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Session Duration</label>

                <select
                  name="sessionDuration"
                  value={form.sessionDuration}
                  onChange={handleChange}
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
                <label>Timezone</label>

                <select
                  name="timezone"
                  value={form.timezone}
                  onChange={handleChange}
                >
                  <option value="Asia/Kolkata">
                    India Standard Time (IST)
                  </option>

                  <option value="Asia/Dubai">
                    Gulf Standard Time (GST)
                  </option>

                  <option value="Asia/Singapore">
                    Singapore Time (SGT)
                  </option>

                  <option value="Europe/London">
                    London Time
                  </option>

                  <option value="America/New_York">
                    Eastern Time (ET)
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Note</label>

                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder={
                    form.type === "blocked"
                      ? "Example: Personal leave"
                      : "Optional note"
                  }
                  rows="3"
                />
              </div>

              <div className="form-buttons">
                <button
                  type="submit"
                  className="add-btn"
                  disabled={saving}
                >
                  {saving
                    ? editingId
                      ? "Updating..."
                      : "Saving..."
                    : editingId
                    ? "✓ Update Availability"
                    : form.type === "blocked"
                    ? "🚫 Block Date"
                    : form.type === "override"
                    ? "＋ Add One-Time Slot"
                    : "＋ Add Weekly Availability"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="schedule-card">
            <div className="card-header">
              <h2>Your Availability</h2>

              <span>
                {availability.length} entries
              </span>
            </div>

            {loading ? (
              <div className="empty-state">
                Loading availability...
              </div>
            ) : availability.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  📅
                </div>

                <h3>No availability added</h3>

                <p>
                  Add your working hours using the form.
                </p>
              </div>
            ) : (
              <div className="availability-list">
                {availability.map((item) => (
                  <div
                    className={`availability-item ${
                      item.type === "blocked"
                        ? "blocked-item"
                        : ""
                    } ${
                      editingId === item._id
                        ? "editing-item"
                        : ""
                    }`}
                    key={item._id}
                  >
                    <div className="availability-main">
                      <div
                        className={`day-icon ${
                          item.type === "blocked"
                            ? "blocked-icon"
                            : ""
                        }`}
                      >
                        {item.type === "blocked"
                          ? "!"
                          : item.type === "override"
                          ? "★"
                          : getDayName(
                              item.dayOfWeek
                            ).charAt(0)}
                      </div>

                      <div>
                        <div className="item-title-row">
                          <h3>
                            {item.type === "weekly"
                              ? getDayName(
                                  item.dayOfWeek
                                )
                              : formatDate(item.date)}
                          </h3>

                          <span
                            className={`type-badge ${item.type}`}
                          >
                            {getTypeLabel(item.type)}
                          </span>
                        </div>

                        {item.type === "blocked" ? (
                          <p className="blocked-text">
                            Unavailable
                          </p>
                        ) : (
                          <p>
                            {item.startTime} –{" "}
                            {item.endTime}
                          </p>
                        )}

                        {item.note && (
                          <small className="item-note">
                            {item.note}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="availability-info">
                      {item.type !== "blocked" && (
                        <span>
                          {item.sessionDuration} min
                        </span>
                      )}

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(item)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(item._id)
                        }
                      >
                        Delete
                      </button>
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
.schedule-page {
  min-height: 100vh;
  background: #f6f8fc;
  padding: 35px;
  font-family: Arial, sans-serif;
  color: #172033;
}

.schedule-container {
  max-width: 1150px;
  margin: 0 auto;
}

/* BACK TO DASHBOARD */
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
  margin-bottom: 25px;
}

.page-label {
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

.page-header p:last-child {
  color: #718096;
  margin-top: 8px;
}

.message {
  padding: 13px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 14px;
}

.message.error {
  background: #fff1f2;
  color: #be123c;
  border: 1px solid #fecdd3;
}

.message.success {
  background: #ecfdf3;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.schedule-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 22px;
}

.schedule-card {
  background: white;
  border: 1px solid #e6eaf0;
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(25, 45, 80, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 25px;
}

.card-header h2 {
  margin: 0;
  font-size: 19px;
}

.card-header span {
  background: #eaf2ff;
  color: #1f6feb;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
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
  background: white;
  outline: none;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #1f6feb;
  box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.1);
}

.form-group select:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.time-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-buttons {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.add-btn {
  width: 100%;
  border: none;
  border-radius: 11px;
  padding: 13px;
  background: #1f6feb;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.add-btn:hover {
  background: #1559bd;
  transform: translateY(-1px);
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.cancel-btn {
  width: 100%;
  border: 1px solid #d8dee8;
  border-radius: 11px;
  padding: 12px;
  background: white;
  color: #475569;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #f8fafc;
}

.availability-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.availability-item {
  border: 1px solid #e7ebf0;
  border-radius: 14px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  transition: 0.2s ease;
}

.availability-item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 5px 15px rgba(25, 45, 80, 0.05);
}

.editing-item {
  border-color: #1f6feb;
  background: #f8fbff;
}

.blocked-item {
  background: #fffafa;
  border-color: #fecaca;
}

.availability-main {
  display: flex;
  align-items: center;
  gap: 13px;
}

.day-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #eaf2ff;
  color: #1f6feb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.blocked-icon {
  background: #fee2e2;
  color: #dc2626;
}

.availability-main h3 {
  margin: 0;
  font-size: 15px;
}

.item-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.availability-main p {
  margin: 0;
  color: #718096;
  font-size: 13px;
}

.blocked-text {
  color: #dc2626 !important;
  font-weight: 700;
}

.item-note {
  display: block;
  margin-top: 5px;
  color: #64748b;
  font-size: 12px;
}

.type-badge {
  padding: 4px 7px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}

.type-badge.weekly {
  background: #eaf2ff;
  color: #1d4ed8;
}

.type-badge.override {
  background: #fef3c7;
  color: #a16207;
}

.type-badge.blocked {
  background: #fee2e2;
  color: #dc2626;
}

.availability-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.availability-info > span {
  background: #f1f5f9;
  color: #475569;
  padding: 6px 9px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.edit-btn {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.edit-btn:hover {
  background: #dbeafe;
}

.delete-btn {
  border: 1px solid #fecdd3;
  background: #fff1f2;
  color: #dc2626;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.delete-btn:hover {
  background: #ffe4e6;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.empty-icon {
  font-size: 38px;
  margin-bottom: 12px;
}

.empty-state h3 {
  color: #334155;
  margin: 0 0 7px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

@media (max-width: 850px) {
  .schedule-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 550px) {
  .schedule-page {
    padding: 20px 15px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .schedule-card {
    padding: 19px;
  }

  .time-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .availability-item {
    align-items: flex-start;
    flex-direction: column;
  }

  .availability-info {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .item-title-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }
}
`;

export default Schedule;

