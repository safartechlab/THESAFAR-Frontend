import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ProductFilterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🔹 Local filter state (not synced to URL until "Apply" is clicked)
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Category → SubCategory Map
  const subCategories = {
    mobile: ["Android", "iPhone"],
    laptop: ["Gaming", "Business"],
  };

  // 🔹 Initialize filters from URL on mount
  useEffect(() => {
    setName(searchParams.get("name") || "");
    setCategory(searchParams.get("category") || "");
    setSubCategory(searchParams.get("subCategory") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, []);

  // 🔹 Fetch products whenever URL changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        const urlName = searchParams.get("name");
        const urlCategory = searchParams.get("category");
        const urlSubCategory = searchParams.get("subCategory");
        const urlMinPrice = searchParams.get("minPrice");
        const urlMaxPrice = searchParams.get("maxPrice");

        if (urlName) params.append("name", urlName);
        if (urlCategory) params.append("category", urlCategory);
        if (urlSubCategory) params.append("subCategory", urlSubCategory);
        if (urlMinPrice) params.append("minPrice", urlMinPrice);
        if (urlMaxPrice) params.append("maxPrice", urlMaxPrice);

        const res = await fetch(`/api/products?${params.toString()}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // 🔹 Apply filters → update URL (this triggers the fetch)
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (name.trim()) params.append("name", name.trim());
    if (category) params.append("category", category);
    if (subCategory) params.append("subCategory", subCategory);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    navigate(`/products?${params.toString()}`);
  };

  // 🔹 Clear filters
  const clearFilters = () => {
    setName("");
    setCategory("");
    setSubCategory("");
    setMinPrice("");
    setMaxPrice("");
    navigate("/products");
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* ================= FILTER PANEL ================= */}
      <aside style={{ width: "260px" }}>
        <h3>Filters</h3>

        <input
          type="text"
          placeholder="Search product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory(""); // Reset subcategory when category changes
          }}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        >
          <option value="">All Categories</option>
          <option value="mobile">Mobile</option>
          <option value="laptop">Laptop</option>
        </select>

        {category && (
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          >
            <option value="">All Sub Categories</option>
            {subCategories[category]?.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button 
          onClick={applyFilters} 
          style={{ 
            width: "100%", 
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Apply Filters
        </button>

        <button
          onClick={clearFilters}
          style={{ 
            width: "100%", 
            marginTop: "8px",
            padding: "10px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Clear Filters
        </button>
      </aside>

      {/* ================= PRODUCT LIST ================= */}
      <main style={{ flex: 1 }}>
        <h3>Products</h3>

        {error && (
          <p style={{ color: "red" }}>Error: {error}</p>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "15px",
            }}
          >
            {products.map((p) => (
              <div
                key={p._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "6px",
                }}
              >
                <h4 style={{ margin: "0 0 8px 0" }}>{p.name}</h4>
                <p style={{ margin: "4px 0", color: "#666" }}>
                  {p.category} / {p.subCategory}
                </p>
                <p style={{ margin: "4px 0", fontWeight: "bold" }}>
                  ₹{p.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductFilterPage;
