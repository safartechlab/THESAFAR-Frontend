import { useState, useEffect } from "react";
import axios from "axios";
import { Baseurl } from "../../baseurl";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("userID");
        if (!token || !userID) throw new Error("Not authenticated");

        const res = await axios.get(`${Baseurl}order/userorders/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data.orders || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="loading" style={{ textAlign: "center", marginTop: "50px" }}>
        Loading orders...
      </div>
    );
  if (!orders.length)
    return (
      <div className="no-orders" style={{ textAlign: "center", marginTop: "50px" }}>
        No orders found.
      </div>
    );

  return (
    <div style={{ maxWidth: "1100px", margin: "50px auto", padding: "20px" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "50px",
          fontFamily: "'Poppins', sans-serif",
          color: "#222",
          fontWeight: "700",
        }}
      >
        My Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            marginBottom: "40px",
            borderRadius: "20px",
            overflow: "hidden",
            background: "linear-gradient(145deg, #f9f9f9, #e6ebf2)",
            boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
            transition: "transform 0.3s",
          }}
        >
          <div
            style={{
              padding: "25px 30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              backgroundColor: "#fff",
              borderBottom: "2px solid #eee",
            }}
          >
            <h3 style={{ margin: 0, color: "#333" }}>{order.orderNumber}</h3>
            <span
              style={{
                padding: "6px 12px",
                borderRadius: "12px",
                fontWeight: "600",
                color: order.status === "Pending" ? "#856404" : "#155724",
                backgroundColor: order.status === "Pending" ? "#fff3cd" : "#d4edda",
              }}
            >
              {order.status}
            </span>
          </div>

          <div style={{ padding: "20px 30px" }}>
            <h4 style={{ marginBottom: "10px", color: "#555" }}>Shipping Address</h4>
            <p style={{ margin: "3px 0" }}>
              {order.shippingAddress.houseno}, {order.shippingAddress.street},{" "}
              {order.shippingAddress.landmark}
            </p>
            <p style={{ margin: "3px 0" }}>
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}, {order.shippingAddress.country}
            </p>
          </div>

          <div style={{ padding: "0 30px 20px 30px" }}>
            <h4 style={{ marginBottom: "10px", color: "#555" }}>Items</h4>
            {order.items.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  padding: "15px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <img
                  src={item.product.images[0]?.filepath}
                  alt={item.productName}
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px" }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: "600", marginBottom: "5px", color: "#333" }}>
                    {item.productName}
                  </p>
                  <p style={{ marginBottom: "3px", color: "#666" }}>Size: {item.sizeName}</p>
                  <p style={{ marginBottom: "3px", color: "#666" }}>Qty: {item.quantity}</p>
                  <p style={{ fontWeight: "600", color: "#222" }}>₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              padding: "20px 30px",
              backgroundColor: "#fff",
              borderTop: "2px solid #eee",
              fontWeight: "600",
            }}
          >
            <p>Subtotal: ₹{order.subtotal}</p>
            <p>Discount: ₹{order.discount}</p>
            <p>Tax: ₹{order.tax}</p>
            <p>Total: ₹{order.totalPrice}</p>
            <p>Payment: {order.paymentMethod}</p>
            <p>Paid: {order.isPaid ? "Yes" : "No"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
