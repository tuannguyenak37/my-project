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
const bill = { getallbill, getallbillshop, updatebill };
export default bill;
