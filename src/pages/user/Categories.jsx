import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getproduct } from "../../store/slice/productSlice";
import { Card, Row, Col } from "react-bootstrap";

const Product = () => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.productlist);

  useEffect(() => {
    dispatch(getproduct());
  }, [dispatch]);

  // ✅ Helper: format price with currency
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <Row className="g-4">
      {product.map((pro, index) => {
        // --- PRICE HANDLING ---
        let displayPrice = "";
        let originalPrice = null;

        if (pro.sizes && pro.sizes.length > 0) {
          // Sizes exist → price range
          const prices = pro.sizes.map((s) => s.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          displayPrice =
            min === max
              ? formatPrice(min)
              : `${formatPrice(min)} - ${formatPrice(max)}`;
        } else {
          // Single price
          displayPrice = formatPrice(pro.price);
        }

        // --- DISCOUNT HANDLING ---
        if (pro.discountType === "Percentage" && pro.discount > 0) {
          if (pro.sizes && pro.sizes.length > 0) {
            const min = Math.min(...pro.sizes.map((s) => s.price));
            const max = Math.max(...pro.sizes.map((s) => s.price));
            const discountedMin = min - (min * pro.discount) / 100;
            const discountedMax = max - (max * pro.discount) / 100;
            displayPrice = `${formatPrice(discountedMin)} - ${formatPrice(
              discountedMax
            )}`;
            originalPrice =
              min === max
                ? formatPrice(min)
                : `${formatPrice(min)} - ${formatPrice(max)}`;
          } else {
            const discounted = pro.price - (pro.price * pro.discount) / 100;
            originalPrice = formatPrice(pro.price);
            displayPrice = formatPrice(discounted);
          }
        }

        return (
          <Col key={index} sm={6} md={4} lg={3}>
            <Card style={{ width: "100%" }} className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={pro.images?.[0]?.filepath || "/no-image.png"}
                alt={pro.productName}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{pro.productName}</Card.Title>
                <Card.Text>{pro.description}</Card.Text>

                {/* Discounted Price Display */}
                <div>
                  {originalPrice ? (
                    <>
                      <strong style={{ color: "green" }}>{displayPrice}</strong>
                      <span style={{ textDecoration: "line-through", color: "#888" }}>
                        {originalPrice}
                      </span>{" "}
                      <span className="ms-1 text-danger">({pro.discount}% OFF)</span>
                    </>
                  ) : (
                    <strong>{displayPrice}</strong>
                  )}
                </div>

                <div className="mt-2">
                  <small className="text-muted">
                    Gender: {pro.gender || "Unisex"}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default Product;
