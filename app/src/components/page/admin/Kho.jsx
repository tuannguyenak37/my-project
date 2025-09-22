import React, { use, useEffect, useState } from "react";
import NagiveAdmin from "./nagiveadmin";
import axios from "../../../utils/API/sanpham.js";
export default function Kho() {
  const [sanpham, setSanpham] = useState([]);
  const [isloading, setIsloading] = useState(false);
  useEffect(() => {
    const xemkho = async () => {
      try {
        const response = await axios.xemkho();

        setSanpham(response.data.data);
        setIsloading(true);
      } catch (error) {}
    };
    xemkho();
  }, []);
  return (
    <div className="flex">
      <NagiveAdmin />
      <div className="flex-1 p-4">
        <h2 className="text-xl font-bold mb-4 text-center">
          Danh sách sản phẩm
        </h2>

        {isloading ? (
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Tên sản phẩm</th>
                <th className="border p-2">Giá bán</th>
                <th className="border p-2">Số lượng</th>
                <th className="border p-2">Tên kho</th>
              </tr>
            </thead>
            <tbody>
              {sanpham.map((item) => (
                <tr key={item.sanpham_id}>
                  <td className="border p-2">{item.ten_sanpham}</td>
                  <td className="border p-2">{item.gia_ban} VND</td>
                  <td className="border p-2">{item.so_luong_ton}</td>
                  <td className="border p-2">{item.ten_kho}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="custom-loader"></div>
        )}
      </div>
    </div>
  );
}
