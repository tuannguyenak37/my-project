import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: "http://localhost:7677/api",
  timeout: 10000,
  withCredentials: true, // rất quan trọng: gửi cookie tự động
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        console.warn("⚠️ Token hết hạn, gọi refresh");

        try {
          // gọi API refresh token, backend sẽ lấy refresh token từ cookie
          const res = await axios.post(
            "http://localhost:7677/api/refresh-token",
            {}, // không cần gửi gì, cookie đã có
            { withCredentials: true }
          );

          token = res.data.accessToken;
          localStorage.setItem("token", token);
        } catch (err) {
          console.error("Refresh token cũng hết hạn → buộc login lại");
          localStorage.clear();
          window.location.href = "/login";
        }
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
