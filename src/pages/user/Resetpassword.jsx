import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Baseurl } from "../../baseurl";
import { useDispatch } from "react-redux";
import { showToast } from "../../store/slice/toast_slice";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting }) => {
    const email = localStorage.getItem("resetEmail");
    const otp = localStorage.getItem("resetOtp");

    if (!email || !otp) {
      dispatch(
        showToast({ message: "Invalid reset attempt", type: "error" })
      );
      navigate("/forgot-password");
      return;
    }

    try {
      const res = await axios.post(`${Baseurl}user/resetpassword`, {
        email,
        otp,
        password: values.password,
      });

      if (res.status === 200) {
        dispatch(
          showToast({
            message: "Password reset successfully!",
            type: "success",
          })
        );
        // ✅ Cleanup
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetOtp");

        navigate("/signin");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      dispatch(
        showToast({
          message:
            error.response?.data?.message ||
            "Failed to reset password. Try again.",
          type: "error",
        })
      );

      // ❌ Optional: if OTP expired or invalid, force user to restart flow
      if (
        error.response?.data?.message === "Invalid or expired OTP" ||
        error.response?.data?.message?.includes("expired")
      ) {
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetOtp");
        navigate("/forgot-password");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} className="p-4 shadow rounded bg-white">
          <h3 className="fw-bold mb-3 text-center">Reset Password</h3>
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <Field
                    name="password"
                    type="password"
                    placeholder="New Password"
                    className="form-control p-3 rounded-3"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                <div className="mb-3">
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="form-control p-3 rounded-3"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                <button
                  type="submit"
                  className="btn button-color w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
