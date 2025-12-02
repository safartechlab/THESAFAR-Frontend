import {configureStore} from '@reduxjs/toolkit'
import toastReducer from './slice/toast_slice'
import authReducer from './slice/authSlice'
import adminReducer from './slice/Adminmainslice'
import categoryReducer from './slice/category_slice'
import subcategoryReducer from './slice/Subcategoryslice'
import sizeReducer from './slice/Sizeslice'
import productReducer from './slice/productSlice'
import orderReducer from "./slice/OrderSlice"
import cartReducer from "./slice/CartSlice"
import wishReducer from "./slice/wishlistSlice"
import buyNowReducer  from "./slice/Buynowslice"
const store = configureStore({
    reducer:{
        toast:toastReducer,
        auth:authReducer,
        sidebar:adminReducer,
        category:categoryReducer,
        subcategory:subcategoryReducer,  
        size:sizeReducer,
        product:productReducer,
        order : orderReducer,
        cart : cartReducer,
        wishlist : wishReducer,
        buynow: buyNowReducer,
    }
})

export default store