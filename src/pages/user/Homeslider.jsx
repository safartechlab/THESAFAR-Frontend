import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getcategory } from "../../store/slice/category_slice";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
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
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
  };

  // ✅ handle category click
  const handleCategoryClick = (cat) => {
    // Dispatch product fetch for selected category
    dispatch(getproduct({ categoryId: cat._id }));

    // Navigate to product listing page (same route)
    navigate(`/categories?category=${cat._id}`);
  };

  return (
    <Slider {...settings}>
      {category?.map((cat, index) => (
        <Card
          key={index}
          onClick={() => handleCategoryClick(cat)}
          className="m-2 shadow-sm"
          style={{
            width: "16rem",
            cursor: "pointer",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Card.Img
            variant="top"
            src={cat?.categoryimage?.filepath}
            alt={cat?.categoryname}
            style={{ height: "150px", objectFit: "cover" }}
          />
          <Card.Body>
            <Card.Title className="text-center text-dark">
              {cat?.categoryname}
            </Card.Title>
          </Card.Body>
        </Card>
      ))}
    </Slider>
  );
};

export default Categories;
