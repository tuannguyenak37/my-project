export default function ProductDetail() {
  // Mock sản phẩm
  const product = {
    ten_sanpham: "Áo Thun Nam Cotton",
    gia_ban: "199.000",
    mo_ta: "Chất liệu cotton 100%, form rộng thoải mái, thấm hút mồ hôi.",
    url_sanpham:
      "https://down-vn.img.susercontent.com/file/sg-11134201-7rdxd-lu4t2izwd9av7e",
  };

  // Mock shop
  const shop = {
    ten_shop: "Shop Maliketh",
    dia_chi: "123 Nguyễn Văn Linh, Bình Dương",
    sdt: "0909 999 999",
    avatar:
      "https://down-vn.img.susercontent.com/file/sg-11134201-7rdxd-lu4t2izwd9av7e", // ảnh logo shop
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Thông tin sản phẩm */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6">
        {/* Ảnh */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-4">
          <img
            src={product.url_sanpham}
            alt={product.ten_sanpham}
            className="w-full h-[400px] object-contain"
          />
        </div>

        {/* Chi tiết */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-3">{product.ten_sanpham}</h1>
          <p className="text-3xl font-bold text-red-500 mb-4">
            {product.gia_ban}đ
          </p>
          <p className="text-gray-600 mb-6">{product.mo_ta}</p>

          <div className="flex gap-4">
            <button className="flex-1 bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition">
              Mua ngay
            </button>
            <button className="flex-1 border border-red-500 text-red-500 py-3 rounded-lg text-lg font-semibold hover:bg-red-50 transition">
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>

      {/* Thông tin shop */}
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

      {/* Sản phẩm gợi ý */}
      <div className="max-w-6xl mx-auto mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border rounded-lg p-3 hover:shadow-lg transition cursor-pointer"
            >
              <img
                src="https://via.placeholder.com/150"
                alt="sp"
                className="w-full h-36 object-contain mb-2"
              />
              <p className="text-sm font-medium">Sản phẩm {i}</p>
              <p className="text-red-500 font-semibold">99.000đ</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
