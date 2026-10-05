import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    clientId: "",
    sessionId: "",
    title: "",
    content: "",
    visibility: "private",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        notesResponse,
        clientsResponse,
        sessionsResponse,
      ] = await Promise.all([
        axiosInstance.get("/notes"),
        axiosInstance.get("/clients"),
        axiosInstance.get("/sessions"),
      ]);

      setNotes(notesResponse.data.notes || []);
      setClients(clientsResponse.data.clients || []);
      setSessions(sessionsResponse.data.sessions || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load clinical notes."
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

  const resetForm = () => {
    setForm({
      clientId: "",
      sessionId: "",
      title: "",
      content: "",
      visibility: "private",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.clientId) {
      setError("Please select a client.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter a note title.");
      return;
    }

    if (!form.content.trim()) {
      setError("Please enter note content.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        sessionId: form.sessionId || "",
      };

      let response;

      if (editingId) {
        response = await axiosInstance.put(
          `/notes/${editingId}`,
          payload
        );
      } else {
        response = await axiosInstance.post(
          "/notes",
          payload
        );
      }

      setSuccess(
        response.data.message ||
          (editingId
            ? "Clinical note updated successfully."
            : "Clinical note created successfully.")
      );

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save clinical note."
      );
    } finally {
      setSaving(false);
    }
  };

  const editNote = (note) => {
    setEditingId(note._id);

    setForm({
      clientId: note.client?._id || note.client || "",
      sessionId: note.session?._id || note.session || "",
      title: note.title || "",
      content: note.content || "",
      visibility: note.visibility || "private",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteNote = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this clinical note?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await axiosInstance.delete(
        `/notes/${id}`
      );

      setSuccess(
        response.data.message ||
          "Clinical note deleted successfully."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete clinical note."
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

  const clientSessions = sessions.filter(
    (session) =>
      form.clientId &&
      (session.client?._id === form.clientId ||
        session.client === form.clientId)
  );

  return (
    <div className="notes-page">

      <button
        className="back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="page-header">
        <div>
          <p className="eyebrow">THERAPIST</p>
          <h1>Clinical Notes</h1>
          <p className="page-subtitle">
            Create and manage secure clinical notes for your clients.
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

      <div className="notes-layout">

        <div className="note-form-card">
          <div className="card-header">
            <h2>
              {editingId
                ? "Edit Clinical Note"
                : "Create Clinical Note"}
            </h2>

            <p>
              Keep important therapy information securely recorded.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Client</label>

              <select
                name="clientId"
                value={form.clientId}
                onChange={handleChange}
              >
                <option value="">
                  Select client
                </option>

                {clients.map((client) => (
                  <option
                    key={client._id}
                    value={client._id}
                  >
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Session</label>

              <select
                name="sessionId"
                value={form.sessionId}
                onChange={handleChange}
                disabled={!form.clientId}
              >
                <option value="">
                  No session selected
                </option>

                {clientSessions.map((session) => (
                  <option
                    key={session._id}
                    value={session._id}
                  >
                    {formatDate(session.date)} —{" "}
                    {session.startTime} -{" "}
                    {session.endTime}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Note Title</label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: Initial Assessment"
              />
            </div>

            <div className="form-group">
              <label>Clinical Note</label>

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your clinical observations, assessment, progress, or treatment notes..."
                rows="9"
              />
            </div>

            <div className="form-group">
              <label>Visibility</label>

              <select
                name="visibility"
                value={form.visibility}
                onChange={handleChange}
              >
                <option value="private">
                  Private — Therapist only
                </option>

                <option value="shared">
                  Shared — Can be shown to client
                </option>
              </select>
            </div>

            <div className="privacy-box">
              <span>🔒</span>

              <div>
                <strong>
                  Clinical privacy
                </strong>

                <p>
                  Private notes are restricted to the therapist.
                </p>
              </div>
            </div>

            <div className="form-actions">

              <button
                type="submit"
                className="primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Note"
                  : "Save Clinical Note"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}

            </div>
          </form>
        </div>

        <div className="notes-card">

          <div className="card-header notes-header">
            <div>
              <h2>Saved Clinical Notes</h2>

              <p>
                {notes.length} note(s) found.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              Loading clinical notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>

              <h3>No clinical notes yet</h3>

              <p>
                Create your first clinical note using the form.
              </p>
            </div>
          ) : (
            <div className="note-list">

              {notes.map((note) => (
                <div
                  className="note-item"
                  key={note._id}
                >
                  <div className="note-top">

                    <div>
                      <h3>{note.title}</h3>

                      <p className="client-name">
                        {note.client?.name ||
                          "Unknown Client"}
                      </p>
                    </div>

                    <span
                      className={
                        note.visibility === "private"
                          ? "visibility private"
                          : "visibility shared"
                      }
                    >
                      {note.visibility === "private"
                        ? "🔒 Private"
                        : "👤 Shared"}
                    </span>

                  </div>

                  <div className="note-content">
                    {note.content}
                  </div>

                  <div className="note-meta">

                    <span>
                      Created{" "}
                      {formatDate(note.createdAt)}
                    </span>

                    {note.session && (
                      <span>
                        Session:{" "}
                        {formatDate(note.session.date)}
                      </span>
                    )}

                  </div>

                  <div className="note-actions">

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => editNote(note)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                        deleteNote(note._id)
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

      <style>{`
        .notes-page {
          min-height: 100vh;
          padding: 30px;
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
          margin: 8px 0 0;
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

        .notes-layout {
          display: grid;
          grid-template-columns: minmax(320px, 430px) 1fr;
          gap: 24px;
          align-items: start;
        }

        .note-form-card,
        .notes-card {
          background: white;
          border-radius: 18px;
          padding: 24px;
          border: 1px solid #e8ecf3;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
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
          margin-bottom: 17px;
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
          color: #172033;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #5b7cfa;
          box-shadow: 0 0 0 3px rgba(91, 124, 250, 0.1);
        }

        select:disabled {
          background: #f2f4f7;
          cursor: not-allowed;
        }

        textarea {
          resize: vertical;
          line-height: 1.6;
        }

        .privacy-box {
          display: flex;
          gap: 10px;
          padding: 13px;
          margin-bottom: 18px;
          background: #f7f9fc;
          border: 1px solid #e6eaf1;
          border-radius: 11px;
        }

        .privacy-box span {
          font-size: 18px;
        }

        .privacy-box strong {
          color: #344054;
          font-size: 13px;
        }

        .privacy-box p {
          margin: 3px 0 0;
          color: #7a8497;
          font-size: 12px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
        }

        .primary-btn,
        .secondary-btn {
          border: none;
          border-radius: 10px;
          padding: 12px 16px;
          font-weight: 800;
          cursor: pointer;
        }

        .primary-btn {
          flex: 1;
          background: #315efb;
          color: white;
        }

        .primary-btn:hover {
          background: #244bd4;
        }

        .primary-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .secondary-btn {
          background: #eef1f6;
          color: #344054;
        }

        .notes-header {
          display: flex;
          justify-content: space-between;
        }

        .note-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .note-item {
          border: 1px solid #e5e9f1;
          border-radius: 14px;
          padding: 18px;
          background: #fbfcfe;
        }

        .note-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
        }

        .note-top h3 {
          margin: 0;
          color: #172033;
          font-size: 18px;
        }

        .client-name {
          margin: 5px 0 0;
          color: #315efb;
          font-size: 14px;
          font-weight: 700;
        }

        .visibility {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .visibility.private {
          background: #fff1f1;
          color: #c62828;
        }

        .visibility.shared {
          background: #edf8f1;
          color: #237a3b;
        }

        .note-content {
          margin-top: 15px;
          padding: 13px;
          background: white;
          border-radius: 10px;
          color: #4f5b6e;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .note-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 12px;
          color: #7a8497;
          font-size: 12px;
        }

        .note-actions {
          display: flex;
          gap: 8px;
          margin-top: 15px;
        }

        .edit-btn,
        .delete-btn {
          border: none;
          border-radius: 8px;
          padding: 8px 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .edit-btn {
          background: #eaf0ff;
          color: #315efb;
        }

        .edit-btn:hover {
          background: #dce6ff;
        }

        .delete-btn {
          background: #fff0f0;
          color: #c62828;
        }

        .delete-btn:hover {
          background: #ffe2e2;
        }

        .empty-state {
          padding: 55px 20px;
          text-align: center;
          color: #7a8497;
        }

        .empty-icon {
          font-size: 38px;
          margin-bottom: 10px;
        }

        .empty-state h3 {
          margin: 0 0 5px;
          color: #344054;
        }

        .empty-state p {
          margin: 0;
        }

        @media (max-width: 950px) {
          .notes-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .notes-page {
            padding: 18px;
          }

          .note-top {
            flex-direction: column;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default Notes;