import React, { useState, useEffect } from "react";
import banner1 from "../../style/img/banhkemhoa.jpg";
import banner2 from "../../style/img/hoahuongduongcanh.jpg";
import banner3 from "../../style/img/vittrang.jpg";
import small1 from "../../style/img/hoahuongduongcanh.jpg";
import small2 from "../../style/img/vittrang.jpg";

export default function ShopeeBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const banners = [banner1, banner2, banner3];

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
      <div className="flex justify-between mt-4">
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
            <span className="text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
