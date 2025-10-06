import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getproduct } from "../../store/slice/productSlice";
import { Container, Row, Col, Card } from "react-bootstrap";

const Product = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const products = useSelector((state) => state.product.productlist);

  // ✅ Get category ID from query param
  const params = new URLSearchParams(location.search);
  const categoryId = params.get("category");

  useEffect(() => {
    // ✅ Fetch all products (or filter by category)
    if (categoryId) {
      dispatch(getproduct({ categoryId })); // assuming your API supports filtering
    } else {
      dispatch(getproduct());
    }
  }, [dispatch, categoryId]);

  return (
    <Container className="mt-4">
      <Row>
        {products?.length > 0 ? (
          products.map((item, index) => (
            <Col key={index} md={3} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Img
                  variant="top"
                  src={item?.images[0]?.filepath}
                  alt={item?.productName}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{item?.productName}</Card.Title>
                  <Card.Text>₹{item?.price}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center mt-4">No products found</p>
        )}
      </Row>
    </Container>
  );
};

export default Product;
