import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  addToWishlist,
  removeProductFromWishlist,
  fetchWishlist,
} from "../../store/slice/wishlistSlice";
import { showToast } from "../../store/slice/toast_slice";
import { getproduct, setsinglepro } from "../../store/slice/productSlice";

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const productList = useSelector((state) => state.product.productlist);
  const wishlist = useSelector((state) => state.wishlist.items || []);

  const handleShow = (product) => {
    dispatch(setsinglepro(product));
    navigate("/singleproduct");
  };

  useEffect(() => {
    const filters = {};
    const queryFilter = searchParams.get("query");
    const categoryFilter = searchParams.get("category");
    const subcategoryFilter = searchParams.get("subcategory");

    if (categoryFilter) filters.category = categoryFilter;
    if (subcategoryFilter) filters.subcategory = subcategoryFilter;
    if (queryFilter) filters.query = queryFilter;

    dispatch(getproduct(filters));
    dispatch(fetchWishlist());
  }, [dispatch, searchParams]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

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

      if (pro.discountType === "Percentage" && pro.discount > 0) {
        const discountedMin = min - (min * pro.discount) / 100;
        const discountedMax = max - (max * pro.discount) / 100;
        originalPrice = displayPrice;
        displayPrice =
          discountedMin === discountedMax
            ? formatPrice(discountedMin)
            : `${formatPrice(discountedMin)} - ${formatPrice(discountedMax)}`;
      }
    } else {
      displayPrice = formatPrice(pro.price);
      if (pro.discountType === "Percentage" && pro.discount > 0) {
        originalPrice = displayPrice;
        const discounted = pro.price - (pro.price * pro.discount) / 100;
        displayPrice = formatPrice(discounted);
      }
    }

    return { displayPrice, originalPrice };
  };

  const handleWishlistToggle = async (product, e) => {
    e.stopPropagation();
    try {
      const isInWishlist =
        Array.isArray(wishlist) &&
        wishlist.some((item) => item._id === product._id);
      let resultAction;

      if (isInWishlist) {
        resultAction = await dispatch(removeProductFromWishlist(product._id));
        if (removeProductFromWishlist.fulfilled.match(resultAction)) {
          dispatch(
            showToast({ message: "Removed from wishlist", type: "success" })
          );
        }
      } else {
        resultAction = await dispatch(addToWishlist(product._id));
        if (addToWishlist.fulfilled.match(resultAction)) {
          dispatch(
            showToast({ message: "Added to wishlist", type: "success" })
          );
        }
      }
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          message: err.message || "Something went wrong",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="mx-0">
      {productList.length === 0 ? (
        <div className="text-center py-5">
          <h5 className="text-muted">
            {searchParams.get("subcategory")
              ? "No subcategory products available"
              : "No products available"}
          </h5>
        </div>
      ) : (
        <Row className="g-4 mx-0">
          {productList.map((pro, index) => {
            const { displayPrice, originalPrice } = getPriceDisplay(pro);
            const isInWishlist =
              Array.isArray(wishlist) &&
              wishlist.some((item) => item._id === pro._id);

            return (
              <Col
                key={index}
                sm={6}
                md={4}
                lg={3}
                onClick={() => handleShow(pro)}
                style={{ cursor: "pointer" }}
              >
                <Card className="h-100 shadow-sm border-0 rounded-3 product-card">
                  <div className="position-relative overflow-hidden rounded-top-3">
                    <Card.Img
                      variant="top"
                      src={pro.images?.[0]?.filepath || "/no-image.png"}
                      alt={pro.productName}
                      className="img-fluid w-100 product-img"
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                    {pro.discount > 0 && (
                      <Badge
                        bg="danger"
                        className="position-absolute top-2 start-2"
                        style={{ zIndex: 2 }}
                      >
                        {pro.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fs-6 fw-bold text-truncate">
                      {pro.productName}
                    </Card.Title>
                    <Card.Text className="text-truncate mb-2">
                      {pro.description}
                    </Card.Text>
                    <div className="mb-2">
                      {originalPrice ? (
                        <>
                          <strong className="text-success">{displayPrice}</strong>{" "}
                          <span className="text-muted text-decoration-line-through">
                            {originalPrice}
                          </span>
                        </>
                      ) : (
                        <strong>{displayPrice}</strong>
                      )}
                    </div>

                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Gender: {pro.gender || "Unisex"}
                      </small>
                      <button
                        className={`btn btn-sm rounded-circle ${
                          isInWishlist ? "btn-danger" : "btn-outline-danger"
                        }`}
                        onClick={(e) => handleWishlistToggle(pro, e)}
                        style={{ width: "32px", height: "32px", padding: 0 }}
                        title={
                          isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                        }
                      >
                        {isInWishlist ? "♥" : "♡"}
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default Product;
