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
        backgroundColor: "#111",
        color: "#fff",
        padding: "60px 0 30px 0",
        borderTop: "3px solid #cde2db",
      }}
    >
      <Container>
        <Row className="mb-5">
          {/* About */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 style={{ color: "#cde2db", marginBottom: "20px" }}>About Us</h5>
            <p style={{ color: "#aaa", lineHeight: "1.8" }}>
              THE SAFAR.store is your one-stop online shopping destination, offering a wide range of categories including fashion, electronics, home essentials, lifestyle products, and more. Explore quality items at the best prices, all delivered right to your doorstep.
            </p>
            <div style={{ marginTop: "20px" }}>
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="me-3 text-decoration-none"
                    style={{
                      color: "#cde2db",
                      fontSize: "18px",
                      transition: "0.3s",
                    }}
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={2} className="mb-4 mb-md-0">
            <h5 style={{ color: "#cde2db", marginBottom: "20px" }}>Quick Links</h5>
            <ul className="list-unstyled">
              {links.map((linkItem, index) => (
                <li key={index} className="mb-2">
                  <Link
                    to={linkItem.path}
                    className="text-decoration-none"
                    style={{ color: "#aaa", transition: "0.3s" }}
                  >
                    {linkItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Categories */}
          <Col md={2} className="mb-4 mb-md-0">
            <h5 style={{ color: "#cde2db", marginBottom: "20px" }}>Categories</h5>
            <ul className="list-unstyled">
              {["Fruits", "Vegetables", "Snacks", "Beverages"].map((cat, idx) => (
                <li key={idx} className="mb-2">
                  <Link
                    to={`/category/${cat.toLowerCase()}`}
                    className="text-decoration-none"
                    style={{ color: "#aaa", transition: "0.3s" }}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Newsletter & Contact */}
          <Col md={4}>
            <h5 style={{ color: "#cde2db", marginBottom: "20px" }}>Newsletter</h5>
            <p style={{ color: "#aaa" }}>
              Subscribe to receive the latest news and exclusive offers.
            </p>
            <Form className="d-flex mb-3">
              <Form.Control
                type="email"
                placeholder="Email address"
                style={{
                  borderRadius: "30px 0 0 30px",
                  border: "none",
                  padding: "10px 15px",
                }}
              />
              <Button
                type="submit"
                style={{
                  borderRadius: "0 30px 30px 0",
                  backgroundColor: "#cde2db",
                  border: "none",
                  color: "#1e3632",
                }}
              >
                Subscribe
              </Button>
            </Form>
            <div style={{ color: "#aaa", marginTop: "20px" }}>
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

        <hr style={{ borderColor: "#333", margin: "30px 0" }} />

        <Row className="align-items-center">
          <Col md={6} className="mb-3 mb-md-0">
            <p style={{ color: "#aaa", margin: 0 }}>
              &copy; {new Date().getFullYear()} THE SAFAR.store. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p style={{ color: "#aaa", margin: 0 }}>
              Designed with ❤️ by THE SAFAR Team
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
