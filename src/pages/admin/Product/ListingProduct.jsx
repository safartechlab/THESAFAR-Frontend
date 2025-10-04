import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getproduct, setprodelete, setproupdate } from "../../../store/slice/productSlice"
import Table from 'react-bootstrap/Table';
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinFill } from "react-icons/ri";
import UpdateProduct from "./updateproduct";
import { useNavigate } from "react-router-dom";
import Deleteproduct from "./Deleteproduct";
const Getproduct = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const product = useSelector((state) => state.product.productlist)
  const productupdate = useSelector((state)=>state.product.productupdate)
  useEffect(() => {
    dispatch(getproduct())
  }, [dispatch])

  const handleEdit = (pro) =>{
    dispatch(setproupdate(pro))
    navigate('/admin/Updateproduct')
  } 

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Images</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {product?.map((pro, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                {pro?.images?.[0]?.filepath && (
                  <img src={pro.images[0].filepath} style={{width: "60px",height: "60px",objectFit: "cover",borderRadius: "8px"}}/>
                )}
              </td>
              <td>{pro.productName}</td>

              {/* Price column */}
              <td>
                {pro?.sizes?.length > 0 ? (
                  pro.sizes.map((s, idx) => (
                    <div key={s._id || idx}>
                       ₹{s.price}
                    </div>
                  ))
                ) : (
                  <>₹{pro.price}</>
                )}
              </td>

              {/* Stock column */}
              <td>
                {pro?.sizes?.length > 0 ? (
                  pro.sizes.map((s, idx) => (
                    <div key={s._id || idx}>
                      {s.stock}
                    </div>
                  ))
                ) : (
                  <>{pro.stock}</>
                )}
              </td>
              <td>
                <FiEdit className="fs-5" style={{cursor:'pointer'}} onClick={()=>handleEdit(pro)} /> 

              </td>
              <td>
                <RiDeleteBinFill className="fs-5 text-danger" style={{cursor:'pointer'}} onClick={()=>dispatch(setprodelete(pro))}/>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* {productupdate && <UpdateProduct />} */}
      <Deleteproduct/>
    </>
  )
}

export default Getproduct
