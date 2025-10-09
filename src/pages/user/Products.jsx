import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getproduct } from "../../store/slice/productSlice";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const products = useSelector((state) => state.product.productlist);

  const categoryId = searchParams.get("category");
  const categoryName = searchParams.get("name");

  useEffect(() => {
    if (categoryId) {
      dispatch(getproduct({ categoryId }));
    }
  }, [dispatch, categoryId]);
  

  return (
    <div className="container py-4">
      <h3 className="mb-4">{categoryName} Products</h3>
      <div className="d-flex flex-wrap">
        {products?.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="card m-3" style={{ width: "18rem" }}>
              <img
                src={product.productImage?.[0]?.filepath}
                className="card-img-top"
                alt={product.productName}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.productName}</h5>
                <p className="card-text">₹{product.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No products found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
