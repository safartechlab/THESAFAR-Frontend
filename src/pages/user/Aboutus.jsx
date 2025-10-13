// import React from "react";
import "../../safar_css/user.css"; // 👈 Import the CSS file

const Aboutus = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>About <span>THE SAFAR.store</span></h1>
          <p>Your trusted destination for fashion, electronics, and everything in between.</p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="about-intro">
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            Welcome to <strong>THE SAFAR.store</strong>, your all-in-one shopping companion.
            We are passionate about providing a seamless shopping experience
            with products that combine quality, style, and value.
          </p>
          <p>
            From fashion and accessories to electronics and home essentials,
            we bring you everything you love — delivered right to your doorstep.
          </p>
        </div>
        <div className="about-image">
          <img
            src="https://static.fibre2fashion.com/Newsresource/images/289/shutterstock-2235485233_301200.jpg"
            alt="Shopping Experience"
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          To redefine the online shopping experience by blending trust,
          quality, and affordability. We aim to create a digital space where
          every customer feels confident, valued, and inspired.
        </p>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <h2>Why Choose Us?</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="icon">🛍️</div>
            <h3>Vast Selection</h3>
            <p>Explore diverse categories with curated, quality products for every lifestyle.</p>
          </div>
          <div className="value-card">
            <div className="icon">🚀</div>
            <h3>Fast Delivery</h3>
            <p>Quick shipping and easy returns — your satisfaction, our top priority.</p>
          </div>
          <div className="value-card">
            <div className="icon">💎</div>
            <h3>Premium Quality</h3>
            <p>We ensure top-notch quality across every product we offer.</p>
          </div>
        </div>
      </section>

      {/* Lifestyle Banner */}
      <section className="about-banner">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h2>Shop Smart. Live Better.</h2>
          <p>Join thousands of happy shoppers choosing THE SAFAR.store every day.</p>
          <a href="/" className="shop-btn">Start Shopping</a>
        </div>
      </section>
    </div>
  );
};

export default Aboutus;
