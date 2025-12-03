import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

const subcategorylist = createSlice({
    name:'subcategory',
    initialState:{
        subcategorylist:[],
        subcategoryupdate:null,
        subcategorydelete:null,
    },
    reducers:{
        setsubcategory:(state,action)=>{
            state.subcategorylist= action.payload
        },
        setsubupdate:(state,actions)=>{
            state.subcategoryupdate= actions.payload
        },
        closesubupdate:(state)=>{
            state.subcategoryupdate= null
        },
        setsubdelete:(state,actions) => {
            state.subcategorydelete = actions.payload
        },
        closesubdelete:(state) =>{
            state.subcategorydelete = null
        }

    }
})

export const {setsubcategory,setsubupdate,closesubupdate,setsubdelete,closesubdelete} = subcategorylist.actions
export default subcategorylist.reducer

export const getsubcate = () => async(dispatch)=>{
    try{
        const res = await axios.get(`${Baseurl}subcategory/getallsubcategory`)
        console.log(res.data.data);
        dispatch(setsubcategory(res.data.data))
    }
    catch(error){
        console.log(error);
        
    }
}