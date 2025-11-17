import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Image, Button, FormControl } from "react-bootstrap";
import { showToast } from "../../store/slice/toast_slice";
import { addToCart } from "../../store/slice/CartSlice";

const Singleproduct = () => {
  const navigate = useNavigate();
  const singlepro = useSelector((state) => state.product.singleproduct);
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Initialize product
  useEffect(() => {
    if (!singlepro) {
      navigate("/");
    } else if (singlepro.images?.length > 0) {
      setSelectedImage(singlepro.images[0].filepath);

      if (singlepro.sizes?.length > 0) {
        const first = singlepro.sizes[0];
        setSelectedSize(first.size.size);
        setSelectedPrice(first.discountedPrice || first.price);
        setOriginalPrice(first.price);
      } else {
        setSelectedPrice(singlepro.discountedPrice || singlepro.price);
        setOriginalPrice(singlepro.price);
      }
    }
  }, [singlepro, navigate]);

  if (!singlepro) return <p className="text-center mt-5">Loading...</p>;

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  // Size selection
  const handleSizeClick = (item) => {
    setSelectedSize(item.size.size);
    setSelectedPrice(item.discountedPrice || item.price);
    setOriginalPrice(item.price);
  };

  // Quantity increment/decrement
  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "plus") return prev + 1;
      if (type === "minus") return Math.max(1, prev - 1);
      return prev;
    });
  };

  // Add to Cart
  const handleAddCart = async () => {
    try {
      if (!singlepro?._id) {
        dispatch(showToast({ message: "Product not found", type: "error" }));
        return;
      }

      // ✅ Ensure a size is selected if the product has size options
      if (singlepro.sizes?.length > 0 && !selectedSize) {
        dispatch(
          showToast({ message: "Please select a size", type: "warning" })
        );
        return;
      }

      // ✅ Find the selected size object (to get its ID and prices)
      const selectedSizeObj = singlepro.sizes?.find(
        (s) => s.size.size === selectedSize
      );

      // ✅ Build payload properly
      const payload = {
        productId: singlepro._id,
        sizeId: selectedSizeObj?._id || null,
        size: selectedSizeObj?.size?.size || selectedSize || null,
        quantity,
        price: selectedSizeObj?.price || singlepro.price,
        discountedPrice:
          selectedSizeObj?.discountedPrice ||
          singlepro.discountedPrice ||
          selectedSizeObj?.price ||
          singlepro.price,
      };

      // ✅ Dispatch addToCart
      const resultAction = await dispatch(addToCart(payload));

      if (addToCart.fulfilled.match(resultAction)) {
        dispatch(showToast({ message: "Added to cart!", type: "success" }));
      } else {
        dispatch(
          showToast({ message: "Failed to add to cart", type: "error" })
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(showToast({ message: "Something went wrong", type: "error" }));
    }
  };

  return (
    <Row className="my-5 px-3">
      {/* Left Section: Images */}
      <Col md={6} className="d-flex">
        <div className="me-3 d-flex flex-column align-items-center">
          {singlepro.images?.map((img, i) => (
            <Image
              key={i}
              src={img.filepath}
              thumbnail
              onClick={() => setSelectedImage(img.filepath)}
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
                cursor: "pointer",
                marginBottom: "8px",
                border:
                  selectedImage === img.filepath
                    ? "2px solid #a020f0"
                    : "1px solid #ddd",
              }}
            />
          ))}
        </div>

        <div className="flex-grow-1 text-center">
          <Image
            src={selectedImage || "/no-image.png"}
            alt={singlepro.productName}
            fluid
            style={{
              maxHeight: "500px",
              objectFit: "contain",
              borderRadius: "10px",
            }}
          />
        </div>
      </Col>

      {/* Right Section: Product Info */}
      <Col md={6}>
        <h3 className="fw-semibold">{singlepro.productName}</h3>
        <p className="text-muted">{singlepro.description}</p>

        {/* Price */}
        <div className="mb-3">
          <h4 className="text-success mb-0">
            {formatPrice(selectedPrice || singlepro.price)}
          </h4>
          {originalPrice && selectedPrice < originalPrice && (
            <>
              <span
                className="text-decoration-line-through text-secondary"
                style={{ fontSize: "14px" }}
              >
                {formatPrice(originalPrice)}
              </span>
              <span className="ms-2 text-danger">
                (
                {Math.round(
                  ((originalPrice - selectedPrice) / originalPrice) * 100
                )}
                % OFF)
              </span>
            </>
          )}
        </div>

        {/* Sizes */}
        {singlepro.sizes?.length > 0 && (
          <div className="mb-3">
            <strong>Select Size:</strong>
            <div className="d-flex gap-2 mt-1 flex-wrap">
              {singlepro.sizes.map((item) => (
                <Button
                  key={item._id}
                  variant={
                    selectedSize === item.size.size
                      ? "primary"
                      : "outline-secondary"
                  }
                  size="sm"
                  onClick={() => handleSizeClick(item)}
                >
                  {item.size.size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Stock Info */}
        {selectedSize && (
          <small className="text-muted">
            Stock:{" "}
            {singlepro.sizes.find((s) => s.size.size === selectedSize)?.stock ||
              0}
          </small>
        )}

        {/* Quantity */}
        <div className="d-flex align-items-center gap-2 mt-3">
          <strong>Quantity:</strong>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => handleQuantityChange("minus")}
          >
            -
          </Button>
          <FormControl
            value={quantity}
            readOnly
            style={{ width: "60px", textAlign: "center" }}
          />
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => handleQuantityChange("plus")}
          >
            +
          </Button>
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2 mt-4">
          <Button
            variant="outline-primary"
            className="px-4"
            onClick={handleAddCart}
          >
            Add to Cart
          </Button>
          <Button variant="primary" className="px-4">
            Buy Now
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default Singleproduct;
