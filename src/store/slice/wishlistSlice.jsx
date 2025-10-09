import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

// Fetch wishlist products
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${Baseurl}wishlist/getwish`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.wishlist || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove a product from wishlist
export const removeProductFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${Baseurl}wishlist/deletewish/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.products || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeProductFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
