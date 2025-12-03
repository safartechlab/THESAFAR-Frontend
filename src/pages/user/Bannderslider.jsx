import { useEffect, useState } from "react";
import axios from "axios";
import { Baseurl } from "../../baseurl";
import "bootstrap/dist/css/bootstrap.min.css";

const BootstrapGridBanner = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${Baseurl}/banner/getbanners`);
        setSlides(res.data);
      } catch (err) {
        console.error("Error fetching slider images", err);
      }
    };
    fetchSlides();
  }, []);

  if (!slides.length) return null;

  return (
    <div className="container-fluid my-2 p-5">
      <div className="row">
        <div className="col-md-6">
          {slides[0] && (
            <img
              src={slides[0].bannerimage[0]?.filepath}
              alt={slides[0].title || "banner"}
              className="img-fluid w-100"
              style={{ height: "500px", objectFit: "contain" }}
            />
          )}
        </div>

        <div className="col-md-6 d-flex flex-column gap-3">
          {slides[1] && (
            <img
              src={slides[1].bannerimage[0]?.filepath}
              alt={slides[1].title || "banner"}
              className="img-fluid w-100"
              style={{ height: "245px", objectFit: "contain" }}
            />
          )}
          {slides[2] && (
            <img
              src={slides[2].bannerimage[0]?.filepath}
              alt={slides[2].title || "banner"}
              className="img-fluid w-100"
              style={{ height: "245px", objectFit: "contain" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BootstrapGridBanner;
