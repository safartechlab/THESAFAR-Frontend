import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Row, Col, InputGroup, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getcategory } from "../../store/slice/category_slice";
import { LuUserRound, LuShoppingCart } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { clearauth } from "../../store/slice/authSlice";
import { FaRegHeart, FaSearch } from "react-icons/fa";
import "../../safar_css/user.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const userdetails = useSelector((state) => state.auth?.user);
  const auth = useSelector((state) => state.auth?.auth);
  const categories = useSelector((state) => state.category.categorylist);

  // Fetch categories
  useEffect(() => {
    dispatch(getcategory());
  }, [dispatch]);

  // 🔍 Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Use /categories route so CategoryPage can read params
      navigate(
        `/categories?query=${encodeURIComponent(
          searchTerm
        )}&category=${encodeURIComponent(selectedCategory)}`
      );
      setSearchTerm("");
    }
  };

  // 📂 Handle category change
  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCategory(selectedValue);

    if (selectedValue === "All") {
      // ✅ Navigate to home when 'All' selected
      navigate(`/`);
    } else {
      // ✅ Find selected category and go to its product listing
      const selectedCat = categories.find(
        (cat) => cat.categoryname === selectedValue
      );
      if (selectedCat) {
        navigate(
          `/categories?category=${selectedCat._id}&name=${encodeURIComponent(
            selectedCat.categoryname
          )}`
        );
      }
    }
  };

  // 🚪 Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    dispatch(clearauth());
    navigate("/Signin");
  };

  return (
    <Navbar expand="lg" className="header_color"  sticky="top">
      <Container
        fluid
        className="d-flex align-items-center justify-content-between"
      >
        {/* 🏷️ Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-3 tagesschrift-regular text-decoration-none font-color me-3"
        >
          THE SAFAR.store
        </Navbar.Brand>

        {/* 🔎 Category + Search bar */}
        <Col xs={12} md={6} lg={6}>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{
                  width: "auto",
                  maxWidth: "120px",
                  borderRight: "none",
                  backgroundColor: "transparent",
                  color: "black",
                }}
              >
                <option value="All">All</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat.categoryname}>
                    {cat.categoryname}
                  </option>
                ))}
              </Form.Select>

              <Form.Control
                type="text"
                placeholder="Search..."
                className="font-color"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: "transparent",
                  border: "1px solid #ccc",
                  borderLeft: "none",
                  color: "black",
                }}
              />
              <InputGroup.Text
                onClick={handleSearch}
                style={{
                  background: "transparent",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
          </Form>
        </Col>

        {/* 📑 Nav Links */}
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-center"
        >
          <Nav className="menu-links">
            <Link
              to="/about"
              className="px-3 py-2 text-decoration-none fw-bold font-color"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-decoration-none fw-bold font-color"
            >
              Contact
            </Link>
          </Nav>
        </Navbar.Collapse>

        {/* Divider */}
        <div className="header-divider mx-3"></div>

        {/* 👤 User / Wishlist / Cart */}
        <Row className="align-items-center">
          <Col className="singup">
            {!auth ? (
              <div className="position-relative">
                <LuUserRound className="fs-5 font-color" />
                <div className="login_sub header_color position-absolute">
                  <div className="d-flex flex-column text-start">
                    <Link
                      to="/Signin"
                      className="p-3 border-bottom font-color text-decoration-none"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/Signup"
                      className="p-3 border-bottom font-color text-decoration-none"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="position-relative">
                <div className="d-flex" style={{ cursor: "pointer" }}>
                  <span className="fw-bold me-2 text-truncate">
                    {userdetails?.username}
                  </span>
                </div>
                <div className="login_sub header_color position-absolute">
                  <div className="d-flex flex-column text-start">
                    <Link
                      to="/myaccount"
                      className="p-3 border-bottom font-color text-decoration-none"
                    >
                      My Account
                    </Link>
                    <Link
                      to="/myorders"
                      className="p-3 border-bottom font-color text-decoration-none"
                    >
                      My Orders
                    </Link>
                    <div
                      onClick={logout}
                      className="p-3 border-bottom font-color text-decoration-none"
                      style={{ cursor: "pointer" }}
                    >
                      Log Out
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Col>

          <Col>
            <Link to="/wishlist">
              <FaRegHeart className="fs-5 font-color" />
            </Link>
          </Col>
          <Col>
            <Link to="/cart">
              <LuShoppingCart className="fs-5 font-color" />
            </Link>
          </Col>

          <Col>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
