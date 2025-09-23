import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Row, Col } from 'react-bootstrap';
import { LuUserRound, LuSearch, LuShoppingCart } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import { clearauth } from '../../store/slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';
// import logo from '../../../../logo.jpg'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userdetails = useSelector((state)=>state.auth?.user)
  const auth = useSelector((state)=>state.auth?.auth)

  const logout = () =>{
    localStorage.removeItem('token')
    dispatch(clearauth())
    navigate('/signin')
  }
  
  return (
    <Navbar expand="lg" className="header_color" sticky=''>
      <Container className='d-flex flex-column flex-lg-row align-items-center justify-content-between'>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 tagesschrift-regular text-decoration-none font-color">THE SAFAR.store</Navbar.Brand>
        {/* Toggle should be outside Collapse */}
        
        <Navbar.Collapse id="basic-navbar-nav" className='justify-content-between py-2'>
          <Nav className="m-auto text-center" >
            <Link to='/' className="mx-3 px-2 py-2 text-decoration-none fw-bold font-color">Home</Link>
            <Link to='/categories' className="mx-3 px-2 py-2 text-decoration-none fw-bold font-color">Categories</Link>
            <Link to='/about' className="mx-3 px-2 py-2 text-decoration-none fw-bold font-color">About</Link>
            <Link to='/contact' className="mx-3 px-2 py-2 text-decoration-none fw-bold font-color">Contact</Link>
          </Nav>
        </Navbar.Collapse>

          <Row className="align-items-center">
            <Col className='singup'>
  {!auth ? (
    <div className="position-relative">
      <LuUserRound className='fs-5 font-color' />
      <div className="login_sub header_color position-absolute">
        <div className="d-flex flex-column text-start">
          <Link to="/Signin" className="p-3 border-bottom font-color text-decoration-none">
            Sign in
          </Link>
          <Link to="/Signup" className="p-3 border-bottom font-color text-decoration-none">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="position-relative">
      <div className='d-flex' style={{cursor:'pointer'}}>
      <span className='fw-bold me-2 text-truncate'>{userdetails?.username}</span>
      {/* <LuUserRound className='fs-5 font-color'/> */}
      </div>
      <div className="login_sub header_color position-absolute">
        <div className="d-flex flex-column text-start">
          <Link to="/Signin" className="p-3 border-bottom font-color text-decoration-none">
            My Account
          </Link>
          <div onClick={logout} className="p-3 border-bottom font-color text-decoration-none" style={{cursor:'pointer'}}>
            Log Out
          </div>
        </div>
      </div>
    </div>
  )}
</Col>

            <Col><LuSearch className='fs-5 font-color' /></Col>
            <Col><LuShoppingCart className='fs-5 font-color' /></Col>
            <Col>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </Col>
          </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
