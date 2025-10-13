import { Formik, Form, Field, ErrorMessage } from "formik";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import { Baseurl } from "../../baseurl";
import { showToast } from "../../store/slice/toast_slice";
import { useDispatch } from "react-redux";
import { initiallogin } from "../../store/slice/authSlice";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password length at least 6 characters.")
    .required("Password is required."),
});

const initialvalue = {
  email: "",
  password: "",
};

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---------------- Login ----------------
  const handlesumit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(`${Baseurl}user/login`, values);

      if (res.status === 200) {
        dispatch(initiallogin(res.data.data));

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userID", res.data.userID || res.data.userId);

        dispatch(showToast({ message: res.data.message, type: "success" }));

        if (res.data.usertype === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        dispatch(showToast({ message: res.data.message, type: "error" }));
      }
    } catch (error) {
      console.error("Login Error:", error);
      dispatch(
        showToast({
          message: error.response?.data?.message || "Login failed",
          type: "error",
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header Section */}
      <Row xs={12} className="mx-0" style={{ backgroundColor: "#cde2db" }}>
        <Container className="text-center mt-5 mb-4">
          <Row>
            <Col>
              <h1 className="fw-bold fs-2 fs-md-1 font-color">
                Welcome back! Sign in
              </h1>
              <p className="fs-6 text-muted mt-2">
                Access your account to enjoy personalized features, faster
                checkout, and order tracking.
              </p>
            </Col>
          </Row>
        </Container>

        {/* Sign In Card */}
        <Container className="mb-5">
          <Row className="gy-4 shadow-lg border rounded-4 p-4 bg-white align-items-center">
            {/* Left Column - Form */}
            <Col xs={12} md={6} className="p-4 border-md-end border-end">
              <Formik
                initialValues={initialvalue}
                validationSchema={validationSchema}
                onSubmit={handlesumit}
              >
                <Form className="px-5">
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
                    <div className="px-1">
                      <input type="checkbox" id="remember" className="me-2" />
                      <label htmlFor="remember" className="small text-muted">
                        Keep me logged in
                      </label>
                    </div>
                    <div>
                      <Link
                        to="/forgot-password"
                        className="small fw-semibold text-primary text-decoration-none"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn button-color w-100 py-2 fw-bold rounded-3 shadow-sm"
                  >
                    Log In
                  </button>
                </Form>
              </Formik>
            </Col>

            {/* Right Column - Sign Up */}
            <Col xs={12} md={6} className="text-center p-4">
              <div className="px-5">
                <h4 className="fw-bold mb-3"> Don't have an account?</h4>
                <p className="text-muted mb-4">
                  Don’t miss out on the best deals! By Signing up, you’ll be the
                  first to know about flash sales, seasonal discounts, and new
                  collections. Start your journey with us and experience a
                  smarter, more personalized shopping experience.
                  <span className="fw-bold"> - Register Now and Explore</span>
                </p>
                <Link
                  to="/Signup"
                  className="btn w-100 py-2 button-color fw-bold rounded-3 mt-4 shadow-sm"
                >
                  Create Account
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </Row>
    </>
  );
};

export default Signin;
