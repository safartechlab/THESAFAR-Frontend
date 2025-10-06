import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

const OrderSlice = createSlice({
  name: "order",
  initialState: {
    orderlist: [],
    orderupdate: null,
    loading: false,
    error: null,
  },
  reducers: {
    setorder: (state, action) => {
      state.orderlist = action.payload;
      state.loading = false;
      state.error = null;
    },
    setorderupdate: (state, action) => {
      state.orderupdate = action.payload;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setorder, setorderupdate, setLoading, setError } = OrderSlice.actions;
export default OrderSlice.reducer;

export const getorder = () => async (dispatch) => {
  try {
    dispatch(setLoading());
     const token = localStorage.getItem("token");
    const res = await axios.get(`${Baseurl}order/getallorders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setorder(res.data));
  } catch (error) {
    console.error(error);
    dispatch(setError(error.message || "Failed to fetch orders"));
  }
};
