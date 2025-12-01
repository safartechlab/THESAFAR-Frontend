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
    houseno: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    finalTotal: 0,
  });

  // Fetch cart + calculate totals
  useEffect(() => {
    dispatch(getCart());

    let subtotal = 0,
      discount = 0,
      finalTotal = 0;

    cartlist.forEach((item) => {
      const price = Number(item.price) || 0;
      const discountedPrice = Number(item.discountedPrice ?? item.price);
      const qty = Number(item.quantity);

      subtotal += price * qty;
      finalTotal += discountedPrice * qty;
      discount += (price - discountedPrice) * qty;
    });

    setTotals({ subtotal, discount, finalTotal });
  }, [cartlist, dispatch]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ---------------- Razorpay Payment Handler ----------------
  const handlePlaceOrder = async () => {
    const requiredFields = [
      "name",
      "phone",
      "houseno",
      "street",
      "city",
      "state",
      "pincode",
      "country",
    ];

    for (let field of requiredFields) {
      if (!form[field]) {
        dispatch(
          showToast({ message: "Please fill all details", type: "error" })
        );
        return;
      }
    }

    if (totals.finalTotal <= 0) {
      dispatch(showToast({ message: "Cart is empty", type: "error" }));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

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
            sizeId: item.size?._id || item.size || item.selectedSize,
            sizeName:
              item.size?.name ||
              item.sizeName ||
              item.selectedSizeName ||
              item.selectedSize ||
              "N/A",
          })),
          shippingAddress: form,
          paymentMethod: "Razorpay",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.success)
        return dispatch(
          showToast({ message: "Failed to create order", type: "error" })
        );

      const razorpayOrder = data.order;

      const options = {
        key: data.key,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "TheSafarStore",
        description: "Payment for Order",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            const verify = await axios.post(
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

            if (verify.data.success) {
              localStorage.removeItem("cartWithSizes");
              navigate("/myorders");
            } else {
              dispatch(
                showToast({
                  message: "Payment verification failed",
                  type: "error",
                })
              );
            }
          } catch (err) {
            dispatch(
              showToast({
                message: "Payment verification error",
                type: "error",
              })
            );
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
      dispatch(
        showToast({ message: "Unable to initiate payment", type: "error" })
      );
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* LEFT FORM */}
        <div className="col-lg-7">
          <div className="card shadow-sm p-4">
            <h3 className="mb-4">Shipping Address</h3>

            <input
              name="name"
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Full Name"
            />
            <input
              name="phone"
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Phone Number"
            />

            <input
              name="houseno"
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="House No."
            />
            <input
              name="street"
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Street / Society"
            />
            <input
              name="landmark"
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Landmark (optional)"
            />

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  name="city"
                  onChange={handleChange}
                  className="form-control"
                  placeholder="City"
                />
              </div>
              <div className="col-md-6">
                <input
                  name="state"
                  onChange={handleChange}
                  className="form-control"
                  placeholder="State"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  name="pincode"
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Pincode"
                />
              </div>
              <div className="col-md-6">
                <input
                  name="country"
                  onChange={handleChange}
                  className="form-control"
                  value={form.country}
                />
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="btn btn-primary w-100 fw-bold"
            >
              Pay & Place Order
            </button>
          </div>
        </div>

        {/* RIGHT CART SUMMARY */}
        <div className="col-lg-5">
          <div className="card shadow-sm p-4">
            <h3 className="mb-4">Order Summary</h3>

            {cartlist.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cartlist.map((item, i) => (
                  <div key={i} className="d-flex mb-3 border-bottom pb-2">
                    <img
                      src={item.image}
                      alt=""
                      width={70}
                      height={70}
                      className="rounded"
                    />
                    <div className="ms-3">
                      <h6>{item.productName}</h6>
                      <small>Size: {item.size || "N/A"}</small>
                      <br />
                      <small>Qty: {item.quantity}</small>
                    </div>
                    <strong className="ms-auto">₹{item.price}</strong>
                  </div>
                ))}

                <div className="border p-3 bg-light">
                  <div className="d-flex justify-content-between">
                    <span>Subtotal</span> <strong>₹{totals.subtotal}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Discount</span> <strong>₹{totals.discount}</strong>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fs-5 fw-bold">
                    <span>Total</span> <span>₹{totals.finalTotal}</span>
                  </div>
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
