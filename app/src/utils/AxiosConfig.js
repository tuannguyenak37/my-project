import axios from "axios";


const axiosInstance = axios.create({
  baseURL: "http://localhost:7677/api",
  timeout: 10000,
  withCredentials: true, // rất quan trọng: gửi cookie tự động
  credentials: "include",
});

export default axiosInstance;
