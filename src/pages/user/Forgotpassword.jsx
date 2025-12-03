import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Baseurl } from "../../baseurl"; // ✅ your backend URL
import { useDispatch } from "react-redux";
import { showToast } from "../../store/slice/toast_slice";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("Email is required"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post(`${Baseurl}user/forgotpassword`, {
        email: values.email,
      });

      if (res.status === 200) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
        localStorage.setItem("resetEmail", values.email);
        navigate("/otpverify");
      }
    } catch (error) {
      dispatch(
        showToast({
          message: error.response?.data?.message || "Failed to send OTP",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} className="p-4 shadow rounded bg-white">
          <h3 className="fw-bold mb-3 text-center">Forgot Password</h3>
          <p className="text-muted text-center mb-4">
            Enter your registered email and we’ll send you a verification code.
          </p>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="mb-3">
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="form-control p-3 rounded-3"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger small"
                />
              </div>
              <button
                type="submit"
                className="btn button-color w-100"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </Form>
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
