import axiosInstance from "../AxiosConfig.js";

const addSP = async (data) => {
  const URL_API = "admin/addSanpham";

  return await axiosInstance.post(URL_API, data);
};
const xemkho = async () => {
  const URL_API = "admin/xemkho";
  return await axiosInstance.get(URL_API);
};
const SP_client = async () => {
  const URL_API = "/SP";
  return await axiosInstance.get(URL_API);
};

const SP = { addSP, xemkho, SP_client };
export default SP;
