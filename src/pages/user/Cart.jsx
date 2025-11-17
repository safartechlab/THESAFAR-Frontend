import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../../store/slice/CartSlice";
import { showToast } from "../../store/slice/toast_slice";
import { Baseurl } from "../../baseurl";
import axios from "axios";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartlist, loading, error } = useSelector((state) => state.cart);

  const [actionLoading, setActionLoading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    houseno: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // 🏠 Load saved address
  useEffect(() => {
    const saved = localStorage.getItem("savedAddress");
    if (saved) setCheckoutForm(JSON.parse(saved));
  }, []);

  // 💾 Save address
  useEffect(() => {
    if (saveAddress)
      localStorage.setItem("savedAddress", JSON.stringify(checkoutForm));
  }, [saveAddress, checkoutForm]);

  // 🛍 Load cart
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // 🧮 Totals
  const totalItems = cartlist?.reduce((a, i) => a + (i.quantity || 1), 0) || 0;
  const totalPrice =
    cartlist?.reduce(
      (a, i) =>
        a +
        (i.product?.discountedPrice ??
          i.discountedPrice ??
          i.product?.price ??
          i.price ??
          0) *
          (i.quantity || 1),
      0
    ) || 0;

  // 🔄 Update Quantity
  const handleUpdateQuantity = async (e, item, change) => {
    e.preventDefault();
    const newQty = (item.quantity || 1) + change;
    if (newQty < 1) return;
    try {
      setActionLoading(true);
      const res = await dispatch(
        updateCartQuantity({ cartItemId: item._id, quantity: newQty })
      );
      if (!updateCartQuantity.fulfilled.match(res))
        throw new Error(res.payload || "Failed to update quantity");
    } catch (err) {
      dispatch(showToast({ message: err.message, type: "error" }));
    } finally {
      setActionLoading(false);
    }
  };

  // ❌ Delete Item
  const handleDelete = async (item) => {
    const cartItemId = item?._id;
    const productName =
      item.product?.productName || item.productName || "Product";
    try {
      setActionLoading(true);
      const res = await dispatch(removeFromCart({ cartItemId, productName }));
      if (removeFromCart.fulfilled.match(res))
        dispatch(
          showToast({ message: `${productName} removed`, type: "success" })
        );
    } catch (err) {
      dispatch(showToast({ message: err.message, type: "error" }));
    } finally {
      setActionLoading(false);
    }
  };

  // 🧩 Update Size Selection & Save Persistently
  const handleSizeChange = (item, newSize) => {
    const updatedCart = cartlist.map((i) =>
      i._id === item._id ? { ...i, size: newSize } : i
    );

    // Save to localStorage
    localStorage.setItem("cartWithSizes", JSON.stringify(updatedCart));

    dispatch(
      showToast({ message: `Size updated to ${newSize}`, type: "success" })
    );
  };

  // 💳 Razorpay Checkout
  const handleCheckout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    // Save size info before checkout
    localStorage.setItem("cartWithSizes", JSON.stringify(cartlist));

    const amount = Math.round(totalPrice * 100) / 100;

    const { data } = await axios.post(
      `${Baseurl}order/create-razorpay-order`,
      { amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "THE SAFAR.store",
      description: "Order Payment",
      order_id: data.order.id,

      handler: async (response) => {
        try {
          // 🔥 SEND ONLY REQUIRED RAZORPAY FIELDS
          const verifyRes = await axios.post(
            `${Baseurl}order/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,

              // additional required data
              checkoutForm,
              cartItems: cartlist,
              totalAmount: totalPrice,
              paymentMethod: "Razorpay",
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log("verify response", verifyRes.data);

          dispatch(showToast({ message: "Payment successful!", type: "success" }));
          await dispatch(clearCart());
          setShowCheckoutModal(false);
          navigate("/myorders");

        } catch (err) {
          console.error("Payment verification failed:", err.response?.data || err);
          dispatch(
            showToast({
              message: "Payment verification failed",
              type: "error",
            })
          );
        }
      },

      theme: { color: "#1e3632" },
      modal: {
        ondismiss: function () {
          console.log("Payment modal closed");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function () {
      dispatch(showToast({ message: "Payment failed", type: "error" }));
    });
  } catch (error) {
    console.error("Checkout error:", error);
    dispatch(showToast({ message: "Checkout failed", type: "error" }));
  }
};

  // 🧭 Render Conditions
  if (loading)
    return <div className="text-center mt-5">Loading your cart...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!cartlist?.length)
    return (
      <div className="text-center mt-5">
        <p>Your cart is empty.</p>
        <Link
          to="/categories"
          className="btn btn-primary btn-sm my-2 px-3 py-2"
          style={{ backgroundColor: "#1e3632", borderColor: "#1e3632" }}
        >
          Shop Now
        </Link>
      </div>
    );

  // 🧾 Main Cart View
  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Your Cart</h3>
      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8">
          {cartlist.map((item) => {
            const p = item.product || item;

            const price =
              p?.discountedPrice ??
              item.discountedPrice ??
              p?.price ??
              item.price ??
              0;

            const productName = p?.productName || p?.name || "Unnamed Product";

            const imageSrc =
              item.image ||
              item.images?.[0]?.filepath ||
              p?.images?.[0]?.filepath ||
              "https://via.placeholder.com/100?text=No+Image";

            const hasSizes = Array.isArray(p?.sizes) && p.sizes.length > 0;
            const selectedSize = item.size || "";

            return (
              <div
                key={item._id}
                className="card mb-3 shadow-sm border-0 rounded-3"
              >
                <div className="row g-0 align-items-center">
                  <div className="col-md-3 text-center">
                    <img
                      src={imageSrc}
                      alt={productName}
                      className="img-fluid p-2"
                      style={{ height: 100, objectFit: "contain" }}
                    />
                  </div>

                  <div className="col-md-6">
                    <div className="card-body">
                      <h5>{productName}</h5>

                      {/* Size Selector */}
                      {hasSizes && (
                        <div className="mb-2">
                          <label className="me-2 fw-semibold">Size:</label>
                          <select
                            className="form-select form-select-sm w-auto d-inline"
                            value={selectedSize}
                            onChange={(e) =>
                              handleSizeChange(item, e.target.value)
                            }
                          >
                            <option value="">Select Size</option>
                            {p.sizes.map((sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Quantity & Price */}
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-2">Qty:</span>
                        <button
                          className="btn btn-outline-secondary btn-sm me-1"
                          onClick={(e) => handleUpdateQuantity(e, item, -1)}
                          disabled={actionLoading || item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity || 1}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm ms-1"
                          onClick={(e) => handleUpdateQuantity(e, item, 1)}
                          disabled={actionLoading}
                        >
                          +
                        </button>
                      </div>

                      <p className="fw-semibold">₹{price}</p>
                      <p className="fw-semibold">
                        Total: ₹{(price * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-3 text-end pe-4">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(item)}
                      disabled={actionLoading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="col-lg-4">
          <div className="card p-3 shadow-sm border-0">
            <h5>Cart Summary</h5>
            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span>Total Price</span>
              <strong>₹{totalPrice.toFixed(2)}</strong>
            </div>
            <button
              className="btn btn-success w-100"
              disabled={actionLoading}
              onClick={() => setShowCheckoutModal(true)}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Shipping Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowCheckoutModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-2">
                  {[
                    "name",
                    "phone",
                    "houseno",
                    "street",
                    "city",
                    "state",
                    "pincode",
                    "country",
                  ].map((f) => (
                    <div key={f} className="col-md-6 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                        value={checkoutForm[f]}
                        onChange={(e) =>
                          setCheckoutForm({
                            ...checkoutForm,
                            [f]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={saveAddress}
                    onChange={() => setSaveAddress(!saveAddress)}
                    id="saveAddressCheck"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="saveAddressCheck"
                  >
                    Save this address
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCheckoutModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleCheckout}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Pay with Razorpay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
