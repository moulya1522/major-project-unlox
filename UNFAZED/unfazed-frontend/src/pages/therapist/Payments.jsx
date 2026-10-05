
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function Payments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [form, setForm] = useState({
    clientId: "",
    sessionId: "",
    amount: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [paymentsRes, clientsRes, sessionsRes] =
        await Promise.all([
          axiosInstance.get("/payments"),
          axiosInstance.get("/clients"),
          axiosInstance.get("/sessions"),
        ]);

      setPayments(paymentsRes.data.payments || []);
      setClients(clientsRes.data.clients || []);
      setSessions(sessionsRes.data.sessions || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load payment data."
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

  const handleCreatePayment = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(
        "/payments/create-order",
        {
          clientId: form.clientId,
          sessionId: form.sessionId || undefined,
          amount: Number(form.amount),
          description: form.description,
        }
      );

      setSuccess(
        `Payment created successfully. Order ID: ${response.data.order.id}`
      );

      setForm({
        clientId: "",
        sessionId: "",
        amount: "",
        description: "",
      });

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to create payment."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCompletePayment = async (paymentId) => {
    setProcessingId(paymentId);
    setError("");
    setSuccess("");

    try {
      await axiosInstance.post("/payments/verify", {
        paymentId,
        success: true,
      });

      setSuccess("Test payment completed successfully.");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to complete payment."
      );
    } finally {
      setProcessingId("");
    }
  };

  const handleFailPayment = async (paymentId) => {
    setProcessingId(paymentId);
    setError("");
    setSuccess("");

    try {
      await axiosInstance.post("/payments/verify", {
        paymentId,
        success: false,
      });

      setSuccess("Test payment marked as failed.");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to update payment."
      );
    } finally {
      setProcessingId("");
    }
  };

  const getStatusClass = (status) => {
    if (status === "paid") return "status-paid";
    if (status === "failed") return "status-failed";
    if (status === "pending") return "status-pending";

    return "status-created";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="payments-page">
      <div className="payments-container">

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="page-header">
          <div>
            <h1>Payments</h1>
            <p>
              Manage client payments and payment history.
            </p>
          </div>

          <div className="test-badge">
            TEST PAYMENT MODE
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

        <div className="payment-card">
          <div className="card-header">
            <h2>Create Payment</h2>
            <span>Test Mode</span>
          </div>

          <form
            className="payment-form"
            onSubmit={handleCreatePayment}
          >
            <div className="form-group">
              <label>Client</label>

              <select
                name="clientId"
                value={form.clientId}
                onChange={handleChange}
                required
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
              >
                <option value="">
                  No session
                </option>

                {sessions
                  .filter(
                    (session) =>
                      !form.clientId ||
                      session.client?._id ===
                        form.clientId ||
                      session.client ===
                        form.clientId
                  )
                  .map((session) => (
                    <option
                      key={session._id}
                      value={session._id}
                    >
                      {formatDate(session.date)} -{" "}
                      {session.startTime}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount (₹)</label>

              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Example: Therapy session"
              />
            </div>

            <button
              type="submit"
              className="create-payment-btn"
              disabled={saving}
            >
              {saving
                ? "Creating..."
                : "Create Test Payment"}
            </button>
          </form>
        </div>

        <div className="payment-card">
          <div className="card-header">
            <div>
              <h2>Payment History</h2>
              <p>
                {payments.length} payment
                {payments.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              Loading payments...
            </div>
          ) : payments.length === 0 ? (
            <div className="empty-state">
              No payments found.
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        <strong>
                          {payment.client?.name ||
                            "Unknown"}
                        </strong>

                        {payment.client?.email && (
                          <small>
                            {payment.client.email}
                          </small>
                        )}
                      </td>

                      <td>
                        <strong>
                          ₹
                          {Number(
                            payment.amount || 0
                          ).toLocaleString("en-IN")}
                        </strong>
                      </td>

                      <td>
                        {payment.description || "-"}
                      </td>

                      <td>
                        {formatDate(
                          payment.createdAt
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td>
                        {payment.status === "pending" ? (
                          <div className="action-buttons">
                            <button
                              className="complete-btn"
                              onClick={() =>
                                handleCompletePayment(
                                  payment._id
                                )
                              }
                              disabled={
                                processingId ===
                                payment._id
                              }
                            >
                              {processingId ===
                              payment._id
                                ? "Processing..."
                                : "Complete"}
                            </button>

                            <button
                              className="fail-btn"
                              onClick={() =>
                                handleFailPayment(
                                  payment._id
                                )
                              }
                              disabled={
                                processingId ===
                                payment._id
                              }
                            >
                              Fail
                            </button>
                          </div>
                        ) : (
                          <span className="action-done">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .payments-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 32px;
        }

        .payments-container {
          max-width: 1250px;
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
          justify-content: space-between;
          align-items: center;
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

        .test-badge {
          background: #fff4d6;
          color: #946200;
          border: 1px solid #f1d27a;
          padding: 9px 14px;
          border-radius: 20px;
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

        .payment-card {
          background: white;
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 8px 25px rgba(16, 24, 40, 0.06);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .card-header h2 {
          margin: 0;
          color: #172033;
          font-size: 21px;
        }

        .card-header p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 13px;
        }

        .card-header span {
          font-size: 12px;
          color: #667085;
          font-weight: 700;
        }

        .payment-form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 700;
          color: #344054;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px 13px;
          border: 1px solid #d0d5dd;
          border-radius: 10px;
          outline: none;
          background: white;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #1f6feb;
          box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.1);
        }

        .create-payment-btn {
          grid-column: 1 / -1;
          border: none;
          border-radius: 10px;
          padding: 13px 18px;
          background: #1f6feb;
          color: white;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        .create-payment-btn:hover {
          background: #1559bd;
        }

        .create-payment-btn:disabled,
        .complete-btn:disabled,
        .fail-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .payments-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
        }

        .payments-table th {
          text-align: left;
          padding: 13px;
          background: #f8fafc;
          color: #667085;
          font-size: 12px;
          text-transform: uppercase;
        }

        .payments-table td {
          padding: 15px 13px;
          border-top: 1px solid #eaecf0;
          color: #344054;
          font-size: 14px;
        }

        .payments-table td small {
          display: block;
          margin-top: 4px;
          color: #98a2b3;
        }

        .status-badge {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .status-paid {
          background: #dcfae6;
          color: #067647;
        }

        .status-pending {
          background: #fff4d6;
          color: #946200;
        }

        .status-failed {
          background: #fee4e2;
          color: #b42318;
        }

        .status-created {
          background: #eef2ff;
          color: #4338ca;
        }

        .action-buttons {
          display: flex;
          gap: 7px;
        }

        .complete-btn,
        .fail-btn {
          border: none;
          border-radius: 8px;
          padding: 8px 11px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .complete-btn {
          background: #e8f7ee;
          color: #067647;
        }

        .fail-btn {
          background: #fff0f0;
          color: #b42318;
        }

        .action-done {
          color: #98a2b3;
        }

        .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #667085;
        }

        @media (max-width: 700px) {
          .payments-page {
            padding: 18px;
          }

          .page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .payment-form {
            grid-template-columns: 1fr;
          }

          .create-payment-btn {
            grid-column: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default Payments;


