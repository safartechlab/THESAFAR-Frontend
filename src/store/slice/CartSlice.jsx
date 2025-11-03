import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

// 🧠 Helper: Get token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// 🛒 Fetch Cart
export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${Baseurl}cart/getcart`, getAuthHeader());
    return res.data.items || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// ➕ Add to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, sizeId, quantity }, thunkAPI) => {
    try {
      // ✅ Ensure proper ID structure
      const payload = {
        productId,
        sizeId: sizeId || null, // highlight change
        quantity: quantity || 1, // highlight change
      };

      const res = await axios.post(`${Baseurl}cart/addtocart`, payload, getAuthHeader());
      return res.data.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔁 Update Cart Quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, sizeId, quantity }, thunkAPI) => {
    try {
      // ✅ Always send consistent identifiers
      const payload = {
        productId,
        sizeId: sizeId || null, // highlight change
        quantity: Math.max(1, quantity), // highlight change (no zero qty)
      };

      const res = await axios.put(`${Baseurl}cart/updatecart`, payload, getAuthHeader());
      return res.data.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ❌ Remove from Cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ cartItemId, productName }, thunkAPI) => {
    try {
      if (!cartItemId) throw new Error("Invalid cart item ID");

      await axios.delete(`${Baseurl}cart/removecart/${cartItemId}`, getAuthHeader());

      // ✅ Re-fetch updated cart after removal
      const updatedRes = await axios.get(`${Baseurl}cart/getcart`, getAuthHeader());

      return { items: updatedRes.data.items || [], removedProduct: productName };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🧩 Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartlist: [],
    loading: false,
    error: null,
    removedProduct: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Get Cart ---
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

      // --- Add to Cart ---
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

      // --- Update Quantity ---
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        // ✅ Immediately update cart UI
        state.cartlist = action.payload;
        state.loading = false;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Remove from Cart ---
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
