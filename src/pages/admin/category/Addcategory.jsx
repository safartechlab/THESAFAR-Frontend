import { useState } from "react";
import { Row, Container, Col } from "react-bootstrap";
import axios from "axios";
import { Baseurl } from "../../../baseurl";
import { useDispatch } from "react-redux";
import { showToast } from "../../../store/slice/toast_slice";
import { TbCategory } from "react-icons/tb";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getcategory, setcategory } from "../../../store/slice/category_slice";
import Getcategory from "./getcategory";

const Addcategory = () => {
  const [imgprev, setImgprev] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    categoryname: Yup.string().required("Category name is required"),
  });

  const handleImg = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgprev({ src: reader.result, name: file.name });
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
    setFieldValue("categoryimage", file);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formdata = new FormData();
      formdata.append("categoryname", values.categoryname);
      if (selectedFile) formdata.append("categoryimage", selectedFile);

      const res = await axios.post(`${Baseurl}/category/addcategory`, formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
        dispatch(setcategory());
        dispatch(getcategory());
        resetForm();
        setImgprev(null);
        setSelectedFile(null);
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
          <h2 className="mb-0">Category</h2>
        </Col>
      </Row>

      {/* Add Category Form */}
      <Container className="p-4 rounded shadow-sm bg-white">
        <h4 className="mb-4">Add Category</h4>
        <Formik
          initialValues={{ categoryname: "", categoryimage: null }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <Row className="g-3 align-items-center">
                {/* Category Name */}
                <Col xs={12} md={6}>
                  <Field
                    type="text"
                    name="categoryname"
                    placeholder="Enter category name"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="categoryname"
                    component="div"
                    className="text-danger mt-1"
                  />
                </Col>

                {/* Image Upload */}
                <Col xs={12} md={6}>
                  <Field name="categoryimage">
                    {({ form }) => (
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => handleImg(e, form.setFieldValue)}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="categoryimage"
                    component="div"
                    className="text-danger mt-1"
                  />
                </Col>
              </Row>

              {/* Image Preview */}
              {imgprev && (
                <div className="mt-3 text-center">
                  <img
                    src={imgprev.src}
                    alt="preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px" }}
                  />
                  <p className="mt-2">{imgprev.name}</p>
                </div>
              )}

              <Row className="mt-3">
                <Col className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary w-50">
                    Add Category
                  </button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>

        {/* Existing Categories */}
        <Row className="mt-4">
          <Col>
            <div className="border rounded p-3 overflow-auto">
              <Getcategory />
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Addcategory;
