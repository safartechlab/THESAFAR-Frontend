import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Col, Container, Row, Modal, Button } from "react-bootstrap";
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
        localStorage.setItem("usertype", res.data.usertype);

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

  // ---------------- Forgot Password Flow ----------------
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpToken, setOtpToken] = useState("");

  // --- Send OTP ---
  const emailValidation = yup.object().shape({
    email: yup.string().email("Invalid Email").required("Email is required"),
  });

  const handleSendOtp = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await axios.post(`${Baseurl}user/forgotpassword`, {
        email: values.email,
      });

      if (res.data.success) {
        dispatch(showToast({ message: "OTP sent to email", type: "success" }));
        setUserEmail(values.email);
        setOtpToken(res.data.otpToken || "");

        // Close email modal and open OTP modal
        setShowEmailModal(false);
        setTimeout(() => setShowOtpModal(true), 300);
        resetForm();
      } else {
        dispatch(showToast({ message: res.data.message, type: "error" }));
      }
    } catch (error) {
      dispatch(
        showToast({
          message: error.response?.data?.message || "Failed to send OTP",
          type: "error",
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --- Verify OTP ---
  const otpValidation = yup.object().shape({
    otp: yup
      .string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  const handleVerifyOtp = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await axios.post(`${Baseurl}user/verify-otp`, {
        email: userEmail,
        otp: values.otp,
        otpToken,
      });

      if (res.data.success) {
        dispatch(showToast({ message: "OTP verified", type: "success" }));

        // Close OTP modal and open Reset Password modal
        setShowOtpModal(false);
        setTimeout(() => setShowResetModal(true), 300);
        resetForm();
      } else {
        dispatch(showToast({ message: res.data.message, type: "error" }));
      }
    } catch (error) {
      dispatch(
        showToast({
          message: error.response?.data?.message || "OTP verification failed",
          type: "error",
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --- Reset Password ---
  const resetValidation = yup.object().shape({
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  });

  const handleResetPassword = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await axios.post(`${Baseurl}user/resetpassword`, {
        email: userEmail,
        password: values.password,
      });

      if (res.data.success) {
        dispatch(
          showToast({ message: "Password reset successfully", type: "success" })
        );

        // Close reset password modal
        setShowResetModal(false);
        resetForm();
      } else {
        dispatch(showToast({ message: res.data.message, type: "error" }));
      }
    } catch (error) {
      dispatch(
        showToast({
          message: error.response?.data?.message || "Reset failed",
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
                    <span
                      onClick={() => setShowEmailModal(true)}
                      className="small fw-semibold text-primary text-decoration-none"
                      style={{ cursor: "pointer" }}
                    >
                      Forgot Password?
                    </span>
                  </div>

                  {/* Submit */}
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

      {/* -------------------- EMAIL MODAL -------------------- */}
      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={emailValidation}
            onSubmit={handleSendOtp}
          >
            <Form>
              <div className="mb-3">
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="form-control"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger small"
                />
              </div>
              <Button type="submit" className="w-100">
                Send OTP
              </Button>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>

      {/* -------------------- OTP MODAL -------------------- */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={otpValidation}
            onSubmit={handleVerifyOtp}
          >
            <Form>
              <div className="mb-3">
                <Field
                  type="text"
                  name="otp"
                  placeholder="6-digit OTP"
                  className="form-control"
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-danger small"
                />
              </div>
              <Button type="submit" className="w-100">
                Verify OTP
              </Button>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>

      {/* -------------------- RESET PASSWORD MODAL -------------------- */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={resetValidation}
            onSubmit={handleResetPassword}
          >
            <Form>
              <div className="mb-3">
                <Field
                  type="password"
                  name="password"
                  placeholder="New Password"
                  className="form-control"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger small"
                />
              </div>
              <div className="mb-3">
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="form-control"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-danger small"
                />
              </div>
              <Button type="submit" className="w-100">
                Reset Password
              </Button>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Signin;
