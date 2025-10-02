// src/redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

// helper để load từ localStorage an toàn
const loadCart = () => {
  if (typeof window !== "undefined" && localStorage.getItem("cart")) {
    return JSON.parse(localStorage.getItem("cart"));
  }
  return [];
};

const initialState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex(
        (item) => item.sanpham_id === product.sanpham_id
      );

      if (index >= 0) {
        state.items[index].so_luong += product.so_luong || 1;
      } else {
        state.items.push({ ...product, so_luong: product.so_luong || 1 });
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.sanpham_id !== action.payload
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", "[]");
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
