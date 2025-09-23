import { createSlice } from "@reduxjs/toolkit";

const authslice = createSlice({
    name: "auth",
    initialState: {
        auth: false,
        user: {},
    },
    reducers: {
        initiallogin: (state, action) => {
            state.auth = true;
            state.user = action.payload;
            // localStorage.setItem("user", JSON.stringify(action.payload)); // persist
        },
        clearauth: (state) => {
            state.auth = false;
            state.user = {};
            localStorage.removeItem("user"); // clear
        }
    }
});

export const { initiallogin, clearauth } = authslice.actions;
export default authslice.reducer;
