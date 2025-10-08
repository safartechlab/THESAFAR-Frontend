import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getproduct } from "../../store/slice/productSlice";
import Carousel from "react-bootstrap/Carousel";
import { Badge, Card, Row, Col } from "react-bootstrap";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const products = useSelector((state) => state.product.productlist);

  const categoryId = searchParams.get("category");
  const categoryName = searchParams.get("name");

  useEffect(() => {
    if (categoryId) {
      dispatch(getproduct({ categoryId }));
    }
  }, [dispatch, categoryId]);

  const handleAddToCart = (product) => {
    // TODO: Integrate Redux cart dispatch here
    console.log("Add to cart:", product.productName);
  };

  // ✅ Helper: format price with currency
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  // ✅ Helper: compute price (with discount logic)
  const getPriceDisplay = (pro) => {
    let displayPrice = "";
    let originalPrice = null;

    if (pro.sizes && pro.sizes.length > 0) {
      const prices = pro.sizes.map((s) => s.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      displayPrice =
        min === max
          ? formatPrice(min)
          : `${formatPrice(min)} - ${formatPrice(max)}`;
    } else {
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

    return { displayPrice, originalPrice };
  };

  return (
    <div className="container py-5">
      {" "}
      <h3 className="mb-4 text-center">{categoryName || "Products"}</h3>
      {products?.length === 0 ? (
        <p className="text-center text-muted">
          No products found in this category.
        </p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products?.map((product) => {
            const { displayPrice, originalPrice } = getPriceDisplay(product);

            return (
              <Col key={product._id}>
                <Card className="h-100 shadow-sm">
                  {/* Carousel for multiple images */}
                  {product.images && product.images.length > 0 && (
                    <Carousel variant="dark" interval={3000}>
                      {product.images.map((img, index) => (
                        <Carousel.Item key={index}>
                          <img
                            src={
                              img.filepath ||
                              "https://via.placeholder.com/300x200"
                            }
                            className="d-block w-100"
                            alt={product.productName}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  )}

                  <Card.Body>
                    <Card.Title className="fw-bold">
                      {product.productName}
                    </Card.Title>
                    <Card.Text className="text-muted">
                      {product.description}
                    </Card.Text>

                    {/* Category details */}
                    <p>
                      <strong>Category:</strong>{" "}
                      {product.category?.categoryname || "-"}
                    </p>
                    <p>
                      <strong>Subcategory:</strong>{" "}
                      {product.subcategory?.subcategory || "-"}
                    </p>
                    <p>
                      <strong>Gender:</strong> {product.gender || "Unisex"}
                    </p>
                    <p>
                      <strong>Stock:</strong> {product.stock ?? "-"}
                    </p>

                    {/* Price Display */}
                    <div>
                      {originalPrice ? (
                        <>
                          <strong className="text-success">
                            {displayPrice}
                          </strong>{" "}
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                            }}
                          >
                            {originalPrice}
                          </span>{" "}
                          <Badge bg="danger" className="ms-1">
                            {product.discount}% OFF
                          </Badge>
                        </>
                      ) : (
                        <strong>{displayPrice}</strong>
                      )}
                    </div>
                  </Card.Body>

                  <Card.Footer className="text-center">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default CategoryPage;
