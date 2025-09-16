import { createSlice } from "@reduxjs/toolkit";

// ✅ Chỉ đọc localStorage khi ở client
const storedUser =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;
const storedToken =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isLoggedIn: !!storedToken,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;

      // ✅ Chỉ lưu khi ở client
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
