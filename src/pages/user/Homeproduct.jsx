import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card } from "react-bootstrap";
import { getproduct } from "../../store/slice/productSlice";
import { useNavigate } from "react-router-dom";

const Homeproduct = () => {
  const dispatch = useDispatch();
  const productlist = useSelector((state) => state.product.productlist);
    const navigate = useNavigate()
  useEffect(() => {
    dispatch(getproduct());
  }, [dispatch]);

  const handleproduct = () =>{  
    navigate('/categories')
  }

  // ✅ Get only one product per category
  const uniqueCategoryProducts = [];
  const categorySet = new Set();

  if (productlist && productlist.length > 0) {
    productlist.forEach((product) => {
      const categoryName = product?.category?.categoryname || product?.categoryname;
      if (!categorySet.has(categoryName)) {
        categorySet.add(categoryName);
        uniqueCategoryProducts.push(product);
      }
    });
  }

  return (
    <Container className="my-4">
      <h3 className="mb-4 text-center">Featured Products by Category</h3>
      <Row>
        {uniqueCategoryProducts.map((product) => (
          <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={product.images?.[0]?.filepath}
                alt={product.name}
                style={{ height: "200px", objectFit: "cover" }}
                />
              <Card.Body>
                
                <Card.Text>
                  <strong>

                 {product.category?.categoryname || "No Category"}
                  </strong>
               </Card.Text> 
                {/* <Card.Title className="text-truncate">
                    <strong>Product Name:</strong>{" "}{product.productName}
                    </Card.Title>  */}
                <button
                      className='align-self-center text-color mt-auto p-2 border-0 rounded-3 button-color w-100'
                      onClick={handleproduct}
                    >
                      Explore More
                    </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Homeproduct;
