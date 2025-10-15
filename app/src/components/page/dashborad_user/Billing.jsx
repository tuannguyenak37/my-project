import React, { useState, useMemo, useEffect } from "react";
import bill from "../../../utils/API/bill/bill";
import { useMutation } from "@tanstack/react-query";
import {
  ShoppingCartOutlined,
  GiftOutlined,
  CarOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";

const statusLabels = {
  "chờ xử lý": "Chờ xác nhận",
  "đang xử lý": "Đang xử lý",
  "đang vận chuyển": "Đang vận chuyển",
  "đã giao/hoàn tất": "Đã giao/Hoàn tất",
  "đã hủy": "Đã hủy",
  "trả hàng/hoàn tiền": "Trả hàng/Hoàn tiền",
};

const statusColors = {
  "chờ xử lý": "bg-yellow-100 text-yellow-800",
  "đang xử lý": "bg-blue-100 text-blue-800",
  "đang vận chuyển": "bg-orange-100 text-orange-800",
  "đã giao/hoàn tất": "bg-green-100 text-green-800",
  "đã hủy": "bg-red-100 text-red-800",
  "trả hàng/hoàn tiền": "bg-purple-100 text-purple-800",
};

export default function InvoiceCards() {
  const [billing, setBilling] = useState([]);
  const [filterStatus, setFilterStatus] = useState("tất cả");

  const getAllBill = useMutation({
    mutationFn: () => bill.getallbill(),
    onSuccess: (res) => {
      setBilling(res.data.data || []);
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });

  useEffect(() => {
    getAllBill.mutate();
  }, []);

  const filteredInvoices = useMemo(() => {
    if (filterStatus === "tất cả") return billing;
    return billing.filter((inv) => inv.trang_thai === filterStatus);
  }, [filterStatus, billing]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#981a1a]">
        Quản lý đơn hàng
      </h1>

      {/* Bộ lọc trạng thái */}
      <div className="flex gap-3 mb-6 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setFilterStatus("tất cả")}
          className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium ${
            filterStatus === "tất cả"
              ? "bg-[#981a1a] text-white border-[#981a1a]"
              : "bg-white text-gray-700 border-gray-300"
          } hover:opacity-85 transition`}
        >
          Tất cả
        </button>
        {Object.keys(statusLabels).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium ${
              filterStatus === status
                ? "bg-[#981a1a] text-white border-[#981a1a]"
                : "bg-white text-gray-700 border-gray-300"
            } hover:opacity-85 transition`}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Hiển thị loader khi đang tải */}
      {getAllBill.isPending ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-[#981a1a] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredInvoices.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              Không có hóa đơn nào.
            </p>
          ) : (
            filteredInvoices.map((inv) => (
              <div
                key={inv.hoadon_id}
                className="group bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {inv.hoadon_id}
                    </h3>
                    <p className="text-sm text-gray-500">{inv.khachhang_id}</p>
                  </div>
                  <span
                    className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1 rounded-full text-sm font-semibold ${statusColors[inv.trang_thai]}`}
                  >
                    {statusLabels[inv.trang_thai]}
                  </span>
                </div>

                {/* Nội dung chính */}
                <div className="space-y-1 text-gray-700 text-sm">
                  <div>
                    <strong>Ngày lập:</strong>{" "}
                    {new Date(inv.ngay_lap).toLocaleString()}
                  </div>
                  <div>
                    <strong>Tổng tiền:</strong> {inv.tong_tien.toLocaleString()}{" "}
                    đ
                  </div>
                  <div>
                    <strong>Thanh toán:</strong> {inv.hinh_thuc_thanh_toan}
                  </div>
                  {inv.ghi_chu && (
                    <div>
                      <strong>Ghi chú:</strong> {inv.ghi_chu}
                    </div>
                  )}
                </div>

                {/* Thông tin phụ với icon */}
                <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-gray-100/60 p-3 backdrop-blur-sm text-center text-sm text-gray-600">
                  <div className="flex flex-col items-center gap-1">
                    <ShoppingCartOutlined className="text-gray-800 text-lg" />
                    <span>Sản phẩm</span>
                    <span className="font-semibold text-gray-800">3</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <GiftOutlined className="text-gray-800 text-lg" />
                    <span>Voucher</span>
                    <span className="font-semibold text-gray-800">0 đ</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <CarOutlined className="text-gray-800 text-lg" />
                    <span>Phí ship</span>
                    <span className="font-semibold text-gray-800">0 đ</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
