import axiosInstance from "../AxiosConfig.js";

const crateshop = async (data) => {
  const URL_API = "/newshop";

  return await axiosInstance.post(URL_API, data);
};

const Shop = { crateshop };
export default Shop;
