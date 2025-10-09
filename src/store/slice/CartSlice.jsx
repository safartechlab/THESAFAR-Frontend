import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

// Fetch Cart
export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${Baseurl}cart/getcart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.items || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Add to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${Baseurl}cart/addtocart`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Remove from Cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${Baseurl}cart/removecart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
       console.log(res);
      // Return updated cart
      const updatedRes = await axios.get(`${Baseurl}cart/getcart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return updatedRes.data.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartlist: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.cartlist = action.payload;
        state.loading = false;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartlist = action.payload;
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartlist = action.payload;
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
