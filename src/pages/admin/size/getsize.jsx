import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinFill } from "react-icons/ri";
import {Row , Col} from "react-bootstrap"
import { getsize, setdeletesize, setupdatesize } from "../../../store/slice/Sizeslice"
import Updatesize from "./UpdateSize";
import Deletesize from "./Deletesize";
const Getsize = () => {
    const dispatch = useDispatch()
    const sizedata = useSelector((state)=>state.size.sizelist)
    useEffect(()=>{
        dispatch(getsize())
    },[dispatch])

    return(
        <>
            <Row>

          <Row className="text-start d-none d-md-flex border-bottom fw-bold p-2 m-0" style={{ backgroundColor: "#e4e4e4", color: "#5e6a75" }}>
          <Col md={2} className="text-center">Sr.No</Col>
          <Col md={8}>Size Name</Col>
          <Col md={1}>Update</Col>
          <Col md={1}>Delete</Col>
        </Row>
          
        {sizedata?.map((size,i)=>(
        <Row key={i} className="text-start border-bottom sidebar-color fw-bold p-2 m-0" style={{ color: "#e4e4e4" }}>
            <Col md={2} xs={2} className="text-center">
              {i + 1}
            </Col>
            <Col md={8} xs={7}>
              {size.size}
            </Col>
            <Col md={1} xs={1} className="text-center">
              <FiEdit
                className="fs-5"
                style={{ cursor: "pointer" }}
                onClick={() => dispatch(setupdatesize(size))}
              />
              <Updatesize />
            </Col>
            <Col md={1} xs={2} className="text-center">
              <RiDeleteBinFill
                className="fs-5"
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => dispatch(setdeletesize(size))}
              />
              <Deletesize />
            </Col>
          </Row>
      ))}
        </Row>

        </>
    )
}

export default Getsize