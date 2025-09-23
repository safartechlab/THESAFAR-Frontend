// import axios from "axios";
import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
// import { fetchdata, modalopco, setmodalcategory } from "../store/slice/Adminslice";
import Updatecategory from './Updatecategory';
import Deletecategory from "./deletecategory";
import { getcategory, setcategorydelete, setcategoryupdate } from "../../../store/slice/category_slice";

const Getcategory = () => {
  const dispatch = useDispatch();
  const getdata = useSelector((state) => state.category.categorylist);

  useEffect(() => {
    dispatch(getcategory());
  }, [dispatch]);
  return (
    <>
      <Row className="text-start border-bottom fw-bold p-2 m-0"
           style={{}}>
        <Col>Sr.No</Col>
        <Col>Category Image</Col>
        <Col>Category Name</Col>
        <Col className="text-center">Edit</Col>
        <Col className="text-center">Delete</Col>
      </Row>

      {getdata.map((category, i) => (
        <Row key={i} className="text-start border-bottom sidebar-color fw-bold p-2 m-0 align-items-center" style={{ color: '#e4e4e4' }}>
            <Col >{i + 1}</Col>
            <Col>
  {category?.categoryimage?.filepath && (
    <img
      src={`${category.categoryimage.filepath}`}
      alt={category.categoryname}
      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
    />
  )}
</Col>

            <Col className="text-wrap">{category.categoryname}</Col>
            <Col className="text-center">
            <FiEdit className="fs-5" style={{cursor:'pointer'}} onClick={()=>dispatch(setcategoryupdate(category))} /> <Updatecategory />
          </Col>
          <Col className="text-center">
            <RiDeleteBinFill className="fs-5 text-danger" style={{cursor:'pointer'}} onClick={()=>dispatch(setcategorydelete(category))}/>
          </Col>
        </Row>
      ))}

      
      
      <Deletecategory />
    </>
  );
};

export default Getcategory;
