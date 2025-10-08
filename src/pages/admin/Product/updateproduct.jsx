import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Baseurl } from "../../../baseurl";
import { showToast } from "../../../store/slice/toast_slice";
import { getproduct, colsseupdate } from "../../../store/slice/productSlice";
import { getcategory } from "../../../store/slice/category_slice";
import { getsubcate } from "../../../store/slice/Subcategoryslice";
import { getsize } from "../../../store/slice/Sizeslice";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productup = useSelector((state) => state.product.productupdate);
  const category = useSelector((state) => state.category.categorylist);
  const subcategory = useSelector((state) => state.subcategory.subcategorylist);

  const [product, setProduct] = useState({
    id: "",
    productName: "",
    description: "",
    gender: "Unisex",
    category: "",
    subcategory: "",
    price: "",
    stock: "",
    discount: "",
    discountType: "Percentage",
    sizes: [],
  });

  const [images, setImages] = useState([]); // new images
  const [preview, setPreview] = useState([]); // preview for all images
  const [removedExistingImages, setRemovedExistingImages] = useState([]); // existing images to remove

  useEffect(() => {
    dispatch(getcategory());
    dispatch(getsubcate());
    dispatch(getsize());
  }, [dispatch]);

  useEffect(() => {
    if (productup) {
      setProduct({
        id: productup._id,
        productName: productup.productName || "",
        description: productup.description || "",
        gender: productup.gender || "Unisex",
        category: productup.category?._id || "",
        subcategory: productup.subcategory?._id || "",
        price: productup.price || "",
        stock: productup.stock || "",
        discount: productup.discount || "",
        discountType: productup.discountType || "Percentage",
        sizes:
          productup.sizes?.map((s) => ({
            size: typeof s.size === "object" ? s.size._id : s.size,
            price: s.price,
            stock: s.stock,
          })) || [],
      });
      setPreview(productup.images?.map((img) => img.filepath) || []); // existing images in preview
    }
  }, [productup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    setPreview([...preview, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    const isNewImage = index >= preview.length - images.length;

    if (isNewImage) {
      const imgIndex = index - (preview.length - images.length);
      setImages(images.filter((_, i) => i !== imgIndex));
    } else {
      // existing image removed
      setRemovedExistingImages([...removedExistingImages, preview[index]]);
    }

    setPreview(preview.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...product.sizes];
    newSizes[index][field] = value;
    setProduct({ ...product, sizes: newSizes });
  };

  const addSize = () => {
    setProduct({
      ...product,
      sizes: [...product.sizes, { size: "", price: "", stock: "" }],
    });
  };

  const removeSize = (index) => {
    const newSizes = product.sizes.filter((_, i) => i !== index);
    setProduct({ ...product, sizes: newSizes });
  };

  const updateProduct = async () => {
    try {
      const formData = new FormData();

      // ✅ Basic product fields
      formData.append("productName", product.productName);
      formData.append("description", product.description);
      formData.append("gender", product.gender);
      formData.append("category", product.category);
      formData.append("subcategory", product.subcategory);

      // ✅ Convert numeric fields safely
      formData.append("price", product.price ? Number(product.price) : 0);
      formData.append("stock", product.stock ? Number(product.stock) : 0);
      formData.append(
        "discount",
        product.discount ? Number(product.discount) : 0
      );
      formData.append("discountType", product.discountType);

      // ✅ Convert nested size price/stock fields to numbers
      if (Array.isArray(product.sizes)) {
        formData.append(
          "sizes",
          JSON.stringify(
            product.sizes.map((s) => ({
              ...s,
              price: s.price ? Number(s.price) : 0,
              stock: s.stock ? Number(s.stock) : 0,
            }))
          )
        );
      }

      // ✅ Handle removed images
      if (removedExistingImages.length > 0) {
        formData.append("removedImages", JSON.stringify(removedExistingImages));
      }

      // ✅ Append new image files
      if (images && images.length > 0) {
        images.forEach((file) => {
          formData.append("images", file);
        });
      }

      // ✅ Axios config
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      // ✅ Make API call
      const res = await axios.put(
        `${Baseurl}product/updateproduct/${product.id}`,
        formData,
        config
      );

      // ✅ Success message & refresh
      dispatch(showToast({ message: res.data.message, type: "success" }));
      dispatch(getproduct());
      dispatch(colsseupdate());
      navigate("/admin/Getproduct");
    } catch (err) {
      console.log(err);
      dispatch(
        showToast({
          message: err?.response?.data?.message || "Update failed",
          type: "error",
        })
      );
    }
  };

  return (
    <Container className="my-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4">Update Product</h3>
        <Form>
          {/* Product Fields */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={product.productName}
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={product.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Description */}
          <Row className="mb-3">
            <Col>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={product.description}
                onChange={handleChange}
              />
            </Col>
          </Row>
          {/* Category/Subcategory */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={product.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {category.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryname}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Subcategory</Form.Label>
              <Form.Select
                name="subcategory"
                value={product.subcategory}
                onChange={handleChange}
              >
                <option value="">Select subcategory</option>
                {subcategory
                  ?.filter((sub) => sub.categoryID === product.category)
                  .map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.subcategory}
                    </option>
                  ))}
              </Form.Select>
            </Col>
          </Row>
          {/* Sizes */}
          <div className="mb-3">
            <h5>Sizes</h5>
            {product.sizes.map((s, idx) => (
              <Row key={idx} className="mb-2 align-items-center">
                <Col md={3}>
                  <Form.Select
                    value={s.size}
                    onChange={(e) =>
                      handleSizeChange(idx, "size", e.target.value)
                    }
                  >
                    <option value="">Select size</option>
                    {subcategory
                      ?.find((sub) => sub._id === product.subcategory)
                      ?.sizes?.map((sz) => (
                        <option key={sz._id} value={sz._id}>
                          {sz.size}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    value={s.price}
                    onChange={(e) =>
                      handleSizeChange(idx, "price", e.target.value)
                    }
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="number"
                    placeholder="Stock"
                    value={s.stock}
                    onChange={(e) =>
                      handleSizeChange(idx, "stock", e.target.value)
                    }
                  />
                </Col>
                <Col md={3}>
                  <Button variant="danger" onClick={() => removeSize(idx)}>
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="secondary" onClick={addSize}>
              + Add Size
            </Button>
          </div>

          {/* Price & Stock fallback */}
          {!product.sizes.length && (
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          )}

          {/* Discount */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                name="discount"
                value={product.discount}
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Discount Type</Form.Label>
              <Form.Select
                name="discountType"
                value={product.discountType}
                onChange={handleChange}
              >
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Images */}
          <Form.Group className="mb-3">
            <Form.Label>Upload Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            {preview.length > 0 && (
              <div className="mt-3">
                <h6>Preview Images:</h6>
                <div className="d-flex flex-wrap gap-3">
                  {preview.map((src, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img
                        src={src}
                        alt="preview"
                        style={{ width: "120px", borderRadius: "6px" }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          borderRadius: "50%",
                          padding: "2px 6px",
                        }}
                        onClick={() => removeImage(i)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Form.Group>
          {/* Actions */}
          <div className="d-flex gap-2 mt-3">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/Getproduct")}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={updateProduct}>
              Update Product
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};
export default UpdateProduct;