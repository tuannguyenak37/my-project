import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api_SP from "../../utils/API/sanpham.js";
import { Link } from "react-router-dom";

export default function MalikethMall() {
  const [SP4, setSP4] = useState([]);
  const [bestseller4, setbestseller4] = useState([]);
  const [random20, setRandom20] = useState([]);

  // API: Danh sách sản phẩm giảm giá
  const { mutate: xem_SP } = useMutation({
    mutationFn: () => api_SP.SP_client(),
    onSuccess: (res) => setSP4(res.data.data),
    onError: (error) => console.error("❌ Lỗi khi gọi API:", error),
  });

  // API: Sản phẩm gợi ý ngẫu nhiên
  const handelrandom20 = useMutation({
    mutationFn: () => api_SP.random20(),
    onSuccess: (res) => setRandom20(res.data.data),
    onError: (error) => console.error("❌ Lỗi khi gọi API:", error),
  });

  // API: Sản phẩm bán chạy
  const { mutate: bestseller } = useMutation({
    mutationFn: () => api_SP.bestseller(),
    onSuccess: (res) => setbestseller4(res.data.data),
    onError: (error) => console.error("❌ Lỗi khi gọi API:", error),
  });

  // Gọi API khi component mount
  useEffect(() => {
    xem_SP();
    bestseller();
    handelrandom20.mutate();
  }, []);

  // Hàm định dạng tiền tệ VND
  const formatVND = (value) =>
    value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) ||
    "0 ₫";

  return (
    <div className="mt-4 mx-3">
      {/* --- Phần giới thiệu chính --- */}
      <div className="shadow-lg rounded-2xl bg-white p-6 m-4 w-full">
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

        {/* --- Danh sách sản phẩm giảm giá --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {SP4.map((item) => (
            <div
              className="bg-gray-50 rounded-xl shadow-md p-3 text-center"
              key={item.sanpham_id}
            >
              <h1 className="text-lg font-semibold text-red-500 mb-2">
                🔥 Giảm giá
              </h1>
              <div className="aspect-[4/3] w-full bg-white rounded-2xl border border-gray-300 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src={item.url_sanpham}
                  alt={item.ten_sanpham}
                  className="w-full h-full object-contain"
                />
              </div>

              <h2 className="text-base font-semibold text-gray-800 mt-2">
                {item.ten_sanpham}
              </h2>
              <p className="text-sm line-through text-gray-400">250.000 ₫</p>
              <p className="text-lg font-bold text-red-600">
                {formatVND(item.gia_ban)}
              </p>
              <Link
                to={`/product/${item.sanpham_id}`}
                className="mt-2 w-full bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition"
              >
                Mua ngay
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* --- Sản phẩm bán chạy --- */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-5">
        <h1 className="text-2xl font-bold text-orange-500 mb-6 text-center">
          🏆 Sản phẩm bán chạy hàng đầu 😍
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {bestseller4.map((item) => (
            <div
              key={item.sanpham_id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 group"
            >
              <div className="relative w-full h-36 overflow-hidden">
                <img
                  src={item.url_sanpham}
                  alt={item.ten_sanpham}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                  HOT 🔥
                </div>
              </div>

              <div className="p-3 text-center">
                <h2 className="text-base font-semibold text-gray-800 truncate">
                  {item.ten_sanpham}
                </h2>
                <p className="text-lg font-bold text-red-600 mt-1">
                  {formatVND(item.gia_ban)}
                </p>

                <Link
                  to={`/product/${item.sanpham_id}`}
                  className="mt-3 w-full bg-orange-500 text-white py-1.5 px-3 rounded-xl font-medium hover:bg-orange-600 transition-colors duration-300"
                >
                  Mua ngay
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Sản phẩm gợi ý --- */}
      <div className="shadow-lg rounded-2xl bg-white p-6 m-4 w-full">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-blue-600 mb-3">
            Maliketh MALL ❤️ Sản phẩm gợi ý cho bạn
          </h2>
          <p className="text-gray-600 mb-4">
            Không biết mua gì? Hãy thử xem những gợi ý dưới đây nhé!
          </p>
          <button className="w-full md:w-auto bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition">
            Khám phá ngay
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {random20.map((item) => (
            <div
              className="bg-gray-50 rounded-xl shadow-md p-3 text-center"
              key={item.sanpham_id}
            >
              <h1 className="text-lg font-semibold text-red-500 mb-2">
                💕 Gợi ý cho bạn
              </h1>
              <div className="aspect-[4/3] w-full bg-white rounded-2xl border border-gray-300 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src={item.url_sanpham}
                  alt={item.ten_sanpham}
                  className="w-full h-full object-contain"
                />
              </div>

              <h2 className="text-base font-semibold text-gray-800 mt-2">
                {item.ten_sanpham}
              </h2>
              <p className="text-lg font-bold text-red-600">
                {formatVND(item.gia_ban)}
              </p>
              <Link
                to={`/product/${item.sanpham_id}`}
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
