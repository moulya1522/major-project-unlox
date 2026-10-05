import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showPortalModal, setShowPortalModal] = useState(false);
  const [portalPassword, setPortalPassword] = useState("");
  const [activatingPortal, setActivatingPortal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    concern: "",
    intakeSummary: "",
    consentGiven: false,
    status: "active",
  });

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(`/clients/${id}`);

      if (response.data.success) {
        setClient(response.data.client);
      }
    } catch (err) {
      console.error("Fetch client error:", err);

      setError(
        err.response?.data?.message || "Failed to load client details."
      );
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = () => {
    if (!client) return;

    setForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      dateOfBirth: client.dateOfBirth
        ? client.dateOfBirth.substring(0, 10)
        : "",
      gender: client.gender || "",
      concern: client.concern || "",
      intakeSummary: client.intakeSummary || "",
      consentGiven: Boolean(client.consentGiven),
      status: client.status || "active",
    });

    setShowEdit(true);
    setError("");
    setSuccess("");
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await axiosInstance.put(`/clients/${id}`, form);

      if (response.data.success) {
        setClient(response.data.client);
        setShowEdit(false);
        setSuccess("Client details updated successfully.");
      }
    } catch (err) {
      console.error("Update client error:", err);

      setError(
        err.response?.data?.message || "Failed to update client."
      );
    } finally {
      setSaving(false);
    }
  };

  const openPortalModal = () => {
    if (!client?.email) {
      setError(
        "This client needs an email address before portal activation."
      );
      return;
    }

    setPortalPassword("");
    setError("");
    setSuccess("");
    setShowPortalModal(true);
  };

  const handlePortalActivation = async (e) => {
    e.preventDefault();

    const cleanPassword = portalPassword.trim();

    if (cleanPassword.length < 6) {
      setError("Portal password must be at least 6 characters.");
      return;
    }

    try {
      setActivatingPortal(true);
      setError("");
      setSuccess("");

      const response = await axiosInstance.post(
        `/clients/${id}/activate-portal`,
        {
          password: cleanPassword,
        }
      );

      if (response.data.success) {
        setClient((previous) => ({
          ...previous,
          ...response.data.client,
          isPortalActive: true,
        }));

        setShowPortalModal(false);
        setPortalPassword("");

        setSuccess(
          "Client portal activated successfully. The client can now sign in."
        );
      }
    } catch (err) {
      console.error("Activate portal error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to activate client portal."
      );
    } finally {
      setActivatingPortal(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        client?.name || "this client"
      }? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await axiosInstance.delete(`/clients/${id}`);

      if (response.data.success) {
        navigate("/clients");
      }
    } catch (err) {
      console.error("Delete client error:", err);

      setError(
        err.response?.data?.message || "Failed to delete client."
      );

      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="client-details-page">
        <div className="loading-box">Loading client details...</div>

        <style>{styles}</style>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="client-details-page">
        <div className="error-box">
          {error || "Client not found."}
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/clients")}
        >
          ← Back to Clients
        </button>

        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="client-details-page">
      <div className="details-container">
        <button
          className="back-btn"
          onClick={() => navigate("/clients")}
        >
          ← Back to Clients
        </button>

        {error && <div className="error-box">{error}</div>}

        {success && (
          <div className="success-box">{success}</div>
        )}

        <div className="details-header">
          <div>
            <p className="page-label">CLIENT PROFILE</p>

            <h1>{client.name}</h1>

            <p className="client-subtitle">
              Client information and intake details
            </p>
          </div>

          <div className="header-actions">
            <button
              className="portal-btn"
              onClick={openPortalModal}
              type="button"
            >
              {client.isPortalActive
                ? "Reset Portal Password"
                : "Activate Portal"}
            </button>

            <button
              className="edit-btn"
              onClick={openEditForm}
              type="button"
            >
              Edit Client
            </button>

            <button
              className="delete-btn"
              onClick={handleDelete}
              disabled={deleting}
              type="button"
            >
              {deleting ? "Deleting..." : "Delete Client"}
            </button>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            {client.name?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div className="profile-main">
            <h2>{client.name}</h2>

            <span
              className={`status-badge ${
                client.status === "active"
                  ? "status-active"
                  : "status-inactive"
              }`}
            >
              {client.status || "active"}
            </span>

            <span
              className={`portal-badge ${
                client.isPortalActive
                  ? "portal-active"
                  : "portal-inactive"
              }`}
            >
              {client.isPortalActive
                ? "Portal Active"
                : "Portal Not Active"}
            </span>
          </div>
        </div>

        <div className="details-grid">
          <div className="info-card">
            <h3>Personal Information</h3>

            <div className="info-list">
              <div className="info-item">
                <span>Email</span>
                <strong>
                  {client.email || "Not provided"}
                </strong>
              </div>

              <div className="info-item">
                <span>Phone</span>
                <strong>
                  {client.phone || "Not provided"}
                </strong>
              </div>

              <div className="info-item">
                <span>Date of Birth</span>
                <strong>
                  {client.dateOfBirth
                    ? new Date(
                        client.dateOfBirth
                      ).toLocaleDateString()
                    : "Not provided"}
                </strong>
              </div>

              <div className="info-item">
                <span>Gender</span>
                <strong>
                  {client.gender || "Not provided"}
                </strong>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>Client Information</h3>

            <div className="info-list">
              <div className="info-item">
                <span>Primary Concern</span>
                <strong>
                  {client.concern || "Not provided"}
                </strong>
              </div>

              <div className="info-item">
                <span>Consent</span>
                <strong>
                  {client.consentGiven
                    ? "Given"
                    : "Not given"}
                </strong>
              </div>

              <div className="info-item">
                <span>Consent Date</span>
                <strong>
                  {client.consentTimestamp
                    ? new Date(
                        client.consentTimestamp
                      ).toLocaleDateString()
                    : "Not available"}
                </strong>
              </div>

              <div className="info-item">
                <span>Added On</span>
                <strong>
                  {client.createdAt
                    ? new Date(
                        client.createdAt
                      ).toLocaleDateString()
                    : "Not available"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="info-card intake-card">
          <h3>Intake Summary</h3>

          <p className="intake-text">
            {client.intakeSummary ||
              "No intake summary has been added for this client."}
          </p>
        </div>

        {showEdit && (
          <div
            className="modal-overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowEdit(false);
              }
            }}
          >
            <div className="edit-modal">
              <div className="modal-header">
                <div>
                  <p className="page-label">CLIENT PROFILE</p>
                  <h2>Edit Client</h2>
                </div>

                <button
                  className="close-btn"
                  onClick={() => setShowEdit(false)}
                  type="button"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>

                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Date of Birth</label>

                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Gender</label>

                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleEditChange}
                    >
                      <option value="">
                        Select gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status</label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleEditChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">
                        Inactive
                      </option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Primary Concern</label>

                  <input
                    type="text"
                    name="concern"
                    value={form.concern}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Intake Summary</label>

                  <textarea
                    name="intakeSummary"
                    value={form.intakeSummary}
                    onChange={handleEditChange}
                    rows="5"
                  />
                </div>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    name="consentGiven"
                    checked={form.consentGiven}
                    onChange={handleEditChange}
                  />

                  <span>
                    Client consent has been given
                  </span>
                </label>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setShowEdit(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPortalModal && (
          <div
            className="modal-overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowPortalModal(false);
              }
            }}
          >
            <div className="portal-modal">
              <div className="modal-header">
                <div>
                  <p className="page-label">
                    CLIENT PORTAL
                  </p>

                  <h2>
                    {client.isPortalActive
                      ? "Reset Portal Password"
                      : "Activate Client Portal"}
                  </h2>
                </div>

                <button
                  className="close-btn"
                  onClick={() =>
                    setShowPortalModal(false)
                  }
                  type="button"
                >
                  ×
                </button>
              </div>

              <div className="portal-info">
                <div className="portal-icon">🔐</div>

                <div>
                  <strong>{client.name}</strong>

                  <p>
                    {client.email ||
                      "No email address provided"}
                  </p>
                </div>
              </div>

              <form onSubmit={handlePortalActivation}>
                <div className="form-group">
                  <label>Portal Password</label>

                  <input
                    type="password"
                    value={portalPassword}
                    onChange={(e) =>
                      setPortalPassword(e.target.value)
                    }
                    placeholder="Enter at least 6 characters"
                    minLength={6}
                    required
                    autoFocus
                  />

                  <small>
                    Give this password to the client so
                    they can sign in to their portal.
                  </small>
                </div>

                <div className="login-info">
                  <strong>Client login</strong>

                  <span>
                    Email: {client.email}
                  </span>

                  <span>
                    Password: the password you set above
                  </span>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() =>
                      setShowPortalModal(false)
                    }
                    disabled={activatingPortal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-btn portal-submit-btn"
                    disabled={activatingPortal}
                  >
                    {activatingPortal
                      ? "Activating..."
                      : client.isPortalActive
                      ? "Update Portal Password"
                      : "Activate Portal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
.client-details-page {
  min-height: 100vh;
  background: #f6f8fc;
  padding: 35px;
  font-family: Arial, sans-serif;
  color: #172033;
}

.details-container {
  max-width: 1150px;
  margin: 0 auto;
}

.back-btn {
  border: none;
  background: transparent;
  color: #1f6feb;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  margin-bottom: 25px;
}

.back-btn:hover {
  text-decoration: underline;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 25px;
}

.page-label {
  color: #1f6feb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin: 0 0 8px;
}

.details-header h1 {
  margin: 0;
  font-size: 34px;
}

.client-subtitle {
  margin: 8px 0 0;
  color: #718096;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.portal-btn,
.edit-btn,
.delete-btn {
  border: none;
  border-radius: 10px;
  padding: 11px 17px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.portal-btn {
  background: #172033;
  color: white;
}

.portal-btn:hover {
  background: #0f172a;
  transform: translateY(-1px);
}

.edit-btn {
  background: #1f6feb;
  color: white;
}

.edit-btn:hover {
  background: #1559bd;
  transform: translateY(-1px);
}

.delete-btn {
  background: #fff1f2;
  color: #dc2626;
  border: 1px solid #fecdd3;
}

.delete-btn:hover {
  background: #ffe4e6;
  transform: translateY(-1px);
}

.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.profile-card,
.info-card {
  background: white;
  border: 1px solid #e6eaf0;
  border-radius: 18px;
  box-shadow: 0 8px 25px rgba(25, 45, 80, 0.05);
}

.profile-card {
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  background: #eaf2ff;
  color: #1f6feb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27px;
  font-weight: 800;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.profile-main h2 {
  margin: 0;
  font-size: 23px;
}

.status-badge,
.portal-badge {
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 800;
}

.status-badge {
  text-transform: capitalize;
}

.status-active {
  background: #ecfdf3;
  color: #15803d;
}

.status-inactive {
  background: #f1f5f9;
  color: #64748b;
}

.portal-active {
  background: #eaf2ff;
  color: #1f6feb;
}

.portal-inactive {
  background: #fff7ed;
  color: #c2410c;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-card {
  padding: 25px;
}

.info-card h3 {
  margin: 0 0 22px;
  font-size: 18px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #edf0f4;
  padding-bottom: 13px;
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-item span {
  color: #718096;
  font-size: 14px;
}

.info-item strong {
  text-align: right;
  font-size: 14px;
  color: #202938;
}

.intake-card {
  margin-top: 20px;
}

.intake-text {
  margin: 0;
  color: #596579;
  line-height: 1.7;
  white-space: pre-wrap;
}

.error-box {
  background: #fff1f2;
  color: #be123c;
  border: 1px solid #fecdd3;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
  font-size: 14px;
}

.success-box {
  background: #ecfdf3;
  color: #15803d;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
  font-size: 14px;
}

.loading-box {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #64748b;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  z-index: 1000;
  overflow-y: auto;
}

.edit-modal,
.portal-modal {
  width: 100%;
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
}

.edit-modal {
  max-width: 760px;
  max-height: 90vh;
  overflow-y: auto;
}

.portal-modal {
  max-width: 520px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.modal-header h2 {
  margin: 0;
  font-size: 25px;
}

.close-btn {
  border: none;
  background: #f1f5f9;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #475569;
}

.close-btn:hover {
  background: #e2e8f0;
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

.full-width {
  width: 100%;
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
  transition: 0.2s ease;
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

.form-group small {
  color: #718096;
  font-size: 12px;
  line-height: 1.5;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 14px;
  color: #475569;
  margin: 5px 0 20px;
  cursor: pointer;
}

.checkbox-row input {
  width: 16px;
  height: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 5px;
}

.secondary-btn,
.primary-btn {
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
}

.secondary-btn {
  background: #f1f5f9;
  color: #334155;
}

.secondary-btn:hover {
  background: #e2e8f0;
}

.primary-btn {
  background: #1f6feb;
  color: white;
}

.primary-btn:hover {
  background: #1559bd;
}

.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.portal-info {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 22px;
}

.portal-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eaf2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.portal-info strong {
  display: block;
  color: #172033;
  margin-bottom: 4px;
}

.portal-info p {
  margin: 0;
  color: #718096;
  font-size: 13px;
  word-break: break-word;
}

.login-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #334155;
}

.login-info strong {
  color: #1d4ed8;
  margin-bottom: 3px;
}

.login-info span {
  word-break: break-word;
}

.portal-submit-btn {
  min-width: 190px;
}

@media (max-width: 700px) {
  .client-details-page {
    padding: 20px;
  }

  .details-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .details-header h1 {
    font-size: 28px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .edit-modal,
  .portal-modal {
    padding: 22px;
  }
}

@media (max-width: 500px) {
  .client-details-page {
    padding: 15px;
  }

  .profile-card {
    padding: 18px;
  }

  .profile-avatar {
    width: 55px;
    height: 55px;
    font-size: 22px;
  }

  .profile-main h2 {
    font-size: 19px;
  }

  .header-actions {
    width: 100%;
  }

  .portal-btn,
  .edit-btn,
  .delete-btn {
    flex: 1;
  }

  .info-card {
    padding: 19px;
  }

  .info-item {
    flex-direction: column;
    gap: 5px;
  }

  .info-item strong {
    text-align: left;
  }

  .modal-overlay {
    padding: 10px;
  }

  .edit-modal,
  .portal-modal {
    border-radius: 15px;
    padding: 18px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .secondary-btn,
  .primary-btn {
    width: 100%;
  }
}
`;

export default ClientDetails;