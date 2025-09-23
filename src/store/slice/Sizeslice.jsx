import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

const Sizeslice = createSlice({
    name:'size',
    initialState:{
        sizelist:[],
        sizeupdate:null,
        sizedelete:null
    },
    reducers:{
        setsize:(state,action)=>{
            state.sizelist=action.payload
        },
        setupdatesize:(state,actions)=>{
            state.sizeupdate = actions.payload
        },
        closesizeupdate:(state)=>{
            state.sizeupdate=null
        },
        setdeletesize:(state,actions)=>{
            state.sizedelete = actions.payload
        },
        closesizedelete:(state)=>{
            state.sizedelete = null
        }
    }
})

export const {setsize,setupdatesize,closesizeupdate,setdeletesize,closesizedelete} = Sizeslice.actions
export default Sizeslice.reducer

export const getsize = () => async(dispatch) =>{
    try{
        const res = await axios.get(`${Baseurl}size/getallsize`)
        console.log(res.data.data);
        dispatch(setsize(res.data.data))
    }
    catch(error){
        console.log(error);       
    }
}