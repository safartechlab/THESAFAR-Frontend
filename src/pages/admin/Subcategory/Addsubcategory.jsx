import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Baseurl } from "../../../baseurl";
import { showToast } from "../../../store/slice/toast_slice";
import { getsubcate } from "../../../store/slice/Subcategoryslice";
import { Container, Row, Col, Form as BootstrapForm, Card } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TbCategory } from "react-icons/tb";
import { useEffect } from "react";
import { getcategory } from "../../../store/slice/category_slice";
import Getsubcategory from "./getsubcategory";
import { getsize } from "../../../store/slice/Sizeslice";
import { MultiSelect } from "primereact/multiselect";

const Addsubcategory = () => {
  const dispatch = useDispatch();
  const category = useSelector((state) => state.category.categorylist);
  const size = useSelector((state) => state.size.sizelist);

  useEffect(() => {
    dispatch(getsize());
    dispatch(getcategory());
  }, [dispatch]);

  const validationSchema = Yup.object({
    subcategory: Yup.string().required("Subcategory name is required"),
    category: Yup.string().required("Category is required"),
    sizes: Yup.array().of(Yup.string().optional()),
  });

  const initialValues = {
    subcategory: "",
    category: "",
    sizes: [],
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const res = await axios.post(`${Baseurl}/subcategory/addsubcategory`, values);
      if (res.status === 200) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
        dispatch(getsubcate());
        resetForm();
      } else {
        dispatch(showToast({ message: res.data.message, type: "error" }));
      }
    } catch (error) {
      dispatch(
        showToast({
          message: error?.response?.data?.message || "Something went wrong",
          type: "error",
        })
      );
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col xs="auto">
          <TbCategory className="fs-1 text-primary" />
        </Col>
        <Col>
          <h2 className="mb-0">Sub Category</h2>
        </Col>
      </Row>

      {/* Add Subcategory Form */}
      <Card className="shadow-sm rounded border-0">
        <Card.Body className="p-4">
          <h4 className="mb-4">Add Sub Category</h4>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Row className="g-3">
                  {/* Subcategory Name */}
                  <Col xs={12} md={6}>
                    <Field
                      type="text"
                      name="subcategory"
                      placeholder="Enter Subcategory name"
                      className="form-control shadow-sm"
                    />
                    <ErrorMessage
                      name="subcategory"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </Col>

                  {/* Category Dropdown */}
                  <Col xs={12} md={6}>
                    <Field
                      name="category"
                      as={BootstrapForm.Select}
                      className="form-select shadow-sm"
                    >
                      <option value="">Select Category</option>
                      {category.map((cate) => (
                        <option key={cate._id} value={cate._id}>
                          {cate.categoryname}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </Col>
                </Row>

                {/* Sizes MultiSelect */}
                <Row className="mt-3">
                  <Col xs={12} md={6}>
                    <MultiSelect
                      value={values.sizes}
                      options={size.map((s) => ({ label: s.size, value: s._id }))}
                      onChange={(e) => setFieldValue("sizes", e.value)}
                      placeholder="Select Sizes"
                      display="chip"
                      className="w-100 shadow-sm"
                      panelClassName="shadow-lg"
                    />
                    <ErrorMessage
                      name="sizes"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </Col>
                </Row>

                {/* Submit Button */}
                <Row className="mt-4">
                  <Col className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary w-50 shadow-sm">
                      Add SubCategory
                    </button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>

      {/* Existing Subcategories */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-3 overflow-auto">
              <Getsubcategory />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Addsubcategory;
