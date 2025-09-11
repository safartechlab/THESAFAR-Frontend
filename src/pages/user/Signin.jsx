import { Formik, Form, Field, ErrorMessage } from "formik";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password length at least 6 characters.")
    .required("Password is required."),
});

const Signin = () => {
  const initialvalue = {
    email: "",
    password: "",
  };

  return (
    <>
      {/* Header Section */}
      <Container className="text-center mt-5 mb-4">
        <Row>
          <Col>
            <h1 className="fw-bold fs-2 fs-md-1 text-dark">
              Sign In <br /> To Your Account
            </h1>
            <p className="fs-6 text-muted mt-2">
              Access your account to enjoy personalized features, faster checkout,
              and order tracking.
            </p>
          </Col>
        </Row>
      </Container>

      {/* Sign In Card */}
      <Container className="mb-5">
        <Row className="gy-4 shadow-lg border rounded-4 p-4 bg-white align-items-center">
          {/* Left Column - Form */}
          <Col xs={12} md={6} className="p-4 border-md-end">
            <Formik initialValues={initialvalue} validationSchema={validationSchema}>
              <Form>
                {/* Email */}
                <div className="mb-4">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email Address *"
                    className="form-control p-3 rounded-3 shadow-sm"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger mt-1 small"
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password *"
                    className="form-control p-3 rounded-3 shadow-sm"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger mt-1 small"
                  />
                </div>

                {/* Remember & Forgot */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <input type="checkbox" id="remember" className="me-2" />
                    <label htmlFor="remember" className="small text-muted">
                      Keep me logged in
                    </label>
                  </div>
                  <Link to="/forgot" className="small fw-semibold text-primary text-decoration-none">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-dark w-100 py-2 fw-bold rounded-3 shadow-sm"
                  style={{ background: "#133547" }}
                >
                  Log In
                </button>
              </Form>
            </Formik>
          </Col>

          {/* Right Column - Sign Up */}
          <Col xs={12} md={6} className="text-center p-4">
            <h4 className="fw-bold mb-3">Don't have an account?</h4>
            <p className="text-muted mb-4">
              Add items to your wishlist, get personalized recommendations, and
              track your orders — register now!
            </p>
            <Link
              to="/Signup"
              className="btn w-100 py-2 fw-bold rounded-3 shadow-sm"
              style={{ background: "#fdf4e5", color: "#133547" }}
            >
              Create Account
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Signin;
