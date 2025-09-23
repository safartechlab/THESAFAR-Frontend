import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getsubcate, setsubdelete, setsubupdate } from "../../../store/slice/Subcategoryslice"
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinFill } from "react-icons/ri";
import {Row , Col} from "react-bootstrap"
import Updatesubcategory from "./updatesubcategory";
import Deletesubcategory from "./deletesubcategory";
const Getsubcategory = () =>{
    const dispatch = useDispatch()
    const getsubdata = useSelector((state)=>state.subcategory.subcategorylist)

    useEffect(()=>{
        dispatch(getsubcate())
    },[dispatch])  
    return(
        <>
        <Row>

            <Row className="text-start border-bottom fw-bold p-2 m-0">
  <Col>Sr.No</Col>
  <Col>Sub Category Name</Col>
  <Col>Category Name</Col>
  <Col>Sizes</Col> {/* new column */}
  <Col className="text-center">Edit</Col>
  <Col className="text-center">Delete</Col>
</Row>

{getsubdata.map((subcategory, i) => (
  <Row
    key={i}
    className="text-start border-bottom sidebar-color fw-bold p-2 m-0 align-items-center"
    style={{ color: "#e4e4e4" }}
  >
    <Col>{i + 1}</Col>
    <Col>{subcategory.subcategory}</Col>

    <Col className="text-wrap">{subcategory.category?.categoryname || subcategory.category}</Col>

    <Col className="text-wrap">
      {subcategory.sizes && subcategory.sizes.length > 0
        ? subcategory.sizes.map((s) => s.size).join(", ")
        : "—"}
    </Col>

    <Col className="text-center">
      <FiEdit
        className="fs-5"
        style={{ cursor: "pointer" }}
        onClick={() => dispatch(setsubupdate(subcategory))}
      />
    </Col>
    <Col className="text-center">
      <RiDeleteBinFill
        className="fs-5 text-danger"
        style={{ cursor: "pointer" }}
        onClick={() => dispatch(setsubdelete(subcategory))}
      />
    </Col>
  </Row>
))}

        <Updatesubcategory/>
        <Deletesubcategory/>
        </Row>

        </>
    )

}

export default Getsubcategory