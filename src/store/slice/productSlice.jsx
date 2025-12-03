import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

const ProductSlice = createSlice({
  name: "product",
  initialState: {
    productlist: [],
    productupdate: null,
    productdelete: null,
    singleproduct:null
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
    setsinglepro:(state,action)=>{
      state.singleproduct =action.payload
    }
  },
});

export const {
  setproduct,
  setproupdate,
  colsseupdate,
  setprodelete,
  closeprodelete,
  setsinglepro
} = ProductSlice.actions;
export default ProductSlice.reducer;

// ✅ Thunk: Fetch all or category-filtered products
export const getproduct =
  (filters = {}) =>
  async (dispatch) => {
    try {
      const { category, subcategory, query } = filters;

      let url = `${Baseurl}/product/getallproduct`;
      const queryParams = [];

      if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
      if (subcategory) queryParams.push(`subcategory=${encodeURIComponent(subcategory)}`);
      if (query) queryParams.push(`query=${encodeURIComponent(query)}`);

      if (queryParams.length > 0) url += `?${queryParams.join("&")}`;

      const res = await axios.get(url);
      console.log("Fetched Products:", res.data);

      dispatch(setproduct(res.data?.data || []));
    } catch (error) {
      console.error("Error fetching products:", error);
      dispatch(setproduct([]));
    }
  };
