import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function ClientPortal() {
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    const savedClient = localStorage.getItem("clientData");

    if (!token) {
      navigate("/client-login");
      return;
    }

    if (savedClient) {
      try {
        setClient(JSON.parse(savedClient));
      } catch (error) {
        console.error("Client data error:", error);
      }
    }

    const loadClient = async () => {
      try {
        const response = await axiosInstance.get("/clients/portal/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setClient(response.data.client);

          localStorage.setItem(
            "clientData",
            JSON.stringify(response.data.client)
          );
        }
      } catch (error) {
        console.error("Client portal error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("clientToken");
          localStorage.removeItem("clientData");
          navigate("/client-login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Unable to load your portal."
        );
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientData");

    navigate("/client-login");
  };

  if (loading && !client) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>
          Loading your portal...
        </p>
      </div>
    );
  }

  if (error && !client) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.errorCard}>
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/client-login")}
            style={styles.primaryButton}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const firstName = client?.name
    ? client.name.split(" ")[0]
    : "there";

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brandArea}>
            <div style={styles.logo}>U</div>

            <div>
              <h1 style={styles.brand}>Unfazed</h1>
              <p style={styles.brandSubtext}>
                Client Portal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Log out
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <div>
            <p style={styles.eyebrow}>
              YOUR PERSONAL SPACE
            </p>

            <h2 style={styles.heroTitle}>
              Welcome, {firstName} 👋
            </h2>

            <p style={styles.heroText}>
              Manage your therapy journey, appointments,
              notes and payments from one secure place.
            </p>
          </div>

          <div style={styles.profileCircle}>
            {client?.name
              ? client.name.charAt(0).toUpperCase()
              : "C"}
          </div>
        </section>

        <section style={styles.grid}>
          <button
            type="button"
            onClick={() => navigate("/client-booking")}
            style={styles.card}
          >
            <div style={styles.icon}>◷</div>

            <div>
              <h3 style={styles.cardTitle}>
                Book a Session
              </h3>

              <p style={styles.cardText}>
                View available times and schedule your
                next session.
              </p>
            </div>

            <span style={styles.arrow}>→</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/client-sessions")}
            style={styles.card}
          >
            <div style={styles.icon}>▣</div>

            <div>
              <h3 style={styles.cardTitle}>
                My Sessions
              </h3>

              <p style={styles.cardText}>
                View your upcoming and previous therapy
                sessions.
              </p>
            </div>

            <span style={styles.arrow}>→</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/client-notes")}
            style={styles.card}
          >
            <div style={styles.icon}>▤</div>

            <div>
              <h3 style={styles.cardTitle}>
                Shared Notes
              </h3>

              <p style={styles.cardText}>
                Access notes and information shared by
                your therapist.
              </p>
            </div>

            <span style={styles.arrow}>→</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/client-payment")}
            style={styles.card}
          >
            <div style={styles.icon}>₹</div>

            <div>
              <h3 style={styles.cardTitle}>
                Payments
              </h3>

              <p style={styles.cardText}>
                View your payment history and payment
                information.
              </p>
            </div>

            <span style={styles.arrow}>→</span>
          </button>
        </section>

        <section style={styles.profileSection}>
          <div>
            <p style={styles.panelEyebrow}>
              PROFILE
            </p>

            <h2 style={styles.profileTitle}>
              Your information
            </h2>
          </div>

          <div style={styles.profileGrid}>
            <div style={styles.profileItem}>
              <span style={styles.profileLabel}>
                Full name
              </span>

              <strong style={styles.profileValue}>
                {client?.name || "Not available"}
              </strong>
            </div>

            <div style={styles.profileItem}>
              <span style={styles.profileLabel}>
                Email
              </span>

              <strong style={styles.profileValue}>
                {client?.email || "Not available"}
              </strong>
            </div>

            <div style={styles.profileItem}>
              <span style={styles.profileLabel}>
                Phone
              </span>

              <strong style={styles.profileValue}>
                {client?.phone || "Not available"}
              </strong>
            </div>

            <div style={styles.profileItem}>
              <span style={styles.profileLabel}>
                Portal status
              </span>

              <strong style={styles.activeStatus}>
                ● Active
              </strong>
            </div>
          </div>
        </section>

        <section style={styles.securityBox}>
          <div style={styles.securityIcon}>✓</div>

          <div>
            <h3 style={styles.securityTitle}>
              Your information is private
            </h3>

            <p style={styles.securityText}>
              This portal is designed for your personal
              therapy information. Only information shared
              with you by your therapist is displayed here.
            </p>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>
          © {new Date().getFullYear()} Unfazed · Client
          Portal
        </p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fc",
    color: "#172033",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  header: {
    background: "#ffffff",
    borderBottom: "1px solid #e8edf5",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  headerInner: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "17px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logo: {
    width: "43px",
    height: "43px",
    borderRadius: "12px",
    background: "#1f6feb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "20px",
  },

  brand: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "800",
  },

  brandSubtext: {
    margin: "2px 0 0",
    color: "#7b879c",
    fontSize: "11px",
    fontWeight: "600",
  },

  logoutButton: {
    border: "1px solid #dce3ee",
    background: "#ffffff",
    color: "#475569",
    borderRadius: "9px",
    padding: "9px 15px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  main: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "42px 24px 60px",
  },

  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    background:
      "linear-gradient(135deg, #1f6feb 0%, #315edc 100%)",
    color: "#ffffff",
    padding: "38px 42px",
    borderRadius: "22px",
    boxShadow: "0 18px 45px rgba(31, 111, 235, 0.18)",
    marginBottom: "28px",
  },

  eyebrow: {
    margin: "0 0 9px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    opacity: 0.8,
  },

  heroTitle: {
    margin: "0 0 9px",
    fontSize: "31px",
    lineHeight: "1.2",
    letterSpacing: "-1px",
  },

  heroText: {
    margin: 0,
    maxWidth: "620px",
    fontSize: "14px",
    lineHeight: "1.7",
    opacity: 0.88,
  },

  profileCircle: {
    minWidth: "74px",
    width: "74px",
    height: "74px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.18)",
    border: "1px solid rgba(255,255,255,0.3)",
    fontSize: "28px",
    fontWeight: "800",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },

  card: {
    position: "relative",
    textAlign: "left",
    border: "1px solid #e4e9f1",
    background: "#ffffff",
    borderRadius: "17px",
    padding: "24px",
    minHeight: "175px",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 5px 20px rgba(20, 35, 60, 0.04)",
  },

  icon: {
    width: "43px",
    height: "43px",
    borderRadius: "12px",
    background: "#edf4ff",
    color: "#1f6feb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    fontWeight: "800",
    marginBottom: "19px",
  },

  cardTitle: {
    margin: "0 0 7px",
    fontSize: "17px",
    fontWeight: "800",
  },

  cardText: {
    margin: 0,
    color: "#718096",
    fontSize: "13px",
    lineHeight: "1.6",
    paddingRight: "20px",
  },

  arrow: {
    position: "absolute",
    right: "20px",
    bottom: "20px",
    color: "#1f6feb",
    fontSize: "19px",
    fontWeight: "700",
  },

  profileSection: {
    background: "#ffffff",
    border: "1px solid #e4e9f1",
    borderRadius: "18px",
    padding: "27px",
    marginBottom: "20px",
  },

  panelEyebrow: {
    margin: "0 0 6px",
    color: "#1f6feb",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.3px",
  },

  profileTitle: {
    margin: "0 0 22px",
    fontSize: "21px",
  },

  profileGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },

  profileItem: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "15px",
  },

  profileLabel: {
    display: "block",
    color: "#8793a6",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "6px",
  },

  profileValue: {
    color: "#263449",
    fontSize: "13px",
    wordBreak: "break-word",
  },

  activeStatus: {
    color: "#15803d",
    fontSize: "13px",
  },

  securityBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    padding: "18px",
    borderRadius: "14px",
    background: "#f0fdf4",
    border: "1px solid #dcfce7",
  },

  securityIcon: {
    width: "30px",
    height: "30px",
    minWidth: "30px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  securityTitle: {
    margin: "2px 0 5px",
    fontSize: "14px",
  },

  securityText: {
    margin: 0,
    color: "#527064",
    fontSize: "12px",
    lineHeight: "1.6",
  },

  footer: {
    textAlign: "center",
    padding: "0 20px 30px",
    color: "#94a3b8",
    fontSize: "11px",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f6f8fc",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  loader: {
    width: "34px",
    height: "34px",
    border: "4px solid #dbeafe",
    borderTop: "4px solid #1f6feb",
    borderRadius: "50%",
    marginBottom: "14px",
  },

  loadingText: {
    color: "#64748b",
    fontSize: "13px",
  },

  errorCard: {
    width: "90%",
    maxWidth: "450px",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0 15px 45px rgba(20,35,60,0.08)",
  },

  primaryButton: {
    marginTop: "15px",
    border: "none",
    background: "#1f6feb",
    color: "#ffffff",
    borderRadius: "9px",
    padding: "12px 20px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default ClientPortal;