import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getproduct, setsinglepro } from "../../store/slice/productSlice";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

const Product = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productlist);
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
const subcategoryFilter = searchParams.get("subcategory");
  const handleshow = (product)=>{
    dispatch(setsinglepro(product))
    navigate('/singleproduct')
  }

  useEffect(() => {
    const filters = {};
    if (categoryFilter) filters.category = categoryFilter;
    if (subcategoryFilter) filters.subcategory = subcategoryFilter;

    dispatch(getproduct(filters));
  }, [dispatch, categoryFilter,subcategoryFilter]);

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

      displayPrice = min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`;
      
      if (pro.discountType === "Percentage" && pro.discount > 0) {
        const discountedMin = min - (min * pro.discount) / 100;
        const discountedMax = max - (max * pro.discount) / 100;
        originalPrice = displayPrice;
        displayPrice = discountedMin === discountedMax 
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

  return (
    <Row className="g-4">
      {productList.map((pro, index) => {
        const { displayPrice, originalPrice } = getPriceDisplay(pro);

        return (
          <Col key={index} sm={6} md={4} lg={3} onClick={()=>handleshow(pro)}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={pro.images?.[0]?.filepath || "/no-image.png"}
                alt={pro.productName}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{pro.productName}</Card.Title>
                <Card.Text>{pro.description}</Card.Text>

                <div>
                  {originalPrice ? (
                    <>
                      <strong style={{ color: "green" }}>{displayPrice}</strong>{" "}
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
