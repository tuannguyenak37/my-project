import React, { useState } from "react";
import Nagiveadmin from "./nagiveadmin";
import { useForm } from "react-hook-form";
import axios from "../../../utils/API/sanpham.js";
import { useEffect } from "react";

export default function Sanpham() {
  const [is_addSP, setIs_addSP] = useState(false);
  const [kho, setKho] = useState([]); // ← lưu mảng kho

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const handel_addSP = async (data) => {
    console.log("Dữ liệu sản phẩm:", data);
    try {
      const response = await axios.addSP(data);
      console.log("Success:", response.data);
    } catch (error) {
      if (error.response) {
        // Backend trả lỗi (có status code khác 2xx)
        console.log("Status:", error.response.status); // ví dụ: 400, 500
        console.log("Data:", error.response.data); // dữ liệu backend gửi về
        console.log("Message:", error.response.data.message); // nếu backend gửi {message: "lỗi"}
      } else if (error.request) {
        // Request đã gửi đi nhưng không nhận được response
        console.log("No response:", error.request);
      } else {
        // Lỗi khi cấu hình request
        console.log("Error:", error.message);
      }
    }

    reset();
    setIs_addSP(false);
  };
  useEffect(() => {
    const xemkho = async () => {
      try {
        const res = await axios.xemkho();
        setKho(res.data.data); // ← set vào state
        console.log(">>>", res.data.data);
      } catch (error) {
        console.log("Lỗi:", error.response?.data || error.message);
      }
    };
    xemkho();
  }, []);

  const handleShowForm = () => setIs_addSP(true);
  const handleCloseForm = () => setIs_addSP(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Nagiveadmin />

      {/* Content chính */}
      <div className="flex-1 p-4 mt-2.5">
        <div className="flex gap-2 mb-4 justify-center">
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Tên sản phẩm"
          />
          <button
            onClick={handleShowForm}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Thêm sản phẩm
          </button>
        </div>

        {/* Nội dung khác */}
        <div>{/* Ví dụ danh sách sản phẩm */}</div>
      </div>

      {/* Form Thêm sản phẩm */}
      {is_addSP && (
        <div className="fixed inset-0 bg-gray-100 flex justify-center items-center z-50">
          <div className="bg-white p-6 shadow-lg w-96 relative rounded-2xl">
            <h2 className="text-xl font-bold mb-4 text-center">
              Thêm sản phẩm
            </h2>

            <form onSubmit={handleSubmit(handel_addSP)}>
              <input
                {...register("ten_sanpham", { required: true })}
                type="text"
                placeholder="Tên sản phẩm"
                className="w-full border p-2 mb-2 rounded"
              />
              {errors.ten_sanpham && (
                <p className="text-red-500 text-sm">Tên sản phẩm bắt buộc</p>
              )}

              <input
                {...register("gia_ban", { required: true, min: 0 })}
                type="number"
                placeholder="Giá"
                className="w-full border p-2 mb-2 rounded"
              />
              {errors.gia_ban && (
                <p className="text-red-500 text-sm">Giá hợp lệ bắt buộc</p>
              )}

              <textarea
                {...register("mo_ta")}
                placeholder="Mô tả"
                className="w-full border p-2 mb-2 rounded"
              ></textarea>

              <input
                {...register("so_luong_ton", { required: true, min: 0 })}
                type="number"
                placeholder="Số lượng"
                className="w-full border p-2 mb-2 rounded"
              />
              {errors.so_luong_ton && (
                <p className="text-red-500 text-sm">Số lượng hợp lệ bắt buộc</p>
              )}

              <select {...register("kho_id", { required: true })}>
                <option value="">Chọn kho</option>
                {kho.map((item) => (
                  <option key={item.kho_id} value={item.kho_id}>
                    {item.ten_kho} - {item.dia_chi}
                  </option>
                ))}
              </select>

              {errors.kho_id && (
                <p className="text-red-500 text-sm">Vui lòng chọn kho</p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={handleCloseForm}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
