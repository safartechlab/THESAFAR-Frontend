import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} className="p-4 shadow rounded bg-white text-center">
          <h2 className="text-success fw-bold mb-3">Password Reset Successful!</h2>
          <p className="text-muted mb-4">
            Your password has been updated. You can now log in with your new credentials.
          </p>
          <Link to="/signin" className="btn button-color w-100">
            Back to Login
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default SuccessPage;
