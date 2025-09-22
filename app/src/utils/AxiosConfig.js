// src/utils/axiosInstance.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: "http://localhost:7677/api", // đổi theo backend của bạn
  timeout: 5000,
});

// interceptor cho request
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    if (token) {
      // giải mã token để check hạn
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // giây hiện tại

      if (decoded.exp < now) {
        console.warn("⚠️ Token hết hạn");

        // lấy refreshToken
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            // gọi API refresh token
            const res = await axios.post("http://localhost:8000/api/refresh", {
              token: refreshToken,
            });

            token = res.data.accessToken;
            localStorage.setItem("token", token);
          } catch (err) {
            console.error("Refresh token cũng hết hạn → buộc login lại");
            localStorage.clear();
            window.location.href = "/login";
          }
        } else {
          // không có refresh token → buộc login
          localStorage.clear();
          window.location.href = "/login";
        }
      }

      // gắn accessToken mới hoặc cũ vào request
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
