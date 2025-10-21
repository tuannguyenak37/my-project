import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import shearchAPI from "../../../utils/API/bill/shearch.js";
import apifeedback from "../../../utils/API/bill/feedback.js";
import { useParams } from "react-router-dom";

export default function SearchDetail() {
  const { keyword } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Feedback shop
  const fetchFeedback = useMutation({
    mutationFn: (data) => apifeedback.feedback_ofshop(data),
    onSuccess: (res) => {
      setFeedbacks(res.data.data.rating_trung_binh_shop || 0);
    },
  });

  // Search API
  const search = useMutation({
    mutationFn: (data) => shearchAPI.Sheacrch_Detail(data),
    onSuccess: (res) => {
      setSearchResults(res.data.data || []);
      setLoading(false);
    },
  });

  // Trigger search on keyword change
  useEffect(() => {
    if (keyword) {
      setLoading(true);
      search.mutate({ keyword });
    }
  }, [keyword]);

  // Format giá tiền
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // Lấy emoji cho sản phẩm
  const getProductEmoji = (name) => {
    name = name.toLowerCase();
    if (name.includes("hoa") || name.includes("hồng")) return "🌹";
    if (name.includes("cỏ")) return "🌿";
    return "🛍️";
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Kết quả tìm kiếm cho: <span className="text-primary">{keyword}</span>
        </h1>
        <p className="text-gray-600">
          Đánh giá trung bình shop: {feedbacks} ⭐
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="loading-spinner border-4 border-gray-200 border-t-4 border-t-red-600 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🔍</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            Không tìm thấy sản phẩm
          </h3>
          <p className="text-gray-500 mb-6">Thử tìm kiếm từ khóa khác</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map((product, index) => (
            <div
              key={product.sanpham_id}
              className="product-card glass-effect rounded-2xl overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <div className="w-full h-56 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                  <div className="text-7xl">
                    {getProductEmoji(product.ten_sanpham)}
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-primary shadow-lg">
                  {product.loai_sanpham === "thoi_trang"
                    ? "Thời trang"
                    : product.loai_sanpham}
                </div>
                <div className="absolute top-4 left-4 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">
                  HOT
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800 mb-3 capitalize leading-tight">
                  {product.ten_sanpham}
                </h3>
                <p className="text-primary font-bold text-2xl mb-4">
                  {formatPrice(product.gia_ban)}
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {product.ten_shop.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {product.ten_shop}
                    </p>
                    <p className="text-xs text-gray-500">
                      Đánh giá: ⭐⭐⭐⭐⭐
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 btn-primary text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-200">
                    Xem chi tiết
                  </button>
                  <button className="px-4 py-3 border-2 border-primary text-primary rounded-xl hover:bg-red-50 transition-all duration-200">
                    ❤️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
