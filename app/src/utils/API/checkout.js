import axiosInstance from "../AxiosConfig.js";

const addKH = async () => {
  const URL_API = "admin/xemthongtinkho";

  return await axiosInstance.get(URL_API);
};
const chekout_pay = async (data) => {
  const URL_API = "/checkout";

  return await axiosInstance.post(URL_API, data);
};

const chekout = { chekout_pay };
export default chekout;
