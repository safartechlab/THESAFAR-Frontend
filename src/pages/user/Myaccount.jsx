import { useState, useEffect } from "react";
import axios from "axios";
import { Baseurl } from "../../baseurl";

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gender: "",
    contactno: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("userID");

        if (!userID || !token) throw new Error("User not authenticated");

        const res = await axios.get(`${Baseurl}user/getuser/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.data);
        setFormData({
          username: res.data.data.username,
          email: res.data.data.email,
          gender: res.data.data.gender,
          contactno: res.data.data.contactno,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");

      const res = await axios.put(`${Baseurl}user/updateduser/${userID}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.data);
      setEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");

      await axios.delete(`${Baseurl}user/deleteacount/${userID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("userID");
      alert("Account deleted successfully");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };

  if (loading) return <div className="loading">Loading your account...</div>;
  if (!user) return <div className="error">Failed to load user data.</div>;

  const { username, email, gender, contactno, address } = user;

  return (
    <div style={{ maxWidth: "1000px", margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "40px", fontFamily: "'Poppins', sans-serif", color: "#222" }}>
        <b>My Account</b>
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          background: "linear-gradient(145deg, #f5f7fa, #e4ebf5)",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
        }}
      >
        {/* Profile / Edit Section */}
        <div style={{ flex: "1 1 400px", backgroundColor: "#fff", padding: "30px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}>
          {editing ? (
            <>
              <h3 style={{ marginBottom: "20px", color: "#333" }}>Edit Profile</h3>
              {["username", "email", "gender", "contactno"].map((field) => (
                <input
                  key={field}
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px",
                    marginBottom: "15px",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                />
              ))}
              <div style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={handleUpdate}
                  style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#28a745", color: "#fff", cursor: "pointer", fontWeight: "600" }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#6c757d", color: "#fff", cursor: "pointer", fontWeight: "600" }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: "20px", color: "#333" }}>Profile</h3>
              <p><strong>Name:</strong> {username}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Gender:</strong> {gender}</p>
              <p><strong>Contact No:</strong> {contactno}</p>
              <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                <button
                  onClick={() => setEditing(true)}
                  style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#007bff", color: "#fff", cursor: "pointer", fontWeight: "600" }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleDelete}
                  style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#dc3545", color: "#fff", cursor: "pointer", fontWeight: "600" }}
                >
                  Delete Account
                </button>
              </div>
            </>
          )}
        </div>

        {/* Address Section */}
        {address && (
          <div style={{ flex: "1 1 400px", backgroundColor: "#fff", padding: "30px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}>
            <h3 style={{ marginBottom: "20px", color: "#333" }}>Address</h3>
            <p>{`${address.houseno}, ${address.society}`}</p>
            <p>{address.landmark}</p>
            <p>{`${address.area}, ${address.city}, ${address.state} - ${address.pincode}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
