import {Col, Row } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar';
import './page'
import { adminpages } from './page';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { BsListNested } from "react-icons/bs";
import {useDispatch,useSelector} from 'react-redux'
import { setsidebar } from '../../store/slice/Adminmainslice';

const Sidebar = () =>{
    const [openindex,setopenindex] = useState('')
    const show =useSelector((state)=>state.sidebar.sidebarbutton)
    const dispatch = useDispatch()
    const hanldeclose = () =>{
        dispatch(setsidebar())
    }
    
    return(
        <>
        
        <Row className='py-3 align-items-center px-0' >
            <Col>
            <Navbar.Brand as={Link} to="/admin" className="fw-bold fs-3 tagesschrift-regular text-decoration-none sidebar-text-color">THE SAFAR.store</Navbar.Brand>

            </Col>
            <Col md={2} sm={2} xs={3} className='d-xxl-none d-xl-none d-lg-none sidebar-color'>
          <button className='sidebar-color border border-0 lg:hidden' onClick={hanldeclose}><BsListNested style={{ width: '40px' }} className='fs-4 text-light' /></button>    
            </Col>
        </Row>
        <Row className='align-self-center'>
            <Col className='py-5'>
                <ul className='list-unstyled'>
                    {
                        adminpages.map((icon,index)=>(
                            <li key={index} className='d-flex gap-3 mb-2 align-items-center justify-self-start flex-column' style={{justifySelf:'start'}}>
                                <div className='d-flex gap-3 align-items-center justify-self-start'>
                                <div className='sidebar-text-color fs-3 ps-3 py-2'><icon.icon/></div>
                                {icon.path && (
                                    <Link to={icon.path} className='sidebar-text-color text-decoration-none' style={{fontSize:'20px'}}>{icon.name}</Link>
                                )}
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </Col>
            </Row>
        
        </>
    )
}

export default Sidebar