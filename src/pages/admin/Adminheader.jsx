import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { BsListNested } from "react-icons/bs";
import { RiSearchLine } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { setsidebar } from '../../store/slice/Adminmainslice';
import { clearauth } from '../../store/slice/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Adminheader = ({ onSearchChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userdetails = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState("");

  const handlebtn = () => {
    dispatch(setsidebar());
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(clearauth());
    navigate('/');
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearchChange) onSearchChange(term); 
  };

  return (
    <Row className='py-3 px-2 mx-0 align-items-center font-color'>
      
      <Col xs={2} sm={1} className='text-center'>
        <button className='bg-transparent border-0' onClick={handlebtn}>
          <BsListNested className='fs-4 ' />
        </button>
      </Col>

      
      <Col xs={8} sm={5} md={4} className="mt-2 mt-sm-0">
        <Form className="d-flex align-items-center">
          <RiSearchLine className='fs-4 me-2' />
          <Form.Control type="search" placeholder="Search..." className="no-border bg-transparent px-2" value={searchTerm} onChange={handleSearchChange} style={{ backgroundColor: '#6e7c8a', border: 'none' }}/>
        </Form>
      </Col>

      
      <Col sm={2} md={4} className="d-none d-md-block"></Col>

      
      <Col xs={2} sm={4} md={3} className='d-flex align-items-center justify-content-end pe-3'>
        <div className='me-3 position-relative'>
          <IoMdNotifications className='fs-4' />
        </div>

        
        <div className="admin position-relative">
  <div className="d-flex align-items-center gap-2 cursor-pointer" style={{cursor:'pointer'}}>
    <span className='fs-5'>{userdetails?.username}</span>
    <FaRegUserCircle className="fs-4" />
  </div>

  {/* <div className="admin_sub">
    <div className="d-flex flex-column text-start">
      <Link to="/myaccount" className="p-3 border-bottom text-black text-decoration-none">
        My Account
      </Link>
      <div className="p-3 text-black cursor-pointer" onClick={logout}>
        Log out
      </div>
    </div>
  </div>*/}
</div> 

      </Col>
    </Row>
  );
};

export default Adminheader;
