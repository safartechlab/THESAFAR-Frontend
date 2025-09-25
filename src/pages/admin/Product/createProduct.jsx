import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Field, FieldArray, ErrorMessage } from "formik";
import { LuShoppingBasket } from "react-icons/lu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getcategory } from "../../../store/slice/category_slice";
import { getsubcate } from "../../../store/slice/Subcategoryslice";
import { getsize } from "../../../store/slice/Sizeslice";

const CreateProduct = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  imgprev,
  handleimg,
  hassize,
  sethassize,
}) => {
  const dispatch = useDispatch();
  const category = useSelector((state) => state.category.categorylist);
  const subcategory = useSelector((state) => state.subcategory.subcategorylist);
  const size = useSelector((state) => state.size.sizelist);

  useEffect(() => {
    dispatch(getcategory());
    dispatch(getsubcate());
    dispatch(getsize());
  }, [dispatch]);

  // 👇 Watch subcategory and set hassize automatically
  useEffect(() => {
    if (values.subcategory) {
      const selectedSub = subcategory.find(
        (sub) => sub._id === values.subcategory
      );
      if (selectedSub) {
        sethassize(selectedSub.hasSize);

        // reset conflicting fields
        if (selectedSub.hasSize) {
          setFieldValue("price", "");
          setFieldValue("stock", "");
        } else {
          setFieldValue("sizes", []);
        }
      }
    }
  }, [values.subcategory, subcategory, sethassize, setFieldValue]);

  return (
    <Row className="mx-0 overFlow-hidden">
      {/* Header */}
      <Row className="align-items-center font-color mb-4">
        <Col xs={2} md={1}>
          <LuShoppingBasket className="fs-1" />
        </Col>
        <Col xs={10} md={11}>
          <h2 className="mb-0">Sub Category</h2>
        </Col>
      </Row>

      {/* Main Card */}
      <Container fluid className="p-4 overFlow-hidden">
        <Card className="p-4 shadow-sm sidebar-color">
          <h4 className="mb-3">Add Product</h4>

          {/* Product Name & Gender */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Product Name</Form.Label>
              <Field
                as={Form.Control}
                type="text"
                name="productName"
                placeholder="Enter product name"
              />
              <ErrorMessage
                name="productName"
                component="div"
                className="text-danger small"
              />
            </Col>
            <Col md={6}>
              <Form.Label>Gender</Form.Label>
              <Field as={Form.Select} name="gender">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Field>
              <ErrorMessage
                name="gender"
                component="div"
                className="text-danger small"
              />
            </Col>
          </Row>

          {/* Description */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Label>Description</Form.Label>
              <Field
                as="textarea"
                className="form-control"
                name="description"
                placeholder="Enter product description"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-danger small"
              />
            </Col>
          </Row>

          {/* Category & Subcategory */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Category</Form.Label>
              <Field as={Form.Select} name="category">
                <option value="">Select category</option>
                {category?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryname}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className="text-danger small"
              />
            </Col>

            <Col md={6}>
              <Form.Label>Subcategory</Form.Label>
              <Field as={Form.Select} name="subcategory">
                <option value="">Select subcategory</option>
                {subcategory
                  ?.filter((sub) => sub.categoryID === values.category) // 👈 filter by category
                  .map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.subcategory}
                    </option>
                  ))}
              </Field>
              <ErrorMessage
                name="subcategory"
                component="div"
                className="text-danger small"
              />
            </Col>
          </Row>

          {/* Sizes OR Price & Stock */}
          {hassize ? (
            <FieldArray name="sizes">
              {({ push, remove }) => (
                <>
                  {values.sizes.map((sizeObj, index) => (
                    <Row key={index} className="mb-2">
                      <Col md={3}>
                        <Field as={Form.Select} name={`sizes[${index}].size`}>
                          <option value="">Select size</option>
                          {size?.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.sizename}
                            </option>
                          ))}
                        </Field>
                      </Col>
                      <Col md={3}>
                        <Field
                          as={Form.Control}
                          type="number"
                          name={`sizes[${index}].price`}
                          placeholder="Price"
                        />
                      </Col>
                      <Col md={3}>
                        <Field
                          as={Form.Control}
                          type="number"
                          name={`sizes[${index}].stock`}
                          placeholder="Stock"
                        />
                      </Col>
                      <Col md={3}>
                        <Button
                          variant="danger"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    variant="success"
                    type="button"
                    onClick={() =>
                      push({ size: "", price: "", stock: "" })
                    }
                  >
                    + Add Size
                  </Button>
                </>
              )}
            </FieldArray>
          ) : (
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Price</Form.Label>
                <Field
                  as={Form.Control}
                  type="number"
                  name="price"
                  placeholder="Enter price"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-danger small"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Stock</Form.Label>
                <Field
                  as={Form.Control}
                  type="number"
                  name="stock"
                  placeholder="Enter stock"
                />
                <ErrorMessage
                  name="stock"
                  component="div"
                  className="text-danger small"
                />
              </Col>
            </Row>
          )}

          {/* Discount & Discount Type */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Discount</Form.Label>
              <Field
                as={Form.Control}
                type="number"
                name="discount"
                placeholder="Enter discount"
              />
              <ErrorMessage
                name="discount"
                component="div"
                className="text-danger small"
              />
            </Col>
            <Col md={6}>
              <Form.Label>Discount Type</Form.Label>
              <Field as={Form.Select} name="discountType">
                <option value="">Select</option>
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat</option>
              </Field>
              <ErrorMessage
                name="discountType"
                component="div"
                className="text-danger small"
              />
            </Col>
          </Row>

          {/* Image Upload */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Label>Upload Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleimg}
              />
              <div className="d-flex mt-2 flex-wrap">
                {imgprev.map((img, i) => (
                  <Card
                    key={i}
                    className="me-2 mb-2"
                    style={{ width: "100px" }}
                  >
                    <Card.Img
                      variant="top"
                      src={img.src}
                      alt={img.name}
                      style={{
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                    <Card.Body className="p-1 text-center">
                      <small>{img.name}</small>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>

          {/* Submit Button */}
          <Row>
            <Col className="text-center">
              <Button type="submit" variant="primary">
                Create Product
              </Button>
            </Col>
          </Row>
        </Card>
      </Container>
    </Row>
  );
};

export default CreateProduct;
