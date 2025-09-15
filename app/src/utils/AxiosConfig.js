import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:7677/api",
  timeout: 3000,
});

export default axiosInstance;
