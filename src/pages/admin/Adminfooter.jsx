const Adminfooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto py-4"
      style={{
        background: "linear-gradient(90deg, #0f2d35, #13485a, #0f2d35)",
        borderTop: "2px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div className="container text-center text-light">

        <h6
          style={{
            fontWeight: 600,
            letterSpacing: "0.5px",
            marginBottom: "6px",
            fontSize: "1rem",
          }}
        >
          © {currentYear} <span style={{ color: "#35c9ff" }}>Admin Dashboard</span>
        </h6>

        <p
          style={{
            fontSize: "0.85rem",
            opacity: 0.85,
            margin: 0,
          }}
        >
          Designed & Developed by{" "}
          <span
            style={{
              color: "#4ed3ff",
              fontWeight: 600,
            }}
          >
            SAFAR TECHLAB LLP
          </span>
        </p>

        <div
          style={{
            marginTop: "10px",
            fontSize: "0.8rem",
            opacity: 0.7,
          }}
        >
          <span>Version 1.0.0</span>
        </div>

      </div>
    </footer>
  );
};

export default Adminfooter;
