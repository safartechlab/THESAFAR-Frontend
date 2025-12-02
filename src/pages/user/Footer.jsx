import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { links } from "./Link";

const Footer = () => {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #1e3632, #15302a)",
        color: "#fff",
        padding: "60px 0 30px 0",
        borderTop: "3px solid #cde2db",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Container>
        <Row className="mb-5">
          {/* About */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5
              style={{
                color: "#cde2db",
                marginBottom: "20px",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              About Us
            </h5>
            <p style={{ color: "#ccc", lineHeight: "1.8", fontSize: "14px" }}>
              THE SAFAR.store is your one-stop online shopping destination, offering a wide range of categories including fashion, electronics, home essentials, lifestyle products, and more. Explore quality items at the best prices, delivered to your doorstep.
            </p>
            <div style={{ marginTop: "20px" }}>
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="me-3 text-decoration-none"
                    style={{
                      color: "#fff",
                      fontSize: "18px",
                      transition: "all 0.3s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#cde2db")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "#fff")}
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={2} className="mb-4 mb-md-0">
            <h5
              style={{
                color: "#cde2db",
                marginBottom: "20px",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Quick Links
            </h5>
            <ul className="list-unstyled">
              {links.map((linkItem, index) => (
                <li key={index} className="mb-2">
                  <Link
                    to={linkItem.path}
                    className="text-decoration-none"
                    style={{
                      color: "#ccc",
                      transition: "all 0.3s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#cde2db")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "#ccc")}
                  >
                    {linkItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Categories */}
          <Col md={2} className="mb-4 mb-md-0">
            <h5
              style={{
                color: "#cde2db",
                marginBottom: "20px",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Categories
            </h5>
            <ul className="list-unstyled">
              {["Fashion", "Electronics", "Watches", "Clothes"].map((cat, idx) => (
                <li key={idx} className="mb-2">
                  <Link
                    to={`/category/${cat.toLowerCase()}`}
                    className="text-decoration-none"
                    style={{ color: "#ccc", transition: "all 0.3s" }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#cde2db")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "#ccc")}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Newsletter & Contact */}
          <Col md={4}>
            <h5
              style={{
                color: "#cde2db",
                marginBottom: "20px",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              Newsletter
            </h5>
            <p style={{ color: "#ccc", fontSize: "14px" }}>
              Subscribe to receive the latest news and exclusive offers.
            </p>
            <Form className="d-flex mb-3 shadow-sm">
              <Form.Control
                type="email"
                placeholder="Email address"
                style={{
                  borderRadius: "30px 0 0 30px",
                  border: "none",
                  padding: "10px 15px",
                  outline: "none",
                }}
              />
              <Button
                type="submit"
                style={{
                  borderRadius: "0 30px 30px 0",
                  backgroundColor: "#cde2db",
                  border: "none",
                  color: "#1e3632",
                  fontWeight: "500",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#b8d8d2")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#cde2db")}
              >
                Subscribe
              </Button>
            </Form>
            <div style={{ color: "#ccc", marginTop: "20px", fontSize: "14px" }}>
              <p className="mb-2">
                <FaMapMarkerAlt className="me-2" /> 410, Adinath Arcade, Adajan - 395009
              </p>
              <p className="mb-2">
                <FaEnvelope className="me-2" /> thesafaronlinestore@gmail.com
              </p>
              <p className="mb-0">
                <FaPhone className="me-2" /> +91 99797-81975
              </p>
            </div>
          </Col>
        </Row>

        <hr style={{ borderColor: "#2c4a42", margin: "30px 0" }} />

        <Row className="align-items-center">
          <Col md={6} className="mb-3 mb-md-0">
            <p style={{ color: "#ccc", margin: 0, fontSize: "14px" }}>
              &copy; {new Date().getFullYear()} THE SAFAR.store. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p style={{ color: "#ccc", margin: 0, fontSize: "14px" }}>
              Designed with ❤️ by THE SAFARTECHLAB
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
