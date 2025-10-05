import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api_SP from "../../utils/API/sanpham.js";
import { Link } from "react-router-dom";
export default function MalikethMall() {
  const [SP4, setSP4] = useState([]);

  const { mutate: xem_SP } = useMutation({
    mutationFn: () => api_SP.SP_client(),
    onSuccess: (res) => {
      setSP4(res.data.data);
    },
    onError: (error) => {
      console.error("❌ Lỗi khi gọi API:", error);
    },
  });

  // Gọi API 1 lần khi component mount
  useEffect(() => {
    xem_SP();
  }, []);

  return (
    <div className="mt-4 mx-3">
      <div className="shadow-lg rounded-2xl bg-white p-6 m-4 w-full">
        {/* Phần giới thiệu */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-blue-600 mb-3">
            Maliketh MALL
          </h2>
          <p className="text-gray-600 mb-4">
            Nơi mua sắm trực tuyến với nhiều ưu đãi hấp dẫn. Khám phá ngay các
            sản phẩm mới nhất!
          </p>
          <button className="w-full md:w-auto bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition">
            Khám phá ngay
          </button>
        </div>

        {/* Danh sách sản phẩm giảm giá */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {SP4.map((items) => (
            <div
              className="bg-gray-50 rounded-xl shadow-md p-3 text-center"
              key={items.sanpham_id}
            >
              <h1 className="text-lg font-semibold text-red-500 mb-2">
                🔥 Giảm giá
              </h1>
              <div className="aspect-[4/3] w-full bg-white rounded-2xl border border-gray-300 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src={items.url_sanpham}
                  alt={items.ten_sanpham}
                  className="w-full h-full object-contain"
                />
              </div>

              <h2 className="text-base font-semibold text-gray-800">
                {items.ten_sanpham}
              </h2>
              <p className="text-sm line-through text-gray-400">250.000đ</p>
              <p className="text-lg font-bold text-red-600">{items.gia_ban}đ</p>
              <Link
                to={`/product/${items.sanpham_id}`}
                className="mt-2 w-full bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition"
              >
                Mua ngay
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Block sản phẩm bán chạy */}
      <div className="shadow-lg rounded-2xl bg-white mt-3.5 border border-gray-300 p-4">
        <h1 className="text-2xl font-bold text-orange-500 mb-4">
          Sản phẩm bán chạy hàng đầu 😘
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gray-50 rounded-xl shadow-md p-3 text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Sản phẩm giảm giá"
              className="w-full h-28 object-cover rounded-lg mb-2"
            />
            <h2 className="text-base font-semibold text-gray-800">
              Áo Thun Nam
            </h2>
            <p className="text-sm line-through text-gray-400">250.000đ</p>
            <p className="text-lg font-bold text-red-600">199.000đ</p>
            <button className="mt-2 w-full bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition">
              Mua ngay
            </button>
          </div>
          {/* Thêm nhiều sản phẩm bán chạy khác ở đây */}
        </div>
      </div>
      <div className="shadow-lg rounded-2xl bg-white p-6 m-4 w-full">
        {/* Phần giới thiệu */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-blue-600 mb-3">
            Maliketh MALL ❤️sản phậm gợi ý cho bạn
          </h2>
          <p className="text-gray-600 mb-4">
            {" "}
            không biết mua gì hãy thử xem nào ?
          </p>
          <button className="w-full md:w-auto bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition">
            Khám phá ngay
          </button>
        </div>

        {/* Danh sách sản phẩm giảm giá */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {SP4.map((items) => (
            <div
              className="bg-gray-50 rounded-xl shadow-md p-3 text-center"
              key={items.sanpham_id}
            >
              <h1 className="text-lg font-semibold text-red-500 mb-2">
                💕 gọi ý cho bạn+
              </h1>
              <div className="aspect-[4/3] w-full bg-white rounded-2xl border border-gray-300 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src={items.url_sanpham}
                  alt={items.ten_sanpham}
                  className="w-full h-full object-contain"
                />
              </div>

              <h2 className="text-base font-semibold text-gray-800">
                {items.ten_sanpham}
              </h2>
              <p className="text-sm line-through text-gray-400">250.000đ</p>
              <p className="text-lg font-bold text-red-600">{items.gia_ban}đ</p>
              <Link
                to={`/product/${items.sanpham_id}`}
                className="mt-2 w-full bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition"
              >
                Mua ngay
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
