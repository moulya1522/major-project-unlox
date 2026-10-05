import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    phone: "",
    specializations: "",
    languages: "",
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
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        bio: form.bio,
        phone: form.phone,
        specializations: form.specializations
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        languages: form.languages
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">
      <div className="auth-brand">
        <div className="brand-mark">U</div>

        <div>
          <h1>Unfazed</h1>
          <p>Build your practice with confidence.</p>
        </div>
      </div>

      <div className="auth-card register-card">
        <div className="auth-heading">
          <span className="eyebrow">GET STARTED</span>

          <h2>Create your account</h2>

          <p>
            Set up your therapist profile and start managing
            your practice.
          </p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Dr. Your Name"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>
          </div>

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
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label>About you</label>

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell clients a little about your practice..."
              rows="3"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Specializations</label>

              <input
                type="text"
                name="specializations"
                value={form.specializations}
                onChange={handleChange}
                placeholder="Anxiety, Stress"
              />
            </div>

            <div className="form-group">
              <label>Languages</label>

              <input
                type="text"
                name="languages"
                value={form.languages}
                onChange={handleChange}
                placeholder="English, Hindi"
              />
            </div>
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>

          <Link to="/login">
            Sign in
          </Link>
        </div>
      </div>

      <p className="auth-bottom">
        Your practice. Your space. Your Unfazed.
      </p>
    </div>
  );
}