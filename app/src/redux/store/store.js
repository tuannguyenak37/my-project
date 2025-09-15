import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../slices/counterSlice";
import userReducer from "../slices/User_data.js";
const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  },
});

export default store; // ✅ default export
