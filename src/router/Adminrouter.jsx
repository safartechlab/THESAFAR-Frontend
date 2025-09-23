import { Route,Routes } from "react-router-dom"
import Adminlayout from "../layout/Adminlayout"
import Dashboard from "../pages/admin/Dashboard"
import Addproduct from "../pages/admin/Product/Addproduct"
import Getproduct from "../pages/admin/Product/ListingProduct"
import Addcategory from "../pages/admin/category/Addcategory"
import Addsubcategory from "../pages/admin/Subcategory/Addsubcategory"
import Addsize from "../pages/admin/size/Addsize"
import Order from "../pages/admin/Order"
const AdminRoutes =() =>{
    return(
        <>
            <Routes>
                <Route path="/admin" element={<Adminlayout/>}>
                    <Route index element={<Dashboard/>}/>
                    <Route path="/admin/Addproduct" element={<Addproduct/>} />
                    <Route path="/admin/Getproduct" element={<Getproduct/>} />
                    <Route path="/admin/Addcategory" element={<Addcategory/>}/>
                    <Route path="/admin/Addsubcategory" element={<Addsubcategory/>} />
                    <Route path="/admin/Addsize" element={<Addsize/>} />
                    <Route path="/admin/Order" element={<Order/>} />
                </Route>
            </Routes>
        </>
    )
}

export default AdminRoutes