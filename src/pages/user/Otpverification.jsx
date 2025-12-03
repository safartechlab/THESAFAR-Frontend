import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Baseurl } from "../../baseurl";
import { useDispatch } from "react-redux";
import { showToast } from "../../store/slice/toast_slice";

const OtpVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    const email = localStorage.getItem("resetEmail");

    if (!email) {
      dispatch(showToast({ message: "Email not found, please try again", type: "error" }));
      navigate("/forgot-password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${Baseurl}/user/verifyotp`, {
        email,
        otp: enteredOtp,
      });

      if (res.status === 200) {
        localStorage.setItem("resetOtp", enteredOtp); 
        dispatch(showToast({ message: "OTP verified successfully!", type: "success" }));
        navigate("/reset-password");
      }
    } catch (error) {
      dispatch(
        showToast({
          message: error.response?.data?.message || "Invalid OTP",
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
        <Col md={6} className="p-4 shadow rounded bg-white text-center">
          <h3 className="fw-bold mb-3">OTP Verification</h3>
          <p className="text-muted mb-4">
            Enter the 6-digit code sent to your email.
          </p>

          <div className="d-flex justify-content-between mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                className="form-control text-center mx-1"
                style={{
                  width: "50px",
                  height: "50px",
                  fontSize: "1.5rem",
                }}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            className="btn button-color w-100"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </Col>
      </Row>
    </Container>
  );
};

export default OtpVerification;
