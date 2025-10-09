import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchWishlist,
  removeProductFromWishlist,
} from "../../store/slice/wishlistSlice";
import { addToCart } from "../../store/slice/CartSlice";
import { showToast } from "../../store/slice/toast_slice";

function Wishlist() {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    items: wishlist,
    loading,
    error,
  } = useSelector((state) => state.wishlist);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (productId) => {
    try {
      setActionLoading(true);
      const resultAction = await dispatch(removeProductFromWishlist(productId));
      if (removeProductFromWishlist.fulfilled.match(resultAction)) {
        dispatch(
          showToast({
            message: resultAction.payload?.message || "Removed successfully",
            type: "success",
          })
        );
         navigate("/");
      } else {
        throw new Error(resultAction.payload?.message || "Failed to remove");
      }
    } catch (err) {
      console.error(err);
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

  const handleAddToCart = async (product) => {
    try {
      setActionLoading(true);
      const resultAction = await dispatch(
        addToCart({ productId: product._id, quantity: 1 })
      );
      if (resultAction.error) throw new Error(resultAction.error.message);

      const removeAction = await dispatch(
        removeProductFromWishlist(product._id)
      );
      if (removeProductFromWishlist.fulfilled.match(removeAction)) {
        dispatch(
          showToast({
            message:
              resultAction.payload?.message || "Added to cart successfully",
            type: "success",
          })
        );
        navigate("/cart");
      } else {
        throw new Error(
          removeAction.payload?.message || "Failed to remove from wishlist"
        );
      }
    } catch (err) {
      console.error(err);
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

  if (loading)
    return <div className="text-center mt-5">Loading wishlist...</div>;

  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        {error || "Failed to load wishlist"}
      </div>
    );

  if (!Array.isArray(wishlist) || wishlist.length === 0)
    return (
      <div className="text-center mt-5">
        <p>Your wishlist is empty.</p>
        <Link
          to="/categories"
          className="btn btn-primary btn-sm my-2 px-3 py-2"
          style={{
            backgroundColor: "#1e3632",
            borderColor: "#1e3632", // optional, to match button border
          }}
        >
          Shop Now
        </Link>
      </div>
    );

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">My Wishlist</h3>
      <div className="row">
        {wishlist.map((item, index) => {
          const originalPrice = item.price ?? 0;
          const discountedPrice = item.discountedPrice ?? originalPrice;
          const key = item._id ?? item.id ?? `${item.productName}-${index}`;

          return (
            <div key={key} className="col-lg-4 col-md-6 mb-4">
              <div
                className="card h-100 shadow-sm border-0 position-relative"
                style={{ borderRadius: "10px" }}
              >
                {discountedPrice < originalPrice && (
                  <span className="badge bg-success position-absolute m-2">
                    {item.discountPercentage ?? 0}% OFF
                  </span>
                )}

                <img
                  src={
                    item.images?.[0]?.filepath ||
                    "https://dummyimage.com/200x200/ccc/000.png&text=No+Image"
                  }
                  alt={item.productName ?? "Product"}
                  className="card-img-top p-2"
                  style={{ height: "200px", objectFit: "contain" }}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    {item.productName ?? "Unnamed Product"}
                  </h5>
                  <p className="text-muted mb-1">
                    Gender: {item.gender ?? "N/A"}
                  </p>

                  {discountedPrice < originalPrice ? (
                    <p className="mb-1">
                      <span className="text-decoration-line-through text-muted me-2">
                        ₹{originalPrice}
                      </span>
                      <strong className="text-success">
                        ₹{discountedPrice}
                      </strong>
                    </p>
                  ) : (
                    <p className="mb-1 fw-semibold">₹{originalPrice}</p>
                  )}

                  <div className="mt-auto d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemove(item._id)}
                      disabled={actionLoading}
                    >
                      Remove
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleAddToCart(item)}
                      disabled={actionLoading}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Wishlist;
