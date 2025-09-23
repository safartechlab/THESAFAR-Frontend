import {createSlice} from '@reduxjs/toolkit'

const toastSlice = createSlice({
    name:'toast',
    initialState:{
        message:'',
        type:''
    },
    reducers:{
        showToast(state,actions){
            state.message= actions.payload.message,
            state.type = actions.payload.type
        },
        closeToast(state){
            state.message='',
            state.type = ''
        }
    }
})

export const {showToast , closeToast} = toastSlice.actions
export default toastSlice.reducer