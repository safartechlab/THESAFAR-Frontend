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
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Add to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, sizeId, quantity }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${Baseurl}cart/addtocart`,
        { productId, sizeId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, sizeId, quantity }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${Baseurl}cart/updatecart`, // ✅ must match backend route
        { productId, sizeId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Remove from Cart (fixed with product name)
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ cartItemId, productName }, thunkAPI) => {
    try {
      if (!cartItemId) throw new Error("Invalid cart item ID");

      const token = localStorage.getItem("token");
      await axios.delete(`${Baseurl}cart/removecart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Return updated cart
      const updatedRes = await axios.get(`${Baseurl}cart/getcart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { items: updatedRes.data.items || [], removedProduct: productName };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartlist: [],
    loading: false,
    error: null,
    removedProduct: null, // store name of removed product
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Cart
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
      // Add to Cart
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
      // Update Quantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cartlist = action.payload;
        state.loading = false;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.removedProduct = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartlist = action.payload.items;
        state.removedProduct = action.payload.removedProduct || null;
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
