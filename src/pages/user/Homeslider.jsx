import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getcategory } from "../../store/slice/category_slice";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Categorysilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const category = useSelector((state) => state.category.categorylist);

  useEffect(() => {
    dispatch(getcategory());
  }, [dispatch]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  const handleCategoryClick = (cat) => {
    navigate(`/categories?category=${cat._id}`);
  };

  return (
    <Container fluid className="py-4">
      <h4 className="text-center mb-4 fw-bold text-uppercase">
        Explore and Feel Luxury
      </h4>
      <Slider {...settings}>
        {category?.map((cat, index) => (
          <div key={index} className="px-2">
            <Card
              onClick={() => handleCategoryClick(cat)}
              className="category-card border-0 shadow-sm"
              style={{
                cursor: "pointer",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <Card.Img
                variant="top"
                src={cat?.categoryimage?.filepath}
                alt={cat?.categoryname}
                style={{
                  height: "180px",
                  objectFit: "cover",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              />
              <Card.Body
                className="d-flex align-items-center justify-content-center"
                style={{
                  background: "#f8f9fa",
                  height: "70px",
                }}
              >
                <Card.Title
                  className="text-center text-dark m-0 fw-semibold"
                  style={{ fontSize: "1rem" }}
                >
                  {cat?.categoryname}
                </Card.Title>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Slider>

      <style>{`
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .slick-slide > div {
          display: flex;
          justify-content: center;
        }
        .slick-track {
          display: flex;
          align-items: stretch;
        }
        .category-card {
          height: 100%;
        }
      `}</style>
    </Container>
  );
};

export default Categorysilder;
