import {configureStore} from '@reduxjs/toolkit'
import toastReducer from './slice/toast_slice'
import authReducer from './slice/authSlice'
import adminReducer from './slice/Adminmainslice'
import categoryReducer from './slice/category_slice'
import subcategoryReducer from './slice/Subcategoryslice'
import sizeReducer from './slice/Sizeslice'
import productReducer from './slice/productSlice'
const store = configureStore({
    reducer:{
        toast:toastReducer,
        auth:authReducer,
        sidebar:adminReducer,
        category:categoryReducer,
        subcategory:subcategoryReducer,  
        size:sizeReducer,
        product:productReducer
    }
})

export default store