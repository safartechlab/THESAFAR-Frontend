import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../safar_css/user.css";
import { Baseurl } from "../../baseurl";
import { getCart } from "../../store/slice/CartSlice";
import { showToast } from "../../store/slice/toast_slice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartlist } = useSelector((state) => state.cart);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    finalTotal: 0,
  });

  // Load cart from Redux & calculate totals
  useEffect(() => {
    dispatch(getCart());

    let subtotal = 0;
    let discount = 0;

    (cartlist || []).forEach((item) => {
      const price = Number(item.price) || 0;
      const discountedPrice = Number(item.discountedPrice) || price;
      const qty = Number(item.quantity) || 1;

      subtotal += price * qty;
      discount += (price - discountedPrice) * qty;
    });

    setTotals({
      subtotal,
      discount,
      finalTotal: Math.max(subtotal - discount, 0),
    });
  }, [cartlist, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- Razorpay payment ----------------
  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      dispatch(showToast({ message: "Please fill all details", type: "error" }));
      return;
    }

    if (!totals.finalTotal || totals.finalTotal <= 0) {
      dispatch(showToast({ message: "Cart is empty", type: "error" }));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await axios.post(
        `${Baseurl}order/create-razorpay-order`,
        {
          amount: totals.finalTotal,
          items: cartlist.map((item) => ({
            productId: item.productId || item.product,
            productName: item.productName,
            image: item.image,
            price: item.price,
            originalPrice: item.originalPrice || item.mrp || item.price,
            quantity: item.quantity,
            size: item.size || item.selectedSize,
          })),
          shippingAddress: form,
          paymentMethod: "Razorpay",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.success) {
        dispatch(showToast({ message: data.message || "Failed to create order", type: "error" }));
        return;
      }

      const razorpayOrder = data.order;
      const RAZORPAY_KEY = data.key;

      const options = {
        key: RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "TheSafarStore",
        description: "Payment for Order",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${Baseurl}order/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                checkoutForm: form,
                cartItems: cartlist.map((item) => ({
                  productId: item.productId || item.product,
                  productName: item.productName,
                  image: item.image,
                  price: item.price,
                  originalPrice: item.originalPrice || item.mrp || item.price,
                  quantity: item.quantity,
                  size: item.size || item.selectedSize,
                })),
                totalAmount: totals.finalTotal,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              localStorage.removeItem("cartWithSizes");
              navigate("/myorders");
            } else {
              dispatch(showToast({ message: "Payment verification failed", type: "error" }));
            }
          } catch (err) {
            console.error(err);
            dispatch(showToast({ message: "Payment verification failed", type: "error" }));
          }
        },
        prefill: {
          name: form.name,
          email: "customer@example.com",
          contact: form.phone,
        },
        theme: { color: "#0d6efd" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      dispatch(showToast({ message: "Unable to initiate payment", type: "error" }));
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* LEFT FORM */}
        <div className="col-lg-7">
          <div className="card shadow-sm p-4">
            <h3 className="mb-4">Checkout Details</h3>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="form-control mb-3" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="form-control mb-3" />
            <textarea name="address" value={form.address} onChange={handleChange} placeholder="Address" className="form-control mb-3" rows={3} />
            <div className="row mb-3">
              <div className="col-md-6">
                <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="form-control" />
              </div>
              <div className="col-md-6">
                <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" className="form-control" />
              </div>
            </div>
            <button className="btn btn-primary w-100 fw-bold" onClick={handlePlaceOrder}>
              Pay & Place Order
            </button>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="col-lg-5">
          <div className="card shadow-sm p-4">
            <h3 className="mb-4">Order Summary</h3>
            {cartlist.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <div className="list-group mb-4">
                  {cartlist.map((item, idx) => (
                    <div key={idx} className="list-group-item d-flex align-items-center">
                      <img src={item.image || "https://via.placeholder.com/70"} alt={item.productName} style={{ width: 70, height: 70, objectFit: "cover" }} />
                      <div className="ms-3 w-100">
                        <h6>{item.productName}</h6>
                        <small>Size: {item.size || item.selectedSize || "N/A"}</small><br />
                        <small>Qty: {item.quantity}</small>
                      </div>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border p-3 bg-light">
                  <div className="d-flex justify-content-between"><span>Subtotal</span><strong>₹{totals.subtotal}</strong></div>
                  <div className="d-flex justify-content-between"><span>Discount</span><strong>₹{totals.discount}</strong></div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>₹{totals.finalTotal}</span></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
