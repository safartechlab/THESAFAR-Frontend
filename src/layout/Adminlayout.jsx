import { Outlet } from "react-router-dom";
import Adminheader from "../pages/admin/Adminheader";
import Adminfooter from "../pages/admin/Adminfooter";
import { Col, Row } from "react-bootstrap";
import Sidebar from "../pages/admin/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { setsidebar } from "../store/slice/Adminmainslice";

const Adminlayout = () =>{
    const show = useSelector((state)=>state.sidebar.sidebarbutton)
    const dispatch = useDispatch()
    const handlechange = () => {
        dispatch(setsidebar())
    }
    return (
        <>
            <div className="w-100 h-100">
                <Row className="g-0 h-100">
                   {show && (

                       <Col xs={12} sm={3} md={2} lg={2} className="sidebar-color px-0 position-sticky top-0" style={{ height: "100vh", overflowY: "hidden",overflowX:'hidden', zIndex: 1000 }}>
                        <Sidebar />
                    </Col>
                   )} 
                    <Col xs={12} sm={show ? 9 : 12} md={show ? 10 : 12} lg={show ? 10 : 12} className="header_color px-0">
                        <Adminheader/>
                        <div className="px-2 px-md-4 py-3" style={{height: show ? "100vh" : "auto", overflowY: "auto", minHeight: "100vh" }}>
                            <Outlet/>
                        </div>
                        <Adminfooter/>
                    </Col>
                </Row>
            </div>
        </>
    )
}
export default Adminlayout