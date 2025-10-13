import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import "../../safar_css/user.css"; // 👈 Import CSS file
import { showToast } from "../../store/slice/toast_slice";
import { Baseurl } from "../../baseurl";

const Contactus = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate email format
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Validate contact number (10 digits)
  const isValidContact = (contact) => /^\d{10}$/.test(contact);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!isValidEmail(formData.email)) {
      dispatch(showToast({ message: "Invalid email address", type: "error" }));
      return;
    }
    if (!isValidContact(formData.contact)) {
      dispatch(
        showToast({
          message: "Contact number must be 10 digits",
          type: "error",
        })
      );
      return;
    }

    setStatus("Sending...");

    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(
        showToast({
          message: "You must be logged in to send a message",
          type: "error",
        })
      );
      setStatus("Unauthorized. Please login.");
      return;
    }

    try {
      const res = await axios.post(
        `${Baseurl}message/sendmessage`,
        {
          name: formData.name,
          email: formData.email,
          contact: Number(formData.contact),
          message: formData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        dispatch(
          showToast({
            message: "Message sent successfully",
            type: "success",
          })
        );
        setFormData({ name: "", email: "", contact: "", message: "" });
        setStatus(
          "Message sent successfully ! Our Team will connect you shortly..."
        );
        setTimeout(() => {
          setStatus("");
        }, 3000);
        setFormData({ name: "", email: "", contact: "", message: "" });
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong";
      dispatch(showToast({ message: errorMessage, type: "error" }));
      if (err.response?.status === 401) {
        setStatus("Unauthorized. Please login again.");
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    }
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>
            Contact <span>THE SAFAR.store</span>
          </h1>
          <p>We’d love to hear from you. Let’s get in touch today!</p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="contact-section">
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <p>
            Have a question, feedback, or business inquiry? Fill out the form
            below, and our team will get back to you shortly.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Contact No</label>
              <input
                type="text"
                name="contact"
                placeholder="Enter Number"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                rows="5"
                placeholder="Type your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>

          {status && <p className="form-status">{status}</p>}
        </div>

        <div className="contact-info">
          <h2>Get in Touch</h2>
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <p>
              <strong>Address:</strong>
              <br /> 410, Adinath Arcade, Adajan - 395009
            </p>
          </div>
          <div className="info-item">
            <i className="fas fa-phone-alt"></i>
            <p>
              <strong>Phone:</strong>
              <br /> +91 99797-81975
            </p>
          </div>
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <p>
              <strong>Email:</strong>
              <br /> thesafaronlinestore@gmail.com
            </p>
          </div>
          <div className="info-item">
            <i className="fas fa-clock"></i>
            <p>
              <strong>Working Hours:</strong>
              <br /> Mon - Sat: 9:00 AM to 8:00 PM
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1563.9543488603163!2d72.78384518343194!3d21.20283138460715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d6cf4cede03%3A0xe8d226328cae6baf!2sAadinath%20Arcade!5e0!3m2!1sen!2sin!4v1760073399668!5m2!1sen!2sin"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
};

export default Contactus;
