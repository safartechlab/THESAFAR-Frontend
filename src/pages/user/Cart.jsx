import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../../store/slice/CartSlice";
import { showToast } from "../../store/slice/toast_slice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartlist, loading, error } = useSelector((state) => state.cart);
  const [actionLoading, setActionLoading] = useState(false);

  // ✅ Fetch cart on load
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // ✅ Calculate total price
  const total = Array.isArray(cartlist)
    ? cartlist.reduce((sum, item) => {
        const price =
          item.product?.discountedPrice ??
          item.discountedPrice ??
          item.product?.price ??
          item.price ??
          0;
        return sum + price * (item.quantity || 1);
      }, 0)
    : 0;

  // ✅ Calculate total quantity
  const totalItems = Array.isArray(cartlist)
    ? cartlist.reduce((sum, item) => sum + (item.quantity || 1), 0)
    : 0;

  // ✅ Handle item removal
  const handleDelete = async (cartItem) => {
    try {
      const cartItemId = cartItem?._id;
      const productName =
        cartItem.productName || cartItem.product?.productName || "Unknown product";

      if (!cartItemId) throw new Error("Invalid cart item ID");

      setActionLoading(true);

      const resultAction = await dispatch(
        removeFromCart({ cartItemId, productName })
      );

      if (removeFromCart.fulfilled.match(resultAction)) {
        dispatch(
          showToast({
            message: `${productName} removed from cart`,
            type: "success",
          })
        );
        dispatch(getCart());
      } else {
        throw new Error(resultAction.payload || "Failed to remove item");
      }
    } catch (err) {
      dispatch(
        showToast({
          message: err.message || "Something went wrong",
          type: "error",
        })
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Handle quantity increment/decrement (fixed for size array issue)
const handleUpdateQuantity = async (cartItem, change) => {
  try {
    const newQuantity = (cartItem.quantity || 1) + change;
    if (newQuantity < 1) return;

    // ✅ Extract the correct sizeId for size-based products
    const sizeId =
      cartItem.size?._id || // when size is object
      cartItem.sizeId || // sometimes stored separately
      (typeof cartItem.size === "string" && cartItem.size.match(/^[0-9a-fA-F]{24}$/)
        ? cartItem.size
        : null); // valid MongoDB ObjectId string

    const productId = cartItem.productId || cartItem.product?._id;

    console.log("🧾 Sending payload to backend:", {
      productId,
      sizeId,
      quantity: newQuantity,
    });

    setActionLoading(true);

    const resultAction = await dispatch(
      updateCartQuantity({ productId, sizeId, quantity: newQuantity })
    );

    if (updateCartQuantity.fulfilled.match(resultAction)) {
      dispatch(showToast({ message: "Quantity updated", type: "success" }));
      dispatch(getCart());
    } else {
      throw new Error(resultAction.payload || "Failed to update quantity");
    }
  } catch (error) {
    console.error("❌ Update error:", error);
    dispatch(
      showToast({
        message: error.message || "Something went wrong",
        type: "error",
      })
    );
  } finally {
    setActionLoading(false);
  }
};




  // ✅ Loading / Empty States
  if (loading)
    return <div className="text-center mt-5">Loading cart...</div>;

  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        {error || "Failed to load cart"}
      </div>
    );

  if (!cartlist || cartlist.length === 0)
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

  // ✅ UI Section
  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Your Cart</h3>

      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8">
          {cartlist.map((item) => {
            const originalPrice = item.product?.price ?? item.price ?? 0;
            const discountedPrice =
              item.product?.discountedPrice ??
              item.discountedPrice ??
              originalPrice;
            const finalPrice = discountedPrice * (item.quantity || 1);

            return (
              <div
                key={item._id}
                className="card mb-3 shadow-sm border-0"
                style={{ borderRadius: "10px" }}
              >
                <div className="row g-0 align-items-center">
                  {/* Product Image */}
                  <div className="col-md-3 text-center">
                    <img
                      src={
                        item.image ||
                        item.images?.[0]?.filepath ||
                        item.product?.images?.[0]?.filepath ||
                        "https://via.placeholder.com/100?text=No+Image"
                      }
                      alt={
                        item.productName ||
                        item.product?.productName ||
                        "Product"
                      }
                      className="img-fluid p-2"
                      style={{ height: "100px", objectFit: "contain" }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="col-md-6">
                    <div className="card-body">
                      <h5 className="card-title mb-1">
                        {item.productName ||
                          item.product?.productName ||
                          "Unnamed Product"}
                      </h5>

                      {/* ✅ Display selected size */}
                      {item.size && (
                        <p className="text-muted mb-2">
                          Size:{" "}
                          <strong>
                            {item.size?.size || item.sizeLabel || item.size}
                          </strong>
                        </p>
                      )}

                      {/* ✅ Quantity Controls */}
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-2">Quantity:</span>
                        <button
                          className="btn btn-outline-secondary btn-sm me-1"
                          onClick={() => handleUpdateQuantity(item, -1)}
                          disabled={actionLoading || item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2 fw-semibold">
                          {item.quantity || 1}
                        </span>
                        <button
                          className="btn btn-outline-secondary btn-sm ms-1"
                          onClick={() => handleUpdateQuantity(item, 1)}
                          disabled={actionLoading}
                        >
                          +
                        </button>
                      </div>

                      {/* Price display */}
                      {discountedPrice < originalPrice ? (
                        <p className="card-text mb-1">
                          <span className="text-decoration-line-through text-muted me-2">
                            ₹{originalPrice}
                          </span>
                          <strong className="text-success">
                            ₹{discountedPrice}
                          </strong>
                        </p>
                      ) : (
                        <p className="card-text fw-semibold">
                          ₹{originalPrice}
                        </p>
                      )}

                      <p className="card-text fw-semibold">
                        Total: ₹{finalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Remove Button */}
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

        {/* ✅ Cart Summary */}
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
              <strong>₹{total.toFixed(2)}</strong>
            </div>
            <button
              className="btn btn-success w-100"
              disabled={actionLoading}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
