// import React from "react";
import { FaCarSide, FaShieldAlt, FaExchangeAlt, FaPhoneAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../safar_css/user.css"; 

const ServiceFeatures = () => {
  const services = [
    {
      icon: <FaCarSide size={35} color="white" />,
      title: "Free Shipping",
      desc: "Free on order over 500",
    },
    {
      icon: <FaShieldAlt size={35} color="white" />,
      title: "Security Payment",
      desc: "100% security payment",
    },
    {
      icon: <FaExchangeAlt size={35} color="white" />,
      title: "7 Day Easy Return",
      desc: "7 day money Back guarantee",
    },
    {
      icon: <FaPhoneAlt size={35} color="white" />,
      title: "24/7 Support",
      desc: "Fast Support Everytime",
    },
  ];

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        {services.map((service, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-4">
            <div className="service-card text-center p-4 shadow-sm rounded-4 bg-light">
              <div className="icon-wrapper mx-auto mb-3">{service.icon}</div>
              <h5 className="fw-bold">{service.title}</h5>
              <p className="text-muted mb-0">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceFeatures;
