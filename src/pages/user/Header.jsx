import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Col, Row} from 'react-bootstrap'
import { LuUserRound,LuSearch,LuShoppingCart } from "react-icons/lu";
import { Link } from 'react-router-dom';
const Header = () =>{
    return(
            <Navbar expand="lg" className="header_color">
        <Container>
        <Navbar.Brand href="#home" className='fw-bold font-color'>THE SAFAR STORE</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='d-flex py-2 justify-content-center align-items-center '>
          <Nav className="m-auto ">
            <Link to='/' className="mx-3 px-2 py-2 text-decoration-none fw-bold font-color">Home</Link>
            <Link to='/categories' className="mx-3 px-2 py-2 text-decoration-none fw-bold font-color">Categories</Link>
            <Link to='/about' className="mx-3 px-2 py-2 text-decoration-none fw-bold font-color">About</Link>
            <Link to='/contact' className="mx-3 px-2 py-2 text-decoration-none fw-bold font-color">Contact</Link>
          </Nav>
        <Row>
            <Col className='singup'>
                <div >
                <LuUserRound className='fs-5 font-color' />
                <div className="login_sub header_color">
                    <div className="d-flex flex-column text-start ">
                        <Link to="/Signin" className="p-3 border-bottom font-color text-decoration-none">
                            Sign in
                        </Link>
                        <Link to="/Signup" className="p-3 border-bottom font-color text-decoration-none">
                            Sing up
                        </Link>
                    </div>
                </div>
                </div>
            </Col>
            <Col>
                <div><LuSearch className='fs-5 font-color' /></div>            
            </Col>
            <Col>
                <div><LuShoppingCart className='fs-5 font-color' /></div>
            </Col>
        </Row>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    )
}
export default Header