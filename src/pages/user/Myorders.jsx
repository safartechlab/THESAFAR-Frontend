import { useState, useEffect } from "react";
import axios from "axios";
import { Baseurl } from "../../baseurl";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const res = await axios.get(`${Baseurl}order/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return { background: "#cce5ff", color: "#004085" };
      case "Delivered":
        return { background: "#d4edda", color: "#155724" };
      case "Cancelled":
        return { background: "#f8d7da", color: "#721c24" };
      case "Paid":
        return { background: "#d4edda", color: "#155724" };
      default:
        return { background: "#f8f9fa", color: "#6c757d" };
    }
  };

  const handleViewInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in to view invoices.");

      const res = await fetch(`${Baseurl}order/invoice/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load invoice");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error viewing invoice:", err);
      alert("Failed to open invoice. Please try again.");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading your orders...
      </div>
    );

  if (!orders.length)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        No orders found.
      </div>
    );

  return (
    <div style={{ maxWidth: "1100px", margin: "50px auto", padding: "20px" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "40px",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: "700",
          color: "#222",
        }}
      >
        My Orders
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              borderRadius: "15px",
              backgroundColor: "#fff",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "#f8f9fa",
                padding: "18px 25px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <h3 style={{ margin: 0, color: "#333", fontSize: "18px" }}>
                Order #{order.orderNumber || order._id.slice(-6)}
              </h3>

              <span
                style={{
                  ...getStatusStyle(order.status),
                  padding: "5px 12px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                {order.status || "Processing"}
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 25px" }}>
              {/* Address */}
              <div
                style={{
                  marginBottom: "15px",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px",
                }}
              >
                <h4 style={{ marginBottom: "6px", color: "#555" }}>
                  Shipping Address
                </h4>

                {order.shippingAddress ? (
                  <>
                    <p style={{ margin: 0, color: "#666" }}>
                      {order.shippingAddress.name}
                    </p>
                    <p style={{ margin: 0, color: "#666" }}>
                      {order.shippingAddress.houseno},{order.shippingAddress.street},
                      {order.shippingAddress.landmark}
                    </p>

                    <p style={{ margin: 0, color: "#666" }}>
                      {order.shippingAddress.city},{order.shippingAddress.state}
                      {order.shippingAddress.pincode}
                    </p>

                    <p style={{ margin: 0, color: "#666" }}>
                      Phone: {order.shippingAddress.phone}
                    </p>
                  </>
                ) : (
                  <p style={{ color: "#999" }}>No address available</p>
                )}
              </div>

              {/* Items */}
              <div>
                <h4 style={{ marginBottom: "10px", color: "#555" }}>Items</h4>

                {order.items?.length ? (
                  order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        marginBottom: "15px",
                        borderBottom: "1px solid #eee",
                        paddingBottom: "10px",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "10px",
                          objectFit: "cover",
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontWeight: "600",
                            margin: "0 0 3px",
                            color: "#333",
                          }}
                        >
                          {item.productName}
                        </p>

                        <p style={{ margin: 0, color: "#777" }}>
                          Qty: {item.quantity}
                        </p>

                        <p
                          style={{
                            margin: 0,
                            fontWeight: "600",
                            color: "#222",
                          }}
                        >
                          ₹{item.discountedPrice || item.price}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#777" }}>No items found.</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                background: "#f8f9fa",
                padding: "15px 25px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                fontWeight: "600",
              }}
            >
              <p>Subtotal: ₹{order.totalPrice}</p>
              <p>Payment: {order.paymentMethod || "N/A"}</p>
              <p>Paid: {order.paymentStatus === "Paid" ? "Yes" : "No"}</p>

              {order.paymentStatus === "Paid" && (
                <button
                  onClick={() => handleViewInvoice(order._id)}
                  style={{
                    padding: "8px 14px",
                    border: "none",
                    background: "#007bff",
                    color: "#fff",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  🧾 View Invoice
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
