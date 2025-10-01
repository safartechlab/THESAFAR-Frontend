import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getcategory } from "../../store/slice/category_slice";
import { getsubcate } from "../../store/slice/Subcategoryslice";
import "../../safar_css/user.css";

const Categoryslider = () => {
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

  return (
    <>
      <div className="container-fluid category-tags d-flex flex-nowrap overflow-auto">
        {categories.map((cat) => (
          <span
            className="category mx-2"
            key={cat._id}
            onMouseEnter={() => setHoveredCategory(cat._id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {cat.categoryname}
          </span>
        ))}
      </div>

      {hoveredCategory && (
        <div className="container-fluid subcategory-container">
          {subcategories
            .filter((subc) => subc.categoryID === hoveredCategory) 
            .map((subc) => (
              <span className="subcategory mx-2" key={subc._id}>
                {subc.subcategory}
              </span>
            ))}
        </div>
      )}
    </>
  );
};

export default Categoryslider;
