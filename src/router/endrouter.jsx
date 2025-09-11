import { Route,Routes } from "react-router-dom"
import Endlayout from "../layout/endlayout"
import Home from "../pages/user/Home"
import Signin from "../pages/user/Signin"
import Categories from "../pages/user/Categories"
import Aboutus from "../pages/user/Aboutus"
import Contact from "../pages/user/Contact"
import Signup from "../pages/user/Signup"
const Endrouter = () => {
    return(
        <Routes>
            <Route path="/" element={<Endlayout/>}>
                <Route index element={<Home/>}/>
                <Route path="/categories" element={<Categories/>}/>
                <Route path="/about" element={<Aboutus/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/signin" element={<Signin/>}/>
            </Route>
        </Routes>
    )
}

export default Endrouter