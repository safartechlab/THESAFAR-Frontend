import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getcategory } from "../../store/slice/category_slice";
import { getsubcate } from "../../store/slice/Subcategoryslice";
import "../../safar_css/user.css";

const CategorySlider = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categorylist);
  const subcategories = useSelector(
    (state) => state.subcategory.subcategorylist
  );

  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    dispatch(getcategory());
    dispatch(getsubcate());
  }, [dispatch]);

  // Group subcategories by a property (like age group / type)
  const getGroupedSubcategories = (catId) => {
    const subs = subcategories.filter((subc) => subc.categoryID === catId);
    const grouped = {};
    subs.forEach((sub) => {
      if (!grouped[sub.group]) grouped[sub.group] = [];
      grouped[sub.group].push(sub.subcategory);
    });
    return grouped;
  };

  return (
    <div className="category-menu-container">
      <div className="d-flex category-bar">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="category-item mx-2"
            onMouseEnter={() => setHoveredCategory(cat._id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {cat.categoryname}

            {hoveredCategory === cat._id && (
              <div className="subcategory-dropdown p-3 shadow">
                <div className="d-flex">
                  {Object.entries(getGroupedSubcategories(cat._id)).map(
                    ([groupName, subs]) => (
                      <div className="me-4" key={groupName}>
                        {/* <h6 className="fw-bold">{groupName}</h6> */}
                        {subs.map((sub) => (
                          <div key={sub} className="subcategory-item">
                            {sub}
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
