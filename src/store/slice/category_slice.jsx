import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

const categorylist = createSlice({
    name:'category',
    initialState:{
        categorylist:[],
        categoryupdate:null,
        categorydelete:null
    },
    reducers:{
        setcategory:(state,action)=>{
            state.categorylist = action.payload
        },
        setcategoryupdate :(state,actions)=>{
            state.categoryupdate = actions.payload
        },
        closeupdate:(state)=>{
            state.categoryupdate = null
        },
        setcategorydelete :(state,actions)=>{
            state.categorydelete = actions.payload
        },
        closedelete:(state)=>{
            state.categorydelete = null
        }
    }
})

export const {setcategory,setcategoryupdate,closeupdate,setcategorydelete,closedelete} = categorylist.actions
export default categorylist.reducer

export const getcategory = () =>async(dispatch)=>{
    try{
        const res = await axios.get(`${Baseurl}category/getallcategory`) 
        console.log(res.data);
        dispatch(setcategory(res.data.data))
    }
    catch(error){
        console.log(error);
    }
}