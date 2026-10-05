import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function Clients() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    concern: "",
    intakeSummary: "",
    consentGiven: false,
  });

  const fetchClients = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/clients", {
        params: searchValue ? { search: searchValue } : {},
      });

      setClients(response.data.clients || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to load clients. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClients(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Client name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await axiosInstance.post("/clients", form);

      setForm({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        concern: "",
        intakeSummary: "",
        consentGiven: false,
      });

      setShowForm(false);
      await fetchClients(search);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to create client. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "CL";

    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="clients-page">
      <style>{`
        .clients-page {
          min-height: 100vh;
          background: #f6f8fb;
          padding: 32px;
          color: #172033;
        }

        .clients-container {
          max-width: 1250px;
          margin: 0 auto;
        }

        .clients-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 28px;
        }

        .clients-title {
          margin: 0;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        .clients-subtitle {
          margin: 7px 0 0;
          color: #778196;
          font-size: 14px;
        }

        .add-client-btn {
          border: none;
          background: #1f6feb;
          color: white;
          padding: 13px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(31, 111, 235, 0.18);
          transition: 0.2s ease;
        }

        .add-client-btn:hover {
          transform: translateY(-2px);
          background: #175dcc;
        }

        .clients-toolbar {
          background: white;
          border: 1px solid #e7ebf2;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          box-shadow: 0 6px 20px rgba(28, 39, 60, 0.04);
        }

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #8b95a7;
          font-size: 17px;
        }

        .search-input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #e0e5ed;
          border-radius: 11px;
          padding: 13px 16px 13px 45px;
          font-size: 14px;
          outline: none;
          transition: 0.2s;
        }

        .search-input:focus {
          border-color: #1f6feb;
          box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.08);
        }

        .clients-card {
          background: white;
          border: 1px solid #e7ebf2;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(28, 39, 60, 0.05);
        }

        .clients-card-header {
          padding: 20px 22px;
          border-bottom: 1px solid #edf0f5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .clients-card-title {
          font-size: 17px;
          font-weight: 750;
        }

        .client-count {
          color: #7b8495;
          font-size: 13px;
        }

        .client-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1.2fr 1fr 1fr;
          align-items: center;
          gap: 15px;
          padding: 18px 22px;
          border-bottom: 1px solid #f0f2f6;
        }

        .client-row:last-child {
          border-bottom: none;
        }

        .client-row-clickable {
         cursor: pointer;
         transition: 0.2s ease;
        }
         
        .client-row-clickable:hover {
        background: #f5f9ff;
        transform: translateX(2px);
        }

        .table-heading {
          background: #fafbfc;
          color: #8a93a4;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.7px;
        }

        .client-info {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .client-avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #eaf2ff;
          color: #1f6feb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .client-name {
          font-size: 14px;
          font-weight: 750;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .client-email {
          margin-top: 3px;
          font-size: 12px;
          color: #8992a2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .client-text {
          color: #5f697b;
          font-size: 13px;
        }

        .status {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 750;
          text-transform: capitalize;
        }

        .status-active {
          background: #eaf8f0;
          color: #16834a;
        }

        .status-inactive {
          background: #f1f3f6;
          color: #737d8c;
        }

        .consent-yes {
          color: #16834a;
          font-weight: 700;
          font-size: 12px;
        }

        .consent-no {
          color: #c77b13;
          font-weight: 700;
          font-size: 12px;
        }

        .empty-state {
          text-align: center;
          padding: 65px 20px;
        }

        .empty-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 15px;
          border-radius: 18px;
          background: #eef4ff;
          color: #1f6feb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
        }

        .empty-title {
          font-size: 17px;
          font-weight: 750;
          margin-bottom: 6px;
        }

        .empty-text {
          color: #8a93a4;
          font-size: 13px;
        }

        .error-message {
          background: #fff1f1;
          border: 1px solid #ffd5d5;
          color: #c53939;
          border-radius: 12px;
          padding: 12px 15px;
          margin-bottom: 18px;
          font-size: 13px;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.48);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .modal {
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 80px rgba(15, 23, 42, 0.2);
        }

        .modal-header {
          padding: 22px 24px;
          border-bottom: 1px solid #edf0f5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
        }

        .close-btn {
          width: 35px;
          height: 35px;
          border: none;
          background: #f3f5f8;
          border-radius: 10px;
          cursor: pointer;
          font-size: 18px;
          color: #667085;
        }

        .form {
          padding: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 17px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 12px;
          font-weight: 750;
          color: #4e586a;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dfe4ec;
          border-radius: 10px;
          padding: 11px 12px;
          font-size: 13px;
          outline: none;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          border-color: #1f6feb;
          box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.08);
        }

        .form-textarea {
          min-height: 85px;
          resize: vertical;
        }

        .consent-box {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 13px;
          background: #f8fafc;
          border-radius: 10px;
          font-size: 13px;
          color: #596477;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
        }

        .cancel-btn,
        .save-btn {
          border: none;
          border-radius: 10px;
          padding: 11px 18px;
          font-weight: 700;
          cursor: pointer;
        }

        .cancel-btn {
          background: #f1f3f6;
          color: #596477;
        }

        .save-btn {
          background: #1f6feb;
          color: white;
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .back-btn {
          border: none;
          background: transparent;
          color: #6f7888;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 15px;
          padding: 0;
        }

        @media (max-width: 850px) {
          .clients-page {
            padding: 20px;
          }

          .client-row {
            grid-template-columns: 1fr 1fr;
          }

          .table-heading {
            display: none;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full,
          .consent-box {
            grid-column: auto;
          }
        }

        @media (max-width: 600px) {
          .clients-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .add-client-btn {
            width: 100%;
          }

          .client-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>

      <div className="clients-container">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

        <div className="clients-top">
          <div>
            <h1 className="clients-title">Clients</h1>
            <p className="clients-subtitle">
              Manage your clients, intake information and consent records.
            </p>
          </div>

          <button
            className="add-client-btn"
            onClick={() => {
              setError("");
              setShowForm(true);
            }}
          >
            + Add Client
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="clients-toolbar">
          <div className="search-wrapper">
            <span className="search-icon">⌕</span>

            <input
              className="search-input"
              type="text"
              placeholder="Search by client name, email or phone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="clients-card">
          <div className="clients-card-header">
            <span className="clients-card-title">All Clients</span>

            <span className="client-count">
              {clients.length} {clients.length === 1 ? "client" : "clients"}
            </span>
          </div>

          <div className="client-row table-heading">
            <div>Client</div>
            <div>Phone</div>
            <div>Added</div>
            <div>Status</div>
            <div>Consent</div>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="empty-icon">⟳</div>
              <div className="empty-title">Loading clients...</div>
              <div className="empty-text">
                Getting your client information.
              </div>
            </div>
          ) : clients.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>

              <div className="empty-title">
                {search ? "No clients found" : "No clients yet"}
              </div>

              <div className="empty-text">
                {search
                  ? "Try searching with a different name, email or phone."
                  : "Add your first client to start managing your practice."}
              </div>
            </div>
          ) : (
            clients.map((client) => (
              <div  className="client-row client-row-clickable" key={client._id} onClick={() => navigate(`/clients/${client._id}`)}>
                <div className="client-info">
                  <div className="client-avatar">
                    {getInitials(client.name)}
                  </div>

                  <div>
                    <div className="client-name">{client.name}</div>

                    <div className="client-email">
                      {client.email || "No email added"}
                    </div>
                  </div>
                </div>

                <div className="client-text">
                  {client.phone || "—"}
                </div>

                <div className="client-text">
                  {formatDate(client.createdAt)}
                </div>

                <div>
                  <span
                    className={`status ${
                      client.status === "active"
                        ? "status-active"
                        : "status-inactive"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>

                <div>
                  {client.consentGiven ? (
                    <span className="consent-yes">✓ Given</span>
                  ) : (
                    <span className="consent-no">Not given</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Add New Client</h2>

              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>

                  <input
                    className="form-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>

                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="client@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>

                  <input
                    className="form-input"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Birth</label>

                  <input
                    className="form-input"
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>

                  <select
                    className="form-select"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">
                      Prefer not to say
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Concern</label>

                  <input
                    className="form-input"
                    name="concern"
                    value={form.concern}
                    onChange={handleChange}
                    placeholder="e.g. Stress management"
                  />
                </div>

                <div className="form-group full">
                  <label className="form-label">Intake Summary</label>

                  <textarea
                    className="form-textarea"
                    name="intakeSummary"
                    value={form.intakeSummary}
                    onChange={handleChange}
                    placeholder="Add initial intake information..."
                  />
                </div>

                <label className="consent-box">
                  <input
                    type="checkbox"
                    name="consentGiven"
                    checked={form.consentGiven}
                    onChange={handleChange}
                  />

                  <span>
                    Client consent has been received for treatment and
                    information storage.
                  </span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;