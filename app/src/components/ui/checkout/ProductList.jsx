import React from "react";

const ProductList = ({ groupedItems, formatCurrency, register }) => {
  return (
    <div className="bg-white rounded-sm shadow-sm mb-4 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm</h2>

      {Object.keys(groupedItems).length === 0 && (
        <div className="text-sm text-gray-500">
          Không có sản phẩm để thanh toán.
        </div>
      )}

      {Object.keys(groupedItems).map((shopId) => {
        const shop = groupedItems[shopId];
        return (
          <div key={shopId} className="border-t pt-4">
            <div className="mb-2 font-semibold">{shop.ten_shop}</div>

            {shop.items.map((item) => (
              <div key={item.sanpham_id} className="flex items-center mb-4">
                <img
                  src={item.url_sanpham}
                  alt={item.ten_sanpham}
                  className="w-16 h-16 object-cover mr-4"
                />
                <div className="flex-1">
                  <p>{item.ten_sanpham}</p>
                  <p className="text-sm text-gray-600">
                    Số lượng: {item.so_luong}
                  </p>
                </div>
                <p className="text-orange-500">
                  {formatCurrency(item.gia_ban * item.so_luong)}
                </p>
              </div>
            ))}

            {/* Ghi chú riêng cho từng shop */}
            <div className="mt-3">
              <label className="block text-sm font-semibold mb-2">
                Ghi chú cho shop
              </label>
              <textarea
                rows="2"
                {...register(`shopNotes.${shopId}`)}
                className="border border-gray-300 rounded-sm px-3 py-2 w-full"
                placeholder="Ghi chú riêng cho shop này (ví dụ: giờ giao, yêu cầu đóng gọn...)"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
