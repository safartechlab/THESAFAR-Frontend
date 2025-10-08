import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

const ProductSlice = createSlice({
  name: "product",
  initialState: {
    productlist: [],
    productupdate: null,
    productdelete: null,
  },
  reducers: {
    setproduct: (state, action) => {
      state.productlist = action.payload;
    },
    setproupdate: (state, action) => {
      state.productupdate = action.payload;
    },
    colsseupdate: (state) => {
      state.productupdate = null;
    },
    setprodelete: (state, action) => {
      state.productdelete = action.payload;
    },
    closeprodelete: (state) => {
      state.productdelete = null;
    },
  },
});

export const {
  setproduct,
  setproupdate,
  colsseupdate,
  setprodelete,
  closeprodelete,
} = ProductSlice.actions;
export default ProductSlice.reducer;

// ✅ Thunk: Fetch all or category-filtered products
export const getproduct =
  (filters = {}) =>
  async (dispatch) => {
    try {
      
      const { category } = filters; 
      
      const url = category
        ? `${Baseurl}product/getallproduct?category=${category}` 
        : `${Baseurl}product/getallproduct`;

      const res = await axios.get(url);

      dispatch(setproduct(res.data?.data || []));
    } catch (error) {
      console.error("Error fetching products:", error);
      dispatch(setproduct([]));
    }
  };
