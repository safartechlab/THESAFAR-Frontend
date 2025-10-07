import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

const ProductSlice = createSlice({
    name:'product',
    initialState:{
        productlist:[],
        productupdate:null, 
        productdelete :null
    },
    reducers:{
        setproduct:(state,action)=>{
            state.productlist=action.payload
        },
        setproupdate:(state,actions)=>{
            state.productupdate = actions.payload
        },
        colsseupdate:(state)=>{
            state.productupdate = null
        },
        setprodelete:(state,actions) =>{
            state.productdelete = actions.payload
        },
        closeprodelete:(state) =>{
            state.productdelete = null
        }
    }
})

export const {setproduct , setproupdate , colsseupdate , setprodelete , closeprodelete} = ProductSlice.actions
export default ProductSlice.reducer

export const getproduct = (filters = {}) => async (dispatch) => {
  try {
    const { categoryId } = filters;

    // ✅ Build URL depending on whether a category is passed
    const url = categoryId
      ? `${Baseurl}product/getallproduct?category=${categoryId}`
      : `${Baseurl}product/getallproduct`;

    const res = await axios.get(url);
    console.log("Filtered Products:", res.data.data);

    dispatch(setproduct(res.data.data));
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
