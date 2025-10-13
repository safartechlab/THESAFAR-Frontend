import { Route, Routes } from "react-router-dom";
import Endlayout from "../layout/endlayout";
import Home from "../pages/user/Home";
import Signin from "../pages/user/Signin";
import Aboutus from "../pages/user/Aboutus";
import Contact from "../pages/user/Contact";
import Signup from "../pages/user/Signup";
import Forgotpassword from "../pages/user/Forgotpassword";
import OtpVerification from "../pages/user/Otpverification";
import ResetPassword from "../pages/user/Resetpassword";
import SuccessPage from "../pages/user/Successpage";
import Product from "../pages/user/Categories";
import Cart from "../pages/user/Cart";
import Wishlist from "../pages/user/Wish";
import MyAccount from "../pages/user/Myaccount";
import MyOrders from "../pages/user/Myorders";
const Endrouter = () => { 
  return (
    <Routes>
      <Route path="/" element={<Endlayout />}>
        <Route index element={<Home />} />
        <Route path="/categories" element={<Product />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/otpverify" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/wishlist" element={<Wishlist/>}/>
        <Route path="/myaccount" element={<MyAccount/>}/>
        <Route path="/myorders" element={<MyOrders/>}/>
      </Route>
    </Routes>
  );
};

export default Endrouter;
