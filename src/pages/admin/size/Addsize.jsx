import axios from 'axios';
import * as Yup from 'yup';
import { Baseurl } from '../../../baseurl';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../../store/slice/toast_slice';
import { getsize } from '../../../store/slice/Sizeslice';
import { Container, Row, Col, Card, Form as BootstrapForm } from 'react-bootstrap';
import { RiCustomSize } from "react-icons/ri";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect } from 'react';
import Getsize from './getsize';

const Addsize = () => {
  const dispatch = useDispatch();
  const sizeList = useSelector(state => state.size.sizelist);

  useEffect(() => {
    dispatch(getsize());
  }, [dispatch]);

  const validationSchema = Yup.object({
    size: Yup.string().required("Size name is required"),
  });

  const initialValues = {
    size: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const res = await axios.post(`${Baseurl}size/addsize`, values);
      if (res.status === 200) {
        dispatch(showToast({ message: res.data.message, type: 'success' }));
        dispatch(getsize());
        resetForm();
      } else {
        dispatch(showToast({ message: res.data.message, type: 'error' }));
      }
    } catch (error) {
      dispatch(showToast({
        message: error?.response?.data?.message || "Something went wrong",
        type: "error"
      }));
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col xs="auto">
          <RiCustomSize className="fs-1 text-primary" />
        </Col>
        <Col>
          <h2 className="mb-0">Size</h2>
        </Col>
      </Row>

      {/* Add Size Form */}
      <Card className="shadow-sm rounded border-0 mb-4">
        <Card.Body className="p-4">
          <h4 className="mb-4">Add Size</h4>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                <Row className="g-3 align-items-center">
                  {/* Size input */}
                  <Col xs={12} md={8}>
                    <Field
                      type="text"
                      name="size"
                      placeholder="Enter size name"
                      className="form-control shadow-sm"
                    />
                    <ErrorMessage
                      name="size"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </Col>

                  {/* Submit button */}
                  <Col xs={12} md={4}>
                    <button type="submit" className="btn btn-primary w-100 shadow-sm">
                      Add Size
                    </button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>

      {/* Existing Sizes */}
      <Card className="shadow-sm rounded border-0">
        <Card.Body className="p-3 overflow-auto">
          <Getsize />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Addsize;
