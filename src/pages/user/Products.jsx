import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getproduct } from "../../store/slice/productSlice";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const products = useSelector((state) => state.product.productlist);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Get URL parameters
  const categoryId = searchParams.get("category") || "";
  const subcategoryName = searchParams.get("subcategory") || "";
  const query = searchParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    // Fetch all products; API can optionally support categoryId
    dispatch(getproduct());
  }, [dispatch]);

  useEffect(() => {
    const result = products.filter((p) => {
      const inCategory =
        !categoryId || p.category?._id === categoryId;

      const inSubcategory =
        !subcategoryName || p.subcategoryname?.toLowerCase() === subcategoryName.toLowerCase();

      const inSearch =
        !query ||
        p.productName?.toLowerCase().includes(query) ||
        p.category?.categoryname?.toLowerCase().includes(query) ||
        p.subcategoryname?.toLowerCase().includes(query);

      return inCategory && inSubcategory && inSearch;
    });

    setFilteredProducts(result);
  }, [products, categoryId, subcategoryName, query]);

  return (
    <div className="container py-4">
      <h3 className="mb-4">
        {subcategoryName
          ? `${subcategoryName} Products`
          : categoryId
          ? `Category Products`
          : query
          ? `Search results for "${query}"`
          : "All Products"}
      </h3>

      <div className="d-flex flex-wrap">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="card m-3"
              style={{ width: "18rem" }}
            >
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
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
