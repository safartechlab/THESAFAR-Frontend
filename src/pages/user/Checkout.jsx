import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "../../safar_css/user.css";
import { Baseurl } from "../../baseurl";
import { clearCart } from "../../store/slice/CartSlice";
import { showToast } from "../../store/slice/toast_slice";
import { clearBuyNowItem } from "../../store/slice/Buynowslice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartlist } = useSelector((state) => state.cart);
  const buyNowItem = useSelector((state) => state.buynow.item);

  const [itemsToUse, setItemsToUse] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (buyNowItem) {
      setItemsToUse([buyNowItem]); // Only buy-now item
    } else {
      setItemsToUse(cartlist);
    }
  }, [buyNowItem, cartlist]);

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

  useEffect(() => {
    if (!orderPlaced && !buyNowItem && cartlist.length === 0) {
      dispatch(showToast({ message: "No items to checkout", type: "error" }));
      navigate("/");
    }
  }, [buyNowItem, cartlist, orderPlaced]);

  useEffect(() => {
    let subtotal = 0,
      discount = 0,
      finalTotal = 0;

    itemsToUse.forEach((item) => {
      const price = Number(item.originalPrice || item.price);
      const discountedPrice = Number(item.discountedPrice || item.price);
      const qty = Number(item.quantity);

      subtotal += price * qty;
      finalTotal += discountedPrice * qty;
      discount += (price - discountedPrice) * qty;
    });

    setTotals({ subtotal, discount, finalTotal });
  }, [itemsToUse]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    const required = [
      "name",
      "phone",
      "houseno",
      "street",
      "city",
      "state",
      "pincode",
    ];
    for (let field of required) {
      if (!form[field]) {
        dispatch(
          showToast({ message: "Please fill all details", type: "error" })
        );
        return;
      }
    }

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      // 🔥 SEND isBuyNow (important fix)
      const { data } = await axios.post(
        `${Baseurl}order/create-razorpay-order`,
        {
          amount: totals.finalTotal,
          items: itemsToUse.map((item) => ({
            productId: item.productId || item.product,
            productName: item.productName,
            image: item.image,
            price: item.price,
            originalPrice: item.originalPrice || item.price,
            quantity: item.quantity,
            sizeId: item.sizeId || null,
            sizeName: item.sizeName || "N/A",
          })),
          shippingAddress: form,
          paymentMethod: "Razorpay",
          isBuyNow: !!buyNowItem, // 🔥 FIX ADDED
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.success) {
        dispatch(
          showToast({ message: "Failed to create order", type: "error" })
        );
        return;
      }

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
            // 🔥 SEND isBuyNow + items (important fix)
            const verify = await axios.post(
              `${Baseurl}order/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                checkoutForm: form,
                cartItems: itemsToUse,
                totalAmount: totals.finalTotal,

                items: itemsToUse, // 🔥 FIX ADDED
                isBuyNow: !!buyNowItem, // 🔥 FIX ADDED
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verify.data.success) {
              if (buyNowItem) dispatch(clearBuyNowItem());
              else dispatch(clearCart());
              setOrderPlaced(true);

              localStorage.removeItem("cartWithSizes");

              dispatch(
                showToast({
                  message: "Order Placed Successfully!",
                  type: "success",
                })
              );

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
        <div className="col-lg-7">
          <div className="card shadow-sm p-4">
            <button
              className="btn btn-secondary mb-3"
              onClick={() => {
              navigate("/singleproduct");
              }}
            >
              ← Back to Product
            </button>

            <h3 className="mb-4">Shipping Address</h3>

            {[
              { name: "name", placeholder: "Full Name" },
              { name: "phone", placeholder: "Phone Number" },
              { name: "houseno", placeholder: "House No." },
              { name: "street", placeholder: "Street / Society" },
              { name: "landmark", placeholder: "Landmark (optional)" },
            ].map((item, i) => (
              <input
                key={i}
                className="form-control mb-3"
                name={item.name}
                onChange={handleChange}
                placeholder={item.placeholder}
              />
            ))}

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
                  value={form.country}
                  readOnly
                  className="form-control"
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

        <div className="col-lg-5">
          <div className="card shadow-sm p-4">
            <h3 className="mb-4">Order Summary</h3>

            {itemsToUse.map((item, i) => (
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
                  <small>Size: {item.sizeName}</small>
                  <br />
                  <small>Qty: {item.quantity}</small>
                </div>

                <strong className="ms-auto">
                  ₹{item.discountedPrice || item.price}
                </strong>
              </div>
            ))}

            <div className="border p-3 bg-light">
              <div className="d-flex justify-content-between">
                <span>Subtotal</span> <strong>₹{totals.subtotal}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Discount</span>{" "}
                <strong>₹{totals.discount.toFixed(2)}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between fs-5 fw-bold">
                <span>Total</span> <span>₹{totals.finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
