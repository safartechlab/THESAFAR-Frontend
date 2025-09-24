import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getcategory } from "../../store/slice/category_slice"; 
import "../../safar_css/user.css";

const Categoryslider = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categorylist);

  useEffect(() => {
    dispatch(getcategory());
  }, [dispatch]);

  return (
    <div className="container-fluid category-tags d-flex flex-nowrap overflow-auto">
        {categories.map((cat) => (
          <span className="category mx-2" key={cat._id}>
            {cat.categoryname}
          </span>
        ))}
    </div>
  );
};

export default Categoryslider;
