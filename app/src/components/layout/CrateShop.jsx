import React from "react";
import { useForm } from "react-hook-form";
import API from "../../utils/API/shop.js";
export default function ShopForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    // Gửi data lên API backend
    try {
      const res = await API.crateshop(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Tạo Shop Mới</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Tên shop */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên Shop
          </label>
          <input
            type="text"
            {...register("ten_shop", { required: "Tên shop là bắt buộc" })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.ten_shop && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ten_shop.message}
            </p>
          )}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            {...register("mo_ta")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Thể loại */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thể loại
          </label>
          <input
            type="text"
            {...register("the_loai")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Tạo Shop
        </button>
      </form>
    </div>
  );
}
