import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getcategory } from "../../store/slice/category_slice";
import { getsubcate } from "../../store/slice/Subcategoryslice";
import { useNavigate } from "react-router-dom";
import "../../safar_css/user.css";

const CategorySlider = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = useSelector((state) => state.category.categorylist);
  const subcategories = useSelector(
    (state) => state.subcategory.subcategorylist
  );

  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    dispatch(getcategory());
    dispatch(getsubcate());
  }, [dispatch]);

  // ✅ Group subcategories by "group" field
  const getGroupedSubcategories = (catId) => {
    const subs = subcategories.filter((subc) => subc.categoryID === catId);
    const grouped = {};
    subs.forEach((sub) => {
      const groupName = sub.group ? sub.group : "Other";
      if (!grouped[groupName]) grouped[groupName] = [];
      grouped[groupName].push({
        id: sub._id,
        name: sub.subcategory,
      });
    });
    return grouped;
  };

  // ✅ Navigate when a subcategory is clicked
  const handleSubcategoryClick = (sub) => {
    navigate(
      `/categories?subcategory=${encodeURIComponent(sub.id)}&name=${encodeURIComponent(
        sub.name
      )}`
    );
  };

  return (
    <div className="category-menu-container bg-light shadow-sm py-2">
      <div className="container d-flex justify-content-center flex-wrap">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="category-item position-relative mx-3 my-1 text-center"
            onMouseEnter={() => setHoveredCategory(cat._id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="fw-semibold text-dark category-name px-3 py-2 rounded">
              {cat.categoryname}
            </div>

            {/* ✅ Show subcategories when hovered */}
            {hoveredCategory === cat._id && (
              <div className="mega-menu shadow-lg position-absolute bg-white p-4 rounded">
                <div className="row">
                  {Object.entries(getGroupedSubcategories(cat._id)).map(
                    ([groupName, subs]) => (
                      <div className="col-md-3 col-sm-6" key={groupName}>
                        {groupName !== "Other" && (
                          <h6 className="fw-bold text-primary mb-2 border-bottom pb-1">
                            {groupName}
                          </h6>
                        )}
                        {subs.map((sub) => (
                          <div
                            key={sub.id}
                            className="subcategory-item py-1 text-secondary"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSubcategoryClick(sub)}
                          >
                            {sub.name}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
