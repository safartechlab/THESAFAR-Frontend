import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getcategory } from "../../store/slice/category_slice";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Card from "react-bootstrap/Card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Categories = () => {
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
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  const handleCategoryClick = (cat) => {
    navigate(
      `/categories?category=${cat._id}&name=${encodeURIComponent(cat.categoryname)}`
    );
  };

  return (
    <div className="my-4">
      <h4 className="mb-3 text-center">Shop by Category</h4>
      <Slider {...settings}>
        {category?.map((cat, index) => (
          <Card
            key={index}
            onClick={() => handleCategoryClick(cat)}
            className="m-2 shadow-sm hover-scale"
            style={{
              width: "16rem",
              cursor: "pointer",
              borderRadius: "12px",
              overflow: "hidden",
              transition: "transform 0.3s",
            }}
          >
            <Card.Img
              variant="top"
              src={cat?.categoryimage?.filepath || "https://via.placeholder.com/300x150"}
              alt={cat?.categoryname}
              style={{ height: "150px", objectFit: "cover" }}
            />
            <Card.Body className="p-2">
              <Card.Title className="text-center text-dark">
                {cat?.categoryname}
              </Card.Title>
            </Card.Body>
          </Card>
        ))}
      </Slider>
    </div>
  );
};

export default Categories;
