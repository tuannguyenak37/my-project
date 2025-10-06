import React from "react";

const PaymentMethod = ({ register }) => {
  const methods = [
    { id: "cod", label: "Thanh toán khi nhận hàng (COD)" },
    { id: "bank", label: "Chuyển khoản ngân hàng" },
    { id: "card", label: "Thẻ tín dụng/ghi nợ" },
  ];

  return (
    <div className="bg-white rounded-sm shadow-sm mb-4 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Phương thức thanh toán</h2>
      <div className="space-y-3">
        {methods.map((m) => (
          <div key={m.id} className="flex items-center">
            <input type="radio" id={m.id} value={m.id} {...register("paymentMethod")} className="mr-2 h-4 w-4" />
            <label htmlFor={m.id}>{m.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
