import { data } from "react-router-dom";
import axiosInstance from "../../AxiosConfig.js";

const getallbill = async () => {
  const URL_API = "/getallbill";

  return await axiosInstance.get(URL_API);
};
const getallbillshop = async () => {
  const URL_API = "/getallbillshop";

  return await axiosInstance.get(URL_API);
};
const updatebill = async (data) => {
  console.log("data ", data);
  const URL_API = "/updatebill";

  return await axiosInstance.put(URL_API, data);
};
const updateBillRefunded = async (data) => {
  console.log("data ", data);
  const URL_API = "/updateBillRefunded";

  return await axiosInstance.put(URL_API, data);
};
const getBillDetail = async (data) => {
  console.log("data ", data);
  const URL_API = `/getBillDetail/${data}`;

  return await axiosInstance.get(URL_API);
};
const feedBack = async (data) => {
  const URL_API = `/newfeedback`;

  return await axiosInstance.get(URL_API, data);
};
const bill = {
  getallbill,
  getallbillshop,
  updatebill,
  updateBillRefunded,
  getBillDetail,
  feedBack,
};
export default bill;
