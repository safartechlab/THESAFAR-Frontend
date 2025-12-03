import axios from "axios";
import { Formik, Form, FieldArray } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Baseurl } from "../../../baseurl";
import { showToast } from "../../../store/slice/toast_slice";
import { getproduct } from "../../../store/slice/productSlice";
import { Card, Button, Form as BForm, Row, Col, Image } from "react-bootstrap";

const Addproduct = () => {
  const [imgprev, setimgprev] = useState([]);
  const [selectedfile, setselectedfile] = useState([]);
  const [hassize, sethassize] = useState(false);
  const dispatch = useDispatch();

  const ProductSchema = Yup.object().shape({
    productName: Yup.string().required("Product name is required"),
    gender: Yup.string().oneOf(["Male", "Female", "Unisex"]).nullable(),
    description: Yup.string().required("Description is required"),
    review: Yup.string(),
    category: Yup.string().required("Category is required"),
    subcategory: Yup.string().required("Subcategory is required"),
    sizes: Yup.array().of(
      Yup.object().shape({
        size: Yup.string().required("Size is required"),
        price: Yup.number().min(0, "Price must be >= 0").required("Price is required"),
        stock: Yup.number().min(0, "Stock cannot be negative").required("Stock is required"),
      })
    ),
    price: Yup.number().when("sizes", {
      is: (sizes) => !sizes || sizes.length === 0,
      then: (schema) => schema.min(0).required("Price is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    stock: Yup.number().when("sizes", {
      is: (sizes) => !sizes || sizes.length === 0,
      then: (schema) => schema.min(0).required("Stock is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    discount: Yup.number().min(0, "Discount cannot be negative").default(0),
    discountType: Yup.string().oneOf(["Percentage", "Flat"]).nullable(),
  });

  const initialValues = {
    productName: "",
    gender: "",
    description: "",
    review: "",
    category: "",
    subcategory: "",
    sizes: [],
    price: "",
    stock: "",
    discount: 0,
    discountType: "",
  };

  const handleimg = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ src: reader.result, name: file.name });
          reader.readAsDataURL(file);
        })
    );

    Promise.all(previews).then((images) => {
      setimgprev(images);
      setselectedfile(files);
    });
  };

  const handlesumit = async (values, { resetForm }) => {
    try {
      const allFormData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "sizes") allFormData.append("sizes", JSON.stringify(value));
        else if (value !== "" && value !== null && value !== undefined) allFormData.append(key, value);
      });
      selectedfile.forEach((file) => allFormData.append("images", file));

      const res = await axios.post(`${Baseurl}/product/addproduct`, allFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
        resetForm();
        setimgprev([]);
        setselectedfile([]);
        dispatch(getproduct());
      } else {
        dispatch(showToast({ message: res.data.message, type: "error" }));
      }
    } catch (error) {
      dispatch(showToast({ message: error?.response?.data?.message || "Something went wrong", type: "error" }));
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <h4 className="fw-bold mb-4 text-center">Add New Product</h4>
      <Formik initialValues={initialValues} validationSchema={ProductSchema} onSubmit={handlesumit}>
        {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            {/* General Info */}
            <Card className="mb-4 p-3 border-light shadow-sm">
              <h5>General Info</h5>
              <BForm.Group className="mb-3">
                <BForm.Label>Product Name</BForm.Label>
                <BForm.Control
                  name="productName"
                  value={values.productName}
                  onChange={handleChange}
                  isInvalid={touched.productName && errors.productName}
                  placeholder="Enter product name"
                />
                <BForm.Control.Feedback type="invalid">{errors.productName}</BForm.Control.Feedback>
              </BForm.Group>

              <BForm.Group className="mb-3">
                <BForm.Label>Gender</BForm.Label>
                <BForm.Select name="gender" value={values.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </BForm.Select>
              </BForm.Group>

              <BForm.Group className="mb-3">
                <BForm.Label>Description</BForm.Label>
                <BForm.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  isInvalid={touched.description && errors.description}
                />
                <BForm.Control.Feedback type="invalid">{errors.description}</BForm.Control.Feedback>
              </BForm.Group>
            </Card>

            {/* Images */}
            <Card className="mb-4 p-3 border-light shadow-sm">
              <h5>Product Images</h5>
              <BForm.Group>
                <BForm.Label>Upload Images</BForm.Label>
                <BForm.Control type="file" multiple onChange={handleimg} />
              </BForm.Group>
              <div className="d-flex flex-wrap mt-3 gap-2">
                {imgprev.map((img, idx) => (
                  <div key={idx} className="position-relative">
                    <Image src={img.src} thumbnail width={100} height={100} />
                    <Button
                      size="sm"
                      variant="danger"
                      className="position-absolute top-0 end-0 p-1"
                      onClick={() => {
                        setimgprev(imgprev.filter((_, i) => i !== idx));
                        setselectedfile(selectedfile.filter((_, i) => i !== idx));
                      }}
                    >
                      ✖
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Sizes */}
            <Card className="mb-4 p-3 border-light shadow-sm">
              <BForm.Check
                type="switch"
                label="Has Sizes?"
                checked={hassize}
                onChange={() => sethassize(!hassize)}
              />

              {hassize ? (
                <FieldArray
                  name="sizes"
                  render={(arrayHelpers) => (
                    <div>
                      {values.sizes.map((size, index) => (
                        <Row key={index} className="align-items-end mb-2">
                          <Col md={4}>
                            <BForm.Group>
                              <BForm.Label>Size</BForm.Label>
                              <BForm.Control
                                name={`sizes[${index}].size`}
                                value={values.sizes[index].size}
                                onChange={handleChange}
                                isInvalid={errors.sizes?.[index]?.size && touched.sizes?.[index]?.size}
                              />
                            </BForm.Group>
                          </Col>
                          <Col md={3}>
                            <BForm.Group>
                              <BForm.Label>Price</BForm.Label>
                              <BForm.Control
                                type="number"
                                name={`sizes[${index}].price`}
                                value={values.sizes[index].price}
                                onChange={handleChange}
                                isInvalid={errors.sizes?.[index]?.price && touched.sizes?.[index]?.price}
                              />
                            </BForm.Group>
                          </Col>
                          <Col md={3}>
                            <BForm.Group>
                              <BForm.Label>Stock</BForm.Label>
                              <BForm.Control
                                type="number"
                                name={`sizes[${index}].stock`}
                                value={values.sizes[index].stock}
                                onChange={handleChange}
                                isInvalid={errors.sizes?.[index]?.stock && touched.sizes?.[index]?.stock}
                              />
                            </BForm.Group>
                          </Col>
                          <Col md={2}>
                            <Button variant="danger" onClick={() => arrayHelpers.remove(index)}>
                              ✖
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button variant="primary" onClick={() => arrayHelpers.push({ size: "", price: "", stock: "" })}>
                        + Add Size
                      </Button>
                    </div>
                  )}
                />
              ) : (
                <Row className="mt-3">
                  <Col md={6}>
                    <BForm.Group>
                      <BForm.Label>Price</BForm.Label>
                      <BForm.Control type="number" name="price" value={values.price} onChange={handleChange} />
                    </BForm.Group>
                  </Col>
                  <Col md={6}>
                    <BForm.Group>
                      <BForm.Label>Stock</BForm.Label>
                      <BForm.Control type="number" name="stock" value={values.stock} onChange={handleChange} />
                    </BForm.Group>
                  </Col>
                </Row>
              )}
            </Card>

            {/* Discount */}
            <Card className="mb-4 p-3 border-light shadow-sm">
              <Row>
                <Col md={6}>
                  <BForm.Group>
                    <BForm.Label>Discount</BForm.Label>
                    <BForm.Control type="number" name="discount" value={values.discount} onChange={handleChange} />
                  </BForm.Group>
                </Col>
                <Col md={6}>
                  <BForm.Group>
                    <BForm.Label>Discount Type</BForm.Label>
                    <BForm.Select name="discountType" value={values.discountType} onChange={handleChange}>
                      <option value="">Select Type</option>
                      <option value="Percentage">Percentage</option>
                      <option value="Flat">Flat</option>
                    </BForm.Select>
                  </BForm.Group>
                </Col>
              </Row>
            </Card>

            <div className="text-center">
              <Button type="submit" variant="success" size="lg">
                Add Product
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default Addproduct;
