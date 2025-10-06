import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getproduct, setprodelete, setproupdate } from "../../../store/slice/productSlice";
import Table from "react-bootstrap/Table";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Deleteproduct from "./Deleteproduct";

const Getproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productList = useSelector((state) => state.product.productlist);

  useEffect(() => {
    dispatch(getproduct());
  }, [dispatch]);

  const handleEdit = (product) => {
    dispatch(setproupdate(product));
    navigate("/admin/Updateproduct");
  };

  return (
    <>
      <Table striped bordered hover className="text-center align-middle">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Images</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {productList?.map((pro, index) => (
            <tr key={pro._id || index}>
              <td>{index + 1}</td>

              {/* Images */}
              <td>
                {pro?.images?.length > 0 ? (
                  <div className="d-flex flex-wrap justify-content-center">
                    {pro.images.slice(0, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.filepath}
                        alt={img.filename || `img-${idx}`}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "5px",
                          margin: "2px",
                        }}
                      />
                    ))}
                    {pro.images.length > 3 && <span>+{pro.images.length - 3}</span>}
                  </div>
                ) : (
                  "No Image"
                )}
              </td>

              {/* Product Name */}
              <td>{pro.productName}</td>

              {/* Price */}
              <td>
                {pro?.sizes?.length > 0
                  ? pro.sizes.map((s, idx) => (
                      <div key={s._id || idx}>₹{s.price}</div>
                    ))
                  : `₹${pro.price}`}
              </td>

              {/* Stock */}
              <td>
                {pro?.sizes?.length > 0
                  ? pro.sizes.map((s, idx) => (
                      <div key={s._id || idx}>{s.stock}</div>
                    ))
                  : pro.stock}
              </td>

              {/* Update */}
              <td>
                <FiEdit
                  className="fs-5"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdit(pro)}
                />
              </td>

              {/* Delete */}
              <td>
                <RiDeleteBinFill
                  className="fs-5 text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => dispatch(setprodelete(pro))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Delete Modal */}
      <Deleteproduct />
    </>
  );
};

export default Getproduct;
