import React from "react";

const OrderSummary = ({
  summary,
  formatCurrency,
  perShopTotals = [],
  isPending,
}) => {
  return (
    <div className="bg-white rounded-sm shadow-sm p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Tóm tắt đơn hàng
      </h2>

      {/* Hiển thị breakdown theo shop */}
      {perShopTotals.map((p) => (
        <div key={p.shopId} className="mb-3 pb-2 border-b last:border-b-0">
          <div className="text-sm font-semibold mb-1">{p.ten_shop}</div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tạm tính</span>
            <span>{formatCurrency(p.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Phí vận chuyển</span>
            <span>{formatCurrency(p.shipping)}</span>
          </div>
        </div>
      ))}

      <div className="border-t my-4"></div>

      <div className="flex justify-between text-gray-600 mb-2">
        <span>Tạm tính</span>
        <span>{formatCurrency(summary.subtotal)}</span>
      </div>
      <div className="flex justify-between text-gray-600 mb-2">
        <span>Phí vận chuyển</span>
        <span>{formatCurrency(summary.shipping)}</span>
      </div>
      <div className="flex justify-between text-gray-600 mb-4">
        <span>Giảm giá</span>
        <span>0 ₫</span>
      </div>

      <div className="border-t my-4"></div>

      <div className="flex justify-between text-lg font-semibold text-gray-800 mb-4">
        <span>Tổng cộng</span>
        <span className="text-orange-500">{formatCurrency(summary.total)}</span>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 w-full rounded-sm transition duration-300 disabled:bg-gray-400"
      >
        {isPending ? "Đang xử lý..." : "Đặt hàng"}
      </button>
    </div>
  );
};

export default OrderSummary;
