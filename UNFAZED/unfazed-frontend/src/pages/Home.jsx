import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.backgroundCircleOne}></div>
      <div style={styles.backgroundCircleTwo}></div>

      <main style={styles.container}>
        <div style={styles.logo}>U</div>

        <h1 style={styles.title}>UNFAZED</h1>

        <p style={styles.tagline}>
          A simple and secure space for better mental wellness.
        </p>

        <div style={styles.card}>
          <h2 style={styles.heading}>Welcome to Unfazed</h2>

          <p style={styles.description}>
            Choose how you want to continue
          </p>

          <div style={styles.buttons}>
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={styles.therapistButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 14px 30px rgba(15, 23, 42, 0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(15, 23, 42, 0.10)";
              }}
            >
              <span style={styles.buttonIcon}>👨‍⚕️</span>

              <span>
                <strong style={styles.buttonTitle}>Therapist Login</strong>
                <small style={styles.buttonText}>
                  Access your therapist dashboard
                </small>
              </span>

              <span style={styles.arrow}>→</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/client-login")}
              style={styles.clientButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 14px 30px rgba(15, 23, 42, 0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(15, 23, 42, 0.10)";
              }}
            >
              <span style={styles.buttonIcon}>👤</span>

              <span>
                <strong style={styles.buttonTitle}>Client Login</strong>
                <small style={styles.buttonText}>
                  Access your personal portal
                </small>
              </span>

              <span style={styles.arrow}>→</span>
            </button>
          </div>

          <div style={styles.divider}>
            <span></span>
            <p>UNFAZED</p>
            <span></span>
          </div>

          <p style={styles.footerText}>
            Your journey toward better wellbeing starts here.
          </p>
        </div>

        <p style={styles.copyright}>
          © 2026 Unfazed. All rights reserved.
        </p>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2f7 50%, #e8eef5 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 20px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "Inter, Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  backgroundCircleOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(99, 102, 241, 0.07)",
    top: "-180px",
    right: "-120px",
  },

  backgroundCircleTwo: {
    position: "absolute",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background: "rgba(14, 165, 233, 0.06)",
    bottom: "-170px",
    left: "-120px",
  },

  container: {
    width: "100%",
    maxWidth: "620px",
    position: "relative",
    zIndex: 2,
    textAlign: "center",
  },

  logo: {
    width: "68px",
    height: "68px",
    margin: "0 auto 16px",
    borderRadius: "20px",
    background: "#0f172a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "800",
    boxShadow: "0 15px 35px rgba(15, 23, 42, 0.18)",
  },

  title: {
    margin: "0",
    fontSize: "38px",
    letterSpacing: "5px",
    fontWeight: "800",
    color: "#0f172a",
  },

  tagline: {
    margin: "12px auto 30px",
    maxWidth: "480px",
    color: "#64748b",
    fontSize: "15px",
    lineHeight: "1.6",
  },

  card: {
    background: "rgba(255, 255, 255, 0.96)",
    border: "1px solid #e2e8f0",
    borderRadius: "28px",
    padding: "38px",
    boxShadow: "0 25px 70px rgba(15, 23, 42, 0.12)",
  },

  heading: {
    margin: "0",
    color: "#0f172a",
    fontSize: "26px",
    fontWeight: "750",
  },

  description: {
    margin: "8px 0 28px",
    color: "#64748b",
    fontSize: "14px",
  },

  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  therapistButton: {
    width: "100%",
    border: "1px solid #dbeafe",
    borderRadius: "18px",
    padding: "17px 18px",
    background: "#f8fafc",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.10)",
  },

  clientButton: {
    width: "100%",
    border: "1px solid #dbeafe",
    borderRadius: "18px",
    padding: "17px 18px",
    background: "#ffffff",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.10)",
  },

  buttonIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    flexShrink: 0,
  },

  buttonTitle: {
    display: "block",
    fontSize: "16px",
    marginBottom: "4px",
  },

  buttonText: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "400",
  },

  arrow: {
    marginLeft: "auto",
    fontSize: "23px",
    color: "#64748b",
    fontWeight: "500",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "30px 0 18px",
  },

  dividerLine: {
    flex: 1,
  },

  footerText: {
    margin: "0",
    color: "#94a3b8",
    fontSize: "13px",
  },

  copyright: {
    margin: "22px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },
};

export default Home;