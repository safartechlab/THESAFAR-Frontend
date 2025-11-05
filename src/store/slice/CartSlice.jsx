import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

// 🧾 Fetch Cart
export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${Baseurl}cart/getcart`, {
      headers: { Authorization:` Bearer ${token} `},
    });
    return res.data.items || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 🛒 Add to Cart
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

// 🔄 Update Quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ cartItemId, quantity }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${Baseurl}cart/updatecart/${cartItemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ❌ Remove Item
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ cartItemId, productName }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${Baseurl}cart/removecart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    removedProduct: null,
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
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartlist = action.payload;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cartlist = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartlist = action.payload.items;
      });
  },
});

export default cartSlice.reducer;