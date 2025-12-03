import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import "../../safar_css/user.css"; // Optional custom styles
import { showToast } from "../../store/slice/toast_slice";
import { Baseurl } from "../../baseurl";
import "bootstrap/dist/css/bootstrap.min.css";

const Contactus = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidContact = (contact) => /^\d{10}$/.test(contact);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        `${Baseurl}/message/sendmessage`,
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
          "Message sent successfully! Our Team will connect you shortly..."
        );
        setTimeout(() => setStatus(""), 3000);
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
    <div className="container my-5">
      {/* Hero Section */}
      <section className="text-center mb-5 p-5  text-white rounded" style={{background : "#1e3632"}}>
        <h1>
         <span className="fw-bold" >THE SAFAR.store</span>
        </h1>
        <p className="lead">
          We’d love to hear from you. Let’s get in touch today!
        </p>
      </section>

      <div className="row">
        {/* Contact Form */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-3">Send Us a Message</h3>
              <p className="text-muted mb-4">
                Have a question, feedback, or business inquiry? Fill out the
                form below, and our team will get back to you shortly.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contact No</label>
                  <input
                    type="text"
                    name="contact"
                    className="form-control"
                    placeholder="Enter number"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    className="form-control"
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Send Message
                </button>
              </form>

              {status && <p className="mt-3 text-center">{status}</p>}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="col-lg-6">
          <div className="card shadow-sm p-3">
            <h3 className="mb-4">Get in Touch</h3>

            <div className="mb-3 d-flex">
              <i className="fas fa-map-marker-alt fs-4 me-3 text-primary"></i>
              <div>
                <strong>Address:</strong>
                <br />
                410, Adinath Arcade, Adajan - 395009
              </div>
            </div>

            <div className="mb-3 d-flex">
              <i className="fas fa-phone-alt fs-4 me-3 text-primary"></i>
              <div>
                <strong>Phone:</strong>
                <br /> +91 99797-81975
              </div>
            </div>

            <div className="mb-3 d-flex">
              <i className="fas fa-envelope fs-4 me-3 text-primary"></i>
              <div>
                <strong>Email:</strong>
                <br /> thesafaronlinestore@gmail.com
              </div>
            </div>

            <div className="d-flex">
              <i className="fas fa-clock fs-4 me-3 text-primary"></i>
              <div>
                <strong>Working Hours:</strong>
                <br /> Mon - Sat: 9:00 AM to 8:00 PM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="mt-5">
        <div className="ratio ratio-16x9 shadow rounded">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1563.9543488603163!2d72.78384518343194!3d21.20283138460715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d6cf4cede03%3A0xe8d226328cae6baf!2sAadinath%20Arcade!5e0!3m2!1sen!2sin!4v1760073399668!5m2!1sen!2sin"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contactus;
