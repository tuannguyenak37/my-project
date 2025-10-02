import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Nagigate from "../layout/nagigate.jsx";
import { useMutation } from "@tanstack/react-query";
import APISP from "../../utils/API/sanpham.js";
import { useAddToCart } from "../shared/cart.jsx"; // ✅ import đúng hook

export default function ProductDetail() {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [soLuong, setSoLuong] = useState(1);

  // ✅ khai báo hook addToCartp
  const addToCartp = useAddToCart();

  const { mutate: xemCTSP, isPending: isPendingXem } = useMutation({
    mutationFn: (id) => APISP.xemCTSP(id),
    onSuccess: (res) => {
      setProductDetail(res.data.data);
    },
    onError: (error) => {
      console.error("❌ Lỗi khi xem chi tiết SP:", error);
    },
  });

  useEffect(() => {
    if (id) {
      xemCTSP(id);
    }
  }, [id]);

  if (isPendingXem)
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="custom-loader"></div>
      </div>
    );
  if (!productDetail) return <p className="p-6">Không có dữ liệu sản phẩm</p>;

  const product = {
    ten_sanpham: productDetail.ten_sanpham,
    gia_ban: productDetail.gia_ban,
    mo_ta: productDetail.mo_ta_sanpham,
    url_sanpham: productDetail.url_sanpham || "https://via.placeholder.com/400",
    so_luong: productDetail.tong_so_luong_ton,
  };
  console.log(">>>>", product.mo_ta);
  const shop = {
    ten_shop: productDetail.ten_shop,
    dia_chi: "123 Nguyễn Văn Linh, Bình Dương",
    sdt: "0909 999 999",
    avatar:
      "https://down-vn.img.susercontent.com/file/sg-11134201-7rdxd-lu4t2izwd9av7e", // ảnh logo shop
  };
  return (
    <div>
      <Nagigate />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6">
          {/* Ảnh sản phẩm */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-4">
            <img
              src={product.url_sanpham}
              alt={product.ten_sanpham}
              className="w-full h-[400px] object-contain"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-3">
              {product.ten_sanpham}
            </h1>
            <p className="text-3xl font-bold text-red-500 mb-4">
              {product.gia_ban}đ
            </p>
            <p className="text-3xl font-bold text-red-500 mb-4">
              còn: {product.so_luong}
            </p>
            <p className="text-gray-600 mb-6">{product.mo_ta}</p>

            {/* Số lượng */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  className="px-3 py-1 text-lg font-bold"
                  onClick={() =>
                    setSoLuong((prev) => (prev > 1 ? prev - 1 : 1))
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  value={soLuong}
                  min="1"
                  onChange={(e) => setSoLuong(Number(e.target.value))}
                  className="w-16 text-center border-l border-r outline-none"
                />
                <button
                  className="px-3 py-1 text-lg font-bold"
                  onClick={() => setSoLuong((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-4">
              <button className="flex-1 bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition">
                Mua ngay
              </button>
              <button
                onClick={() => addToCartp(productDetail, soLuong)} // ✅ gọi hàm hook
                className="flex-1 border border-red-500 text-red-500 py-3 rounded-lg text-lg font-semibold hover:bg-red-50 transition"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={shop.avatar}
              alt={shop.ten_shop}
              className="w-16 h-16 rounded-full border"
            />
            <div>
              <h2 className="text-lg font-semibold">{shop.ten_shop}</h2>
              <p className="text-gray-600">{shop.dia_chi}</p>
              <p className="text-gray-600">{shop.sdt}</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Xem shop
          </button>
        </div>
      </div>
    </div>
  );
}
