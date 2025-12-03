import { Formik, Form, Field, ErrorMessage } from "formik";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../../store/slice/toast_slice";
import * as yup from "yup";
import axios from "axios";
import { Baseurl } from "../../baseurl";
import { useDispatch } from "react-redux";

// ✅ Validation Schema
const validationSchema = yup.object().shape({
  username: yup.string().required("Full Name is required."),
  email: yup.string().email("Invalid Email").required("Email is required."),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters.")
    .required("Password is required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required."),
  gender: yup.string().required("Please select gender."),
  usertype: yup.string().required(),
});

// ✅ Initial Values
const initialvalue = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  usertype: "user", // default
};

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
  // ✅ Submit Function
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { confirmPassword, ...payload } = values;

      const res = await axios.post(`${Baseurl}/user/signup`, payload);
        console.log(res.status);
        
      if (res.status) {
        dispatch(showToast({message:res.data.message,type:'success'}))
        resetForm();
        navigate("/Signin");
      } else {
        dispatch(showToast({message:res.data.message,type:'error'}))
        // alert(res.data.data?.message || "Signup failed!");
      }
    } catch (error) {
      dispatch(showToast({message:error.response?.data?.message,type:'error'}))
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header Section */}
      <Row xs={12} className="mx-0" style={{ backgroundColor: "#fffbf5ff" }}>
        <Container className="text-center mt-5 mb-4">
          <Row>
            <Col>
              <h1 className="fw-bold fs-2 font-color">Create Your Account</h1>
              <p className="fs-6 text-muted mt-2">
                Join us today! Sign up and enjoy personalized features,
                exclusive offers, and faster checkout.
              </p>
            </Col>
          </Row>
        </Container>
        {/* Signup Card */}
        <Container className="mb-5">
          <Row className="gy-4 shadow-lg border rounded-4 p-4 bg-white align-items-center">
            {/* Left Column - Form */}
            <Col xs={12} md={6} className="p-4 border-md-end border-end">
              <Formik initialValues={initialvalue}validationSchema={validationSchema}onSubmit={handleSubmit}>
                <Form className="px-5">
                  {/* Username */}
                  <div className="mb-3">
                    <Field name="username"type="text"placeholder="Full Name *"className="form-control p-3 rounded-3 shadow-sm"/>
                    <ErrorMessage name="username" component="div" className="text-danger mt-1 small"/>
                  </div>
                  {/* Email */}
                  <div className="mb-3">
                    <Field name="email"type="email"placeholder="Email Address *"className="form-control p-3 rounded-3 shadow-sm"/>
                    <ErrorMessage name="email"component="div"className="text-danger mt-1 small"/>
                  </div>
                  {/* Password */}
                  <div className="mb-3">
                    <Field name="password"type="password"placeholder="Password *"className="form-control p-3 rounded-3 shadow-sm"/>
                    <ErrorMessage name="password"component="div"className="text-danger mt-1 small"/>
                  </div>
                  {/* Confirm Password */}
                  <div className="mb-3">
                    <Field name="confirmPassword" type="password" placeholder="Confirm Password *"className="form-control p-3 rounded-3 shadow-sm"/>
                    <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-1 small"/>
                  </div>
                  {/* Gender */}
                  <div className="mb-3">
                    <label className="fw-semibold mb-2">Gender</label>
                    <div className="d-flex gap-3">
                      <label><Field type="radio" name="gender" value="male" /> Male</label>
                      <label><Field type="radio" name="gender" value="female" /> Female</label>
                      <label><Field type="radio" name="gender" value="other" /> Other</label>
                    </div>
                    <ErrorMessage name="gender" component="div" className="text-danger mt-1 small"/>
                  </div>
                  {/* Usertype (hidden, default = user) */}
                  <Field type="hidden" name="usertype" />
                  {/* Submit */}
                  <button type="submit" className="btn button-color w-100 py-2 fw-bold rounded-3 shadow-sm">Sign Up</button>
                </Form>
              </Formik>
            </Col>
            {/* Right Column - Sign In */}
            <Col xs={12} md={6} className="text-center p-4">
              <div className="px-5">
                <h4 className="fw-bold mb-3">Already have an account?</h4>
                <p className="text-muted mb-4">
                  Log in to manage your orders, save your favorites, and enjoy a
                  seamless shopping experience.
                </p>
                <Link to="/Signin" className="btn w-100 py-2 button-color fw-bold rounded-3 mt-4 shadow-sm">Log In</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </Row>
    </>
  );
};

export default Signup;
