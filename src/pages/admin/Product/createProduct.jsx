import { Container, Row, Col, Form, Button, Card, Image } from "react-bootstrap";
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

  return (
    <Container fluid className="p-0">
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col xs={2} md={1}>
          <LuShoppingBasket className="fs-1 text-primary" />
        </Col>
        <Col xs={10} md={11}>
          <h2 className="mb-0">Add Product</h2>
        </Col>
      </Row>

      <Card className="p-4 shadow-sm mb-4">
        <h5 className="mb-3">General Info</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Product Name</Form.Label>
            <Field
              as={Form.Control}
              type="text"
              name="productName"
              placeholder="Enter product name"
              isInvalid={touched.productName && errors.productName}
            />
            <ErrorMessage name="productName" component="div" className="text-danger small" />
          </Col>
          <Col md={6}>
            <Form.Label>Gender</Form.Label>
            <Field as={Form.Select} name="gender">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </Field>
            <ErrorMessage name="gender" component="div" className="text-danger small" />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Label>Description</Form.Label>
            <Field
              as={Form.Control}
              type="textarea"
              rows={3}
              name="description"
              placeholder="Enter product description"
              isInvalid={touched.description && errors.description}
            />
            <ErrorMessage name="description" component="div" className="text-danger small" />
          </Col>
        </Row>

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
            <ErrorMessage name="category" component="div" className="text-danger small" />
          </Col>
          <Col md={6}>
            <Form.Label>Subcategory</Form.Label>
            <Field as={Form.Select} name="subcategory">
              <option value="">Select subcategory</option>
              {subcategory
                ?.filter((sub) => sub.categoryID === values.category)
                .map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.subcategory}
                  </option>
                ))}
            </Field>
            <ErrorMessage name="subcategory" component="div" className="text-danger small" />
          </Col>
        </Row>
      </Card>

      {/* Sizes */}
      <Card className="p-4 shadow-sm mb-4">
        <Form.Check
          type="switch"
          id="has-sizes"
          label="Has Sizes?"
          checked={hassize}
          onChange={() => sethassize(!hassize)}
          className="mb-3"
        />

        {hassize ? (
          <FieldArray name="sizes">
            {({ push, remove }) => (
              <>
                {values.sizes.map((_, index) => (
                  <Row key={index} className="mb-2 align-items-end">
                    <Col md={3}>
                      <Form.Label>Size</Form.Label>
                      <Field as={Form.Select} name={`sizes[${index}].size`}>
                        <option value="">Select size</option>
                        {size?.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.size}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name={`sizes[${index}].size`} component="div" className="text-danger small" />
                    </Col>

                    <Col md={3}>
                      <Form.Label>Price</Form.Label>
                      <Field as={Form.Control} type="number" name={`sizes[${index}].price`} placeholder="Price" />
                      <ErrorMessage name={`sizes[${index}].price`} component="div" className="text-danger small" />
                    </Col>

                    <Col md={3}>
                      <Form.Label>Stock</Form.Label>
                      <Field as={Form.Control} type="number" name={`sizes[${index}].stock`} placeholder="Stock" />
                      <ErrorMessage name={`sizes[${index}].stock`} component="div" className="text-danger small" />
                    </Col>

                    <Col md={3}>
                      <Button variant="danger" type="button" onClick={() => remove(index)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button variant="success" type="button" onClick={() => push({ size: "", price: "", stock: "" })}>
                  + Add Size
                </Button>
              </>
            )}
          </FieldArray>
        ) : (
          <Row>
            <Col md={6}>
              <Form.Label>Price</Form.Label>
              <Field as={Form.Control} type="number" name="price" placeholder="Enter price" />
              <ErrorMessage name="price" component="div" className="text-danger small" />
            </Col>
            <Col md={6}>
              <Form.Label>Stock</Form.Label>
              <Field as={Form.Control} type="number" name="stock" placeholder="Enter stock" />
              <ErrorMessage name="stock" component="div" className="text-danger small" />
            </Col>
          </Row>
        )}
      </Card>

      {/* Discount */}
      <Card className="p-4 shadow-sm mb-4">
        <Row>
          <Col md={6}>
            <Form.Label>Discount</Form.Label>
            <Field as={Form.Control} type="number" name="discount" placeholder="Enter discount" />
            <ErrorMessage name="discount" component="div" className="text-danger small" />
          </Col>
          <Col md={6}>
            <Form.Label>Discount Type</Form.Label>
            <Field as={Form.Select} name="discountType">
              <option value="">Select type</option>
              <option value="Percentage">Percentage</option>
              <option value="Flat">Flat</option>
            </Field>
            <ErrorMessage name="discountType" component="div" className="text-danger small" />
          </Col>
        </Row>
      </Card>

      {/* Image Upload */}
      <Card className="p-4 shadow-sm mb-4">
        <Form.Label>Upload Images</Form.Label>
        <Form.Control type="file" multiple accept="image/*" onChange={handleimg} />
        <div className="d-flex flex-wrap mt-3 gap-2">
          {imgprev.map((img, i) => (
            <Card key={i} className="position-relative" style={{ width: "100px" }}>
              <Image src={img.src} thumbnail style={{ height: "80px", objectFit: "cover" }} />
              <Button
                variant="danger"
                size="sm"
                className="position-absolute top-0 end-0 p-1"
                onClick={() => {
                  setFieldValue("images", values.images?.filter((_, idx) => idx !== i));
                }}
              >
                ✖
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {/* Submit Button */}
      <div className="text-center mb-5">
        <Button type="submit" variant="primary" size="lg">
          Add Product
        </Button>
      </div>
    </Container>
  );
};

export default CreateProduct;
