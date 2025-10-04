import { useEffect, useState } from "react";
import axios from "axios";
import { Baseurl } from "../../baseurl";
import "bootstrap/dist/css/bootstrap.min.css";

const BootstrapCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${Baseurl}banner/getbanners`);
        setSlides(res.data);
      } catch (err) {
        console.error("Error fetching slider images", err);
      }
    };
    fetchSlides();
  }, []);

  // Auto-slide every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        slides.length > 0 ? (prevIndex + 1) % slides.length : 0
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="carousel slide">
      <div className="carousel-inner">
        {slides.map((slide, idx) => (
          <div
            key={slide._id}
            className={`carousel-item ${idx === currentIndex ? "active" : ""}`}
          >
            <img
              src={slide.bannerimage[0]?.filepath}
              className="d-block w-100"
              alt={slide.title || "slide"}
              style={{ height: "500px", maxWidth: "100%", objectFit: "fit" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BootstrapCarousel;
