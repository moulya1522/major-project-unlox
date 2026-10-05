
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function Packages() {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    sessions: "3",
    price: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/packages");

      setPackages(response.data.packages || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load packages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
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
      name: "",
      sessions: "3",
      price: "",
      description: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await axiosInstance.put(
          `/packages/${editingId}`,
          {
            name: form.name,
            sessions: Number(form.sessions),
            price: Number(form.price),
            description: form.description,
          }
        );

        setSuccess("Package updated successfully.");
      } else {
        await axiosInstance.post("/packages", {
          name: form.name,
          sessions: Number(form.sessions),
          price: Number(form.price),
          description: form.description,
        });

        setSuccess("Package created successfully.");
      }

      resetForm();
      await loadPackages();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save package."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (packageData) => {
    setEditingId(packageData._id);

    setForm({
      name: packageData.name || "",
      sessions: String(packageData.sessions),
      price: String(packageData.price),
      description: packageData.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this package?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await axiosInstance.delete(`/packages/${id}`);

      setSuccess("Package deleted successfully.");

      await loadPackages();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete package."
      );
    }
  };

  const handleToggle = async (packageData) => {
    try {
      setError("");
      setSuccess("");

      await axiosInstance.put(
        `/packages/${packageData._id}`,
        {
          isActive: !packageData.isActive,
        }
      );

      setSuccess(
        packageData.isActive
          ? "Package deactivated."
          : "Package activated."
      );

      await loadPackages();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to update package status."
      );
    }
  };

  return (
    <div className="packages-page">
      <div className="packages-container">

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="page-header">
          <div>
            <h1>Packages</h1>
            <p>
              Create and manage therapy session packages.
            </p>
          </div>

          <div className="package-info">
            3 · 6 · 12 Sessions
          </div>
        </div>

        {error && (
          <div className="message error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            {success}
          </div>
        )}

        <div className="package-card">
          <div className="card-heading">
            <div>
              <h2>
                {editingId
                  ? "Edit Package"
                  : "Create Package"}
              </h2>

              <p>
                Offer clients multiple-session plans.
              </p>
            </div>
          </div>

          <form
            className="package-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label>Package Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Example: Wellness Plan"
                required
              />
            </div>

            <div className="form-group">
              <label>Sessions</label>

              <select
                name="sessions"
                value={form.sessions}
                onChange={handleChange}
              >
                <option value="3">
                  3 Sessions
                </option>

                <option value="6">
                  6 Sessions
                </option>

                <option value="12">
                  12 Sessions
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Price (₹)</label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Example: 2500"
                min="0"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what is included in this package."
                rows="4"
              />
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
                  ? "Update Package"
                  : "Create Package"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="package-card">
          <div className="card-heading">
            <div>
              <h2>Your Packages</h2>

              <p>
                {packages.length} package
                {packages.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              Loading packages...
            </div>
          ) : packages.length === 0 ? (
            <div className="empty-state">
              No packages created yet.
            </div>
          ) : (
            <div className="packages-grid">
              {packages.map((packageData) => (
                <div
                  className="package-item"
                  key={packageData._id}
                >
                  <div className="package-top">
                    <div>
                      <span className="session-count">
                        {packageData.sessions}
                      </span>

                      <span className="session-text">
                        Sessions
                      </span>
                    </div>

                    <span
                      className={`active-badge ${
                        packageData.isActive
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {packageData.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <h3>{packageData.name}</h3>

                  <div className="package-price">
                    ₹
                    {Number(
                      packageData.price
                    ).toLocaleString("en-IN")}
                  </div>

                  <p className="package-description">
                    {packageData.description ||
                      "No description added."}
                  </p>

                  <div className="package-actions">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(packageData)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="toggle-btn"
                      onClick={() =>
                        handleToggle(packageData)
                      }
                    >
                      {packageData.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(
                          packageData._id
                        )
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
        .packages-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 32px;
        }

        .packages-container {
          max-width: 1200px;
          margin: 0 auto;
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
        }

        .back-btn:hover {
          text-decoration: underline;
          transform: translateX(-2px);
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .page-header h1 {
          margin: 0 0 6px;
          font-size: 32px;
          color: #172033;
        }

        .page-header p {
          margin: 0;
          color: #667085;
        }

        .package-info {
          padding: 10px 15px;
          border-radius: 20px;
          background: #eef4ff;
          color: #1f6feb;
          font-size: 12px;
          font-weight: 800;
        }

        .message {
          padding: 13px 16px;
          border-radius: 10px;
          margin-bottom: 18px;
          font-weight: 600;
        }

        .error-message {
          background: #fff0f0;
          color: #c62828;
          border: 1px solid #ffcaca;
        }

        .success-message {
          background: #ecfdf3;
          color: #18794e;
          border: 1px solid #b7ebcd;
        }

        .package-card {
          background: white;
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 8px 25px rgba(16, 24, 40, 0.06);
        }

        .card-heading {
          margin-bottom: 22px;
        }

        .card-heading h2 {
          margin: 0;
          font-size: 21px;
          color: #172033;
        }

        .card-heading p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 13px;
        }

        .package-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 700;
          color: #344054;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          border: 1px solid #d0d5dd;
          border-radius: 10px;
          padding: 12px 13px;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          resize: vertical;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #1f6feb;
          box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.1);
        }

        .form-actions {
          grid-column: 1 / -1;
          display: flex;
          gap: 10px;
        }

        .primary-btn,
        .secondary-btn {
          border: none;
          border-radius: 10px;
          padding: 12px 18px;
          font-weight: 800;
          cursor: pointer;
        }

        .primary-btn {
          background: #1f6feb;
          color: white;
        }

        .primary-btn:hover {
          background: #1559bd;
        }

        .secondary-btn {
          background: #eef2f6;
          color: #344054;
        }

        .packages-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .package-item {
          border: 1px solid #eaecf0;
          border-radius: 15px;
          padding: 20px;
          transition: 0.2s ease;
        }

        .package-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(16, 24, 40, 0.07);
        }

        .package-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .session-count {
          font-size: 30px;
          font-weight: 900;
          color: #1f6feb;
        }

        .session-text {
          margin-left: 7px;
          color: #667085;
          font-size: 12px;
          font-weight: 700;
        }

        .active-badge {
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .active {
          background: #dcfae6;
          color: #067647;
        }

        .inactive {
          background: #f2f4f7;
          color: #667085;
        }

        .package-item h3 {
          margin: 15px 0 8px;
          font-size: 18px;
          color: #172033;
        }

        .package-price {
          font-size: 25px;
          font-weight: 900;
          color: #172033;
        }

        .package-description {
          min-height: 45px;
          color: #667085;
          font-size: 13px;
          line-height: 1.5;
          margin: 12px 0 18px;
        }

        .package-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .edit-btn,
        .toggle-btn,
        .delete-btn {
          border: none;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .edit-btn {
          background: #eef4ff;
          color: #1f6feb;
        }

        .toggle-btn {
          background: #fff4d6;
          color: #946200;
        }

        .delete-btn {
          background: #fff0f0;
          color: #b42318;
        }

        .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #667085;
        }

        @media (max-width: 900px) {
          .packages-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 650px) {
          .packages-page {
            padding: 18px;
          }

          .page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .package-form {
            grid-template-columns: 1fr;
          }

          .form-group.full-width,
          .form-actions {
            grid-column: auto;
          }

          .packages-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Packages;
