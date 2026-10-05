import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.currentPassword || !formData.newPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must contain at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from the current password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setMessage(
        response.data?.message || "Password changed successfully."
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={styles.backButton}
        >
          ← Back to Dashboard
        </button>

        <div style={styles.card}>
          <div style={styles.icon}>🔐</div>

          <h1 style={styles.title}>Change Password</h1>

          <p style={styles.subtitle}>
            Keep your Unfazed therapist account secure.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label>Current Password</label>

              <input
                type={showPasswords ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                autoComplete="current-password"
              />
            </div>

            <div style={styles.field}>
              <label>New Password</label>

              <input
                type={showPasswords ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                autoComplete="new-password"
              />
            </div>

            <div style={styles.field}>
              <label>Confirm New Password</label>

              <input
                type={showPasswords ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
            </div>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
              />

              <span>Show passwords</span>
            </label>

            {error && <div style={styles.error}>{error}</div>}

            {message && <div style={styles.success}>{message}</div>}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>

          <div style={styles.requirements}>
            <strong>Password requirements</strong>

            <ul>
              <li>At least 6 characters</li>
              <li>Must be different from your current password</li>
              <li>Confirm password must match the new password</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f7f9fc 0%, #eef2f7 50%, #e9eef5 100%)",
    padding: "40px 20px",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "620px",
    margin: "0 auto",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#334155",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
    padding: "8px 0",
  },

  card: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "42px",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.10)",
    border: "1px solid #e2e8f0",
  },

  icon: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
    marginBottom: "20px",
  },

  title: {
    margin: "0",
    color: "#0f172a",
    fontSize: "30px",
    fontWeight: "750",
  },

  subtitle: {
    margin: "10px 0 30px",
    color: "#64748b",
    fontSize: "15px",
    lineHeight: "1.6",
  },

  field: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "650",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "22px",
    cursor: "pointer",
  },

  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    marginBottom: "18px",
  },

  success: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    marginBottom: "18px",
  },

  submitButton: {
    width: "100%",
    border: "none",
    borderRadius: "13px",
    padding: "14px 18px",
    background: "#0f172a",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  requirements: {
    marginTop: "28px",
    padding: "18px",
    background: "#f8fafc",
    borderRadius: "14px",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.7",
  },
};

export default ChangePassword;