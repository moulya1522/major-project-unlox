import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function ClientLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Make sure an old therapist token cannot interfere
      localStorage.removeItem("clientToken");
      localStorage.removeItem("clientData");

      const response = await axiosInstance.post(
        "/clients/portal/login",
        {
          email: cleanEmail,
          password: cleanPassword,
        }
      );

      if (response.data.success) {
        localStorage.setItem(
          "clientToken",
          response.data.token
        );

        localStorage.setItem(
          "clientData",
          JSON.stringify(response.data.client)
        );

        navigate("/client-portal", {
          replace: true,
        });
      } else {
        setError(
          response.data.message ||
            "Invalid client email or password."
        );
      }
    } catch (err) {
      console.error("Client login error:", err);

      setError(
        err.response?.data?.message ||
          "Invalid client email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-login-page">
      <div className="login-wrapper">

        <div className="brand-section">
          <div className="brand-icon">U</div>

          <h1>Unfazed</h1>

          <p>
            Secure Client Portal
          </p>
        </div>

        <div className="login-card">
          <div className="card-header">
            <p className="label">
              CLIENT PORTAL
            </p>

            <h2>Welcome back</h2>

            <p>
              Sign in to manage your sessions and
              access your portal.
            </p>
          </div>

          {error && (
            <div className="error-box">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label htmlFor="client-email">
                Email Address
              </label>

              <input
                id="client-email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="client-password">
                Password
              </label>

              <input
                id="client-password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          <div className="login-note">
            <span>🔒</span>

            <p>
              Your client portal is private and
              secure.
            </p>
          </div>

          <button
            className="therapist-link"
            type="button"
            onClick={() => navigate("/login")}
          >
            ← Therapist Login
          </button>
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
.client-login-page {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #f5f8ff 0%,
    #eef4ff 50%,
    #f8fafc 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  font-family: Arial, sans-serif;
  color: #172033;
}

.login-wrapper {
  width: 100%;
  max-width: 440px;
}

.brand-section {
  text-align: center;
  margin-bottom: 25px;
}

.brand-icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 12px;
  border-radius: 17px;
  background: #1f6feb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  font-weight: 900;
  box-shadow: 0 10px 25px rgba(31, 111, 235, 0.25);
}

.brand-section h1 {
  margin: 0;
  font-size: 30px;
  letter-spacing: -0.5px;
}

.brand-section p {
  margin: 6px 0 0;
  color: #718096;
  font-size: 14px;
}

.login-card {
  background: white;
  border: 1px solid #e3e8f0;
  border-radius: 22px;
  padding: 32px;
  box-shadow: 0 20px 55px rgba(31, 48, 80, 0.1);
}

.card-header {
  margin-bottom: 25px;
}

.label {
  color: #1f6feb;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1.5px;
  margin: 0 0 8px;
}

.card-header h2 {
  margin: 0 0 8px;
  font-size: 27px;
}

.card-header p:last-child {
  margin: 0;
  color: #718096;
  font-size: 14px;
  line-height: 1.6;
}

.error-box {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  color: #be123c;
  border-radius: 11px;
  padding: 12px 14px;
  margin-bottom: 20px;
}

.error-box span {
  font-size: 15px;
}

.error-box p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d7dee8;
  border-radius: 11px;
  padding: 13px 14px;
  font-size: 14px;
  outline: none;
  color: #172033;
  background: white;
  transition: 0.2s ease;
}

.form-group input::placeholder {
  color: #a0aec0;
}

.form-group input:focus {
  border-color: #1f6feb;
  box-shadow:
    0 0 0 3px rgba(31, 111, 235, 0.1);
}

.login-btn {
  width: 100%;
  border: none;
  border-radius: 11px;
  background: #1f6feb;
  color: white;
  padding: 14px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 3px;
  transition: 0.2s ease;
}

.login-btn:hover {
  background: #1559bd;
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.login-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 20px;
  padding: 11px;
  background: #f8fafc;
  border-radius: 10px;
}

.login-note span {
  font-size: 13px;
}

.login-note p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
}

.therapist-link {
  width: 100%;
  border: none;
  background: transparent;
  color: #1f6feb;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 18px;
}

.therapist-link:hover {
  text-decoration: underline;
}

@media (max-width: 500px) {
  .client-login-page {
    padding: 15px;
  }

  .login-card {
    padding: 24px 20px;
    border-radius: 18px;
  }

  .card-header h2 {
    font-size: 24px;
  }
}
`;

export default ClientLogin;