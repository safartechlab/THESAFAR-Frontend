import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Baseurl } from "../../baseurl";

// =========================
// Helper: auth header
// =========================
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// =========================
// Helper: Enrich Cart With Product Details
// =========================
const enrichCart = async (cartItems) => {
  return Promise.all(
    cartItems.map(async (item) => {
      // safely extract the product ID
      const productId = item.product?._id || item.product || item.productId;

      if (!productId) {
        console.error("❌ No product ID found for cart item:", item);
        return item; // prevent crash
      }

      const p = await axios.get(`${Baseurl}product/getproduct/${productId}`);

      return {
        ...item,
        productDetails: p.data,
      };
    })
  );
};

// =========================
// GET CART
// =========================
export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${Baseurl}cart/getcart`, {
      headers: getAuthHeaders(),
    });

    const enriched = await enrichCart(res.data.items || []);
    return enriched;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch cart"
    );
  }
});

// =========================
// ADD TO CART
// =========================
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, sizeId, size, quantity, price }, thunkAPI) => {
    try {
      await axios.post(
        `${Baseurl}cart/addtocart`,
        { productId, quantity, sizeId, size, price },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updated = await axios.get(`${Baseurl}cart/getcart`, {
        headers: getAuthHeaders(),
      });

      return await enrichCart(updated.data.items || []);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

// =========================
// UPDATE QUANTITY
// =========================
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ cartItemId, quantity }, thunkAPI) => {
    try {
      await axios.put(
        `${Baseurl}cart/updatecart/${cartItemId}`,
        { quantity },
        { headers: getAuthHeaders() }
      );

      const updated = await axios.get(`${Baseurl}cart/getcart`, {
        headers: getAuthHeaders(),
      });

      return await enrichCart(updated.data.items || []);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

// =========================
// REMOVE ITEM
// =========================
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ cartItemId, productName }, thunkAPI) => {
    try {
      await axios.delete(`${Baseurl}cart/removecart/${cartItemId}`, {
        headers: getAuthHeaders(),
      });

      const updated = await axios.get(`${Baseurl}cart/getcart`, {
        headers: getAuthHeaders(),
      });

      const enriched = await enrichCart(updated.data.items || []);

      return {
        items: enriched,
        removedProduct: productName,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

// =========================
// CLEAR CART
// =========================
export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  try {
    await axios.delete(`${Baseurl}cart/clear`, { headers: getAuthHeaders() });
    return [];
  } catch {
    return [];
  }
});

// ==================================================
// SLICE
// ==================================================
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartlist: [],
    loading: false,
    error: null,
    removedProduct: null,
  },

  reducers: {
    setCart: (state, action) => {
      state.cartlist = action.payload;
    },
    incrementQty: (state, action) => {
      const item = state.cartlist.find((i) => i._id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQty: (state, action) => {
      const item = state.cartlist.find((i) => i._id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    clearCartState: (state) => {
      state.cartlist = [];
      state.error = null;
      state.removedProduct = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartlist = action.payload;
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
        state.removedProduct = action.payload.removedProduct;
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.cartlist = [];
      });
  },
});

export const { incrementQty, decrementQty, clearCartState, setCart } =
  cartSlice.actions;
export default cartSlice.reducer;
