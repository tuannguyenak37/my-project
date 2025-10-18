import React, { useState, useEffect } from "react";
import banner1 from "../../../../public/baner.jpg";
import banner2 from "../../style/img/hoahuongduongcanh.jpg";
import banner3 from "../../style/img/vittrang.jpg";
import small1 from "../../style/img/hoahuongduongcanh.jpg";
import small2 from "../../style/img/vittrang.jpg";

export default function ShopeeBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const banners = [banner1, banner2, banner3];
  const categories = [
    { icon: "👕", label: "Thời Trang Nam" },
    { icon: "📱", label: "Điện Thoại & Phụ Kiện" },
    { icon: "📺", label: "Thiết Bị Điện Tử" },
    { icon: "💻", label: "Máy Tính & Laptop" },
    { icon: "📷", label: "Máy Ảnh & Máy Quay Phim" },
    { icon: "⌚", label: "Đồng Hồ" },
    { icon: "👞", label: "Giày Dép Nam" },
    { icon: "☕", label: "Thiết Bị Điện Gia Dụng" },
    { icon: "⚽", label: "Thể Thao & Du Lịch" },
    { icon: "🏍️", label: "Ô Tô & Xe Máy & Xe Đạp" },
    { icon: "👗", label: "Thời Trang Nữ" },
    { icon: "🍼", label: "Mẹ & Bé" },
    { icon: "🏠", label: "Nhà Cửa & Đời Sống" },
    { icon: "💄", label: "Sắc Đẹp" },
    { icon: "💊", label: "Sức Khỏe" },
    { icon: "👠", label: "Giày Dép Nữ" },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto my-5">
      <div className="grid grid-cols-3 gap-2">
        {/* Banner chính */}
        <div className="col-span-2 relative h-[300px] md:h-[400px] overflow-hidden rounded-lg shadow-lg">
          {banners.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Banner ${idx}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                idx === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Banner phụ bên phải */}
        <div className="flex flex-col gap-2">
          <img
            src={small1}
            alt="Small Banner 1"
            className="h-[145px] md:h-[195px] w-full object-cover rounded-lg shadow-md"
          />
          <img
            src={small2}
            alt="Small Banner 2"
            className="h-[145px] md:h-[195px] w-full object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Dưới banner: icon features */}
      <div className="flex w-full justify-between mt-4 rounded-2xl overflow-hidden shadow-lg bg-white p-6">
        {[
          { icon: "🛒", label: "Deal Từ 1.000Đ" },
          { icon: "📦", label: "Shopee Xử Lý" },
          { icon: "⚡", label: "Deal Hot Giờ Vàng" },
          { icon: "🎁", label: "Shopee Style Voucher 30%" },
          { icon: "💰", label: "Săn Ngay 100.000 Xu" },
          { icon: "🏷️", label: "Mã Giảm Giá" },
          { icon: "👑", label: "Khách Hàng Thân Thiết" },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-sm">
            <div className="text-2xl mb-1">{item.icon}</div>
            {/* Ẩn chữ trên mobile, hiện chữ từ màn >= sm */}
            <span className="hidden sm:block text-center">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">DANH MỤC</h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-6">
          {categories.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center cursor-pointer group"
            >
              {/* Icon hình tròn */}
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 text-3xl group-hover:bg-orange-100 transition">
                {item.icon}
              </div>
              {/* Tên danh mục */}
              <span className="text-sm text-center mt-2">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
