import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmPassword
    ) {
      setError("Please fill in all password fields.");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        "/password/change-password",
        form
      );

      if (response.data.success) {
        setSuccess("Password changed successfully.");

        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      console.error("Change password error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f7fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "22px",
          padding: "38px",
          boxShadow: "0 18px 50px rgba(30, 30, 80, 0.10)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#666",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          ← Back to dashboard
        </button>

        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "16px",
            background: "#eeeeff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            marginBottom: "18px",
          }}
        >
          🔐
        </div>

        <p
          style={{
            margin: 0,
            fontSize: "11px",
            letterSpacing: "1.5px",
            fontWeight: "700",
            color: "#6566f1",
          }}
        >
          ACCOUNT SECURITY
        </p>

        <h1
          style={{
            margin: "8px 0",
            fontSize: "30px",
            color: "#172033",
          }}
        >
          Change Password
        </h1>

        <p
          style={{
            margin: "0 0 28px",
            color: "#7a8190",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          Update your therapist account password securely.
        </p>

        {error && (
          <div
            style={{
              background: "#fff0f0",
              color: "#c0392b",
              padding: "13px 15px",
              borderRadius: "12px",
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#eefaf2",
              color: "#218838",
              padding: "13px 15px",
              borderRadius: "12px",
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            show={showCurrent}
            setShow={setShowCurrent}
          />

          <PasswordField
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            show={showNew}
            setShow={setShowNew}
          />

          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            show={showConfirm}
            setShow={setShowConfirm}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "13px",
              padding: "15px",
              background: "#5f5ff2",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "8px",
            }}
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  show,
  setShow,
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#343a48",
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "13px 48px 13px 14px",
            border: "1px solid #e0e2e8",
            borderRadius: "12px",
            outline: "none",
            fontSize: "14px",
            background: "#fafbfc",
          }}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "17px",
          }}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );
}