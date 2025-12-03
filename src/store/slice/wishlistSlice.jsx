import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

// ✅ Fetch wishlist products
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${Baseurl}/wishlist/getwish`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Ensure always returns an array
      if (Array.isArray(res.data.wishlist)) {
        return res.data.wishlist;
      } else if (Array.isArray(res.data.products)) {
        return res.data.products;
      } else {
        return [];
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Add product to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${Baseurl}/wishlist/wish`, // 👈 matches your backend route
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Normalize response to always return array
      if (Array.isArray(res.data.wishlist)) {
        return res.data.wishlist;
      } else if (Array.isArray(res.data.products)) {
        return res.data.products;
      } else {
        return [];
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Remove a product from wishlist
export const removeProductFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${Baseurl}/wishlist/deletewish/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Normalize again
      if (Array.isArray(res.data.wishlist)) {
        return res.data.wishlist;
      } else if (Array.isArray(res.data.products)) {
        return res.data.products;
      } else {
        return [];
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [], // ✅ Always array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add product
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })

      // Remove product
      .addCase(removeProductFromWishlist.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
      });
  },
});

export default wishlistSlice.reducer;
