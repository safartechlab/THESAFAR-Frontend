import { Col, Row } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import "./page";
import { adminpages } from "./page";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { BsListNested } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setsidebar } from "../../store/slice/Adminmainslice";

const Sidebar = () => {
  const [openindex, setopenindex] = useState("");
  const show = useSelector((state) => state.sidebar.sidebarbutton);
  const dispatch = useDispatch();
  const location = useLocation();

  const hanldeclose = () => {
    dispatch(setsidebar());
  };

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "auto",
        background: "linear-gradient(180deg, #0f2d35, #13485a, #0f2d35)",
        borderRight: "2px solid rgba(255,255,255,0.1)",
        padding: "20px 0",
        boxShadow: "3px 0 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Logo Row */}
      <Row className="py-2 px-3 d-flex align-items-center">
        <Col>
          <Navbar.Brand
            as={Link}
            to="/admin"
            className="fw-bold fs-3 text-decoration-none"
            style={{
              color: "#fdffffff",
              letterSpacing: "1px",
              textShadow: "0px 0px 10px rgba(78,211,255,0.4)",
            }}
          >
            THE SAFAR.store
          </Navbar.Brand>
        </Col>

        {/* Toggle Button (Mobile Only) */}
        <Col xs={3} className="d-lg-none text-end">
          <button
            className="border-0 bg-transparent"
            onClick={hanldeclose}
          >
            <BsListNested className="fs-3 text-light" />
          </button>
        </Col>
      </Row>

      <hr style={{ borderColor: "rgba(255,255,255,0.15)" }} />

      {/* Menu Items */}
      <ul className="list-unstyled mt-4 px-3">
        {adminpages.map((icon, index) => {
          const isActive = location.pathname === icon.path;

          return (
            <li key={index} className="mb-2">
              <Link
                to={icon.path}
                className="d-flex align-items-center gap-3 text-decoration-none sidebar-item"
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  color: isActive ? "#4ed3ff" : "#e5e5e5",
                  background: isActive
                    ? "rgba(78, 211, 255, 0.12)"
                    : "transparent",
                  fontSize: "18px",
                  transition: "0.2s",
                  boxShadow: isActive
                    ? "0 0 12px rgba(78, 211, 255, 0.3)"
                    : "none",
                }}
              >
                <span
                  style={{
                    fontSize: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isActive ? "#4ed3ff" : "#cfd9df",
                    textShadow: isActive
                      ? "0px 0px 12px rgba(78,211,255,0.7)"
                      : "none",
                  }}
                >
                  <icon.icon />
                </span>

                <span>{icon.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <style>{`
        .sidebar-item:hover {
          background: rgba(255,255,255,0.08) !important;
          transform: translateX(5px);
          color: #4ed3ff !important;
        }
        .sidebar-item:hover span {
          color: #4ed3ff !important;
          text-shadow: 0px 0px 10px rgba(78,211,255,0.4);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
