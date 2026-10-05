import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to login. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="brand-mark">U</div>

        <div>
          <h1>Unfazed</h1>
          <p>Practice management, made simpler.</p>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">THERAPIST PORTAL</span>

          <h2>Welcome back</h2>

          <p>
            Sign in to manage your practice, clients and sessions.
          </p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label>Password</label>
              <span>Secure login</span>
            </div>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-footer">
          <span>New to Unfazed?</span>

          <Link to="/register">
            Create therapist account
          </Link>
        </div>
      </div>

      <p className="auth-bottom">
        Private practice management • Built for therapists
      </p>
    </div>
  );
}