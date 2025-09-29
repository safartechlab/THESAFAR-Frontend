import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

const ProductSlice = createSlice({
    name:'product',
    initialState:{
        productlist:[] 
    },
    reducers:{
        setproduct:(state,action)=>{
            state.productlist=action.payload
        },
    }
})

export const {setproduct} = ProductSlice.actions
export default ProductSlice.reducer

export const getproduct = () => async(dispatch)=>{
    try{
        const res = await axios.get(`${Baseurl}product/getallproduct`)
        console.log(res.data.data);
        dispatch(setproduct(res.data.data))        
    }
    catch(error){
        console.log(error);
        
    }
}