import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getcategory } from "../../store/slice/category_slice";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Card from "react-bootstrap/Card";
import "slick-carousel/slick/slick.css";  
import "slick-carousel/slick/slick-theme.css";

const Slidercategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const category = useSelector((state) => state.category.categorylist);

  useEffect(() => {
    dispatch(getcategory());
  }, [dispatch]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const handleCategoryClick = (cat) => {
    navigate(`/categories?category=${cat._id}&name=${encodeURIComponent(cat.categoryname)}`);
  };

  return (
    <div className="category-slider-container py-4">
      <h3 className="text-center mb-4 fw-bold" style={{ letterSpacing: "1px" }}>
        Shop by Category
      </h3>

      <Slider {...settings}>
        {category?.map((cat, index) => (
          <div key={index} className="px-2">
            <Card
              onClick={() => handleCategoryClick(cat)}
              className="border-0 shadow-sm category-card"
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  height: "180px",
                }}
              >
                <Card.Img
                  src={cat?.categoryimage?.filepath}
                  alt={cat?.categoryname}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                  className="category-image"
                />
                {/* Gradient Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "50%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  }}
                ></div>
                {/* Category Name Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: 0,
                    width: "100%",
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                    letterSpacing: "0.5px",
                    textShadow: "0px 2px 6px rgba(0,0,0,0.3)",
                  }}
                >
                  {cat?.categoryname}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </Slider>

      {/* Custom Hover Effect */}
      <style>
        {`
          .category-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          }

          .category-card:hover .category-image {
            transform: scale(1.1);
          }

          .category-slider-container {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
          }
        `}
      </style>
    </div>
  );
};

export default Slidercategory;
