import { createSlice } from "@reduxjs/toolkit";

const Adminslice = createSlice({
    name:'sidebar',
    initialState:{
        sidebarbutton:true
    },
    reducers:{
        setsidebar:(state)=>{
            state.sidebarbutton =!state.sidebarbutton
        }
    }
})

export const {setsidebar} = Adminslice.actions
export default Adminslice.reducer