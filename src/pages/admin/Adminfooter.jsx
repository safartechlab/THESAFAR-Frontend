// import React from "react";   

const Adminfooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-dark text-light py-3 mt-auto shadow-sm"
      style={{ borderTop: "3px solid #dfdfe9ff" }}
    >
      <div className="container text-center">
        <p className="mb-1 fw-semibold">
          © {currentYear} <span className="text-primary">Admin Dashboard</span>. All Rights Reserved.
        </p>
        <small className="text-muted">
          Designed & Developed by <span className="text-info">SAFAR TECHLAB LLP</span>
        </small>
      </div>
    </footer>
  );
};

export default Adminfooter;
