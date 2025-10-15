import React, { useState, useMemo, useEffect } from "react";
import bill from "../../../utils/API/bill/bill";
import { useMutation } from "@tanstack/react-query";
import BillDetail from "./BillDetail";
import {
  EyeOutlined,
  CheckCircleOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const statusColors = {
  "chờ xử lý": {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  "đang xử lý": {
    bg: "bg-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  "đang vận chuyển": {
    bg: "bg-purple-100",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  "đã giao": {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  "trả hàng/hoàn tiền": {
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  "đã hủy": { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" },
};

export default function InvoiceCards() {
  const [billing, setBilling] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [selectedBill, setSelectedBill] = useState(null);

  // 🔄 Lấy danh sách hóa đơn
  const getAllBill = useMutation({
    mutationFn: () => bill.getallbill(),
    onSuccess: (res) => setBilling(res.data.data || []),
    onError: () => toast.error("Không thể tải danh sách hóa đơn!"),
  });

  // 🔄 Cập nhật trạng thái
  const updateBill = useMutation({
    mutationFn: (data) => bill.updateBillRefunded(data),
    onSuccess: (res, variables) => {
      toast.success("Cập nhật trạng thái thành công!");
      setBilling((prev) =>
        prev.map((inv) =>
          inv.hoadon_id === variables.hoadon_id
            ? { ...inv, trang_thai: variables.trang_thai }
            : inv
        )
      );
    },
    onError: () => toast.error("Có lỗi xảy ra!"),
  });

  useEffect(() => {
    getAllBill.mutate();
  }, []);

  // Lọc + tìm kiếm
  const filteredInvoices = useMemo(() => {
    return billing.filter((inv) => {
      const matchesSearch =
        inv.hoadon_id.toLowerCase().includes(search.toLowerCase()) ||
        inv.khachhang_id.toLowerCase().includes(search.toLowerCase()) ||
        inv.shop_id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ||
        inv.trang_thai.toLowerCase() === filterStatus.toLowerCase();
      const matchesPayment =
        filterPayment === "all" ||
        inv.hinh_thuc_thanh_toan.toLowerCase() === filterPayment.toLowerCase();
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [billing, search, filterStatus, filterPayment]);

  // Xử lý hành động
  const handleConfirm = (id) => {
    if (!window.confirm("Xác nhận đã nhận hàng?")) return;
    updateBill.mutate({ hoadon_id: id, trang_thai: "đã giao" });
  };

  const handleRefund = (id) => {
    if (!window.confirm("Xác nhận yêu cầu trả hàng / hoàn tiền?")) return;
    updateBill.mutate({ hoadon_id: id, trang_thai: "trả hàng/hoàn tiền" });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-roboto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Đơn hàng của tôi</h1>
        <p className="text-gray-500 text-sm mt-1">
          Theo dõi và quản lý các đơn hàng của bạn
        </p>
      </header>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn hàng, khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <svg
            className="absolute left-3 top-3 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.keys(statusColors).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tất cả thanh toán</option>
            <option value="cod">COD</option>
            <option value="bank">Chuyển khoản</option>
          </select>
        </div>
      </div>

      {/* Danh sách hóa đơn */}
      {getAllBill.isPending ? (
        <div className="text-center text-gray-500 py-10">Đang tải...</div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Không tìm thấy hóa đơn nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredInvoices.map((inv) => {
            const color =
              statusColors[inv.trang_thai] || statusColors["đã hủy"];
            return (
              <motion.div
                key={inv.hoadon_id}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
                whileHover={{ y: -3 }}
              >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${color.dot} inline-block`}
                    ></span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text}`}
                    >
                      {inv.trang_thai}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Mã đơn: {inv.hoadon_id}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">
                        <strong>Khách hàng:</strong> {inv.khachhang_id}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>Shop:</strong> {inv.shop_id.substring(0, 20)}...
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm">
                      <strong>Ngày lập:</strong>{" "}
                      {new Date(inv.ngay_lap).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600 text-sm">
                      <strong>Thanh toán:</strong>{" "}
                      {inv.hinh_thuc_thanh_toan.toUpperCase()}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <strong>Giảm giá:</strong>{" "}
                      {inv.giam_gia_tong_hd.toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    <strong>Ghi chú:</strong> {inv.ghi_chu || "Không có"}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-orange-600">
                      {inv.tong_tien.toLocaleString("vi-VN")} VND
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setSelectedBill(
                            selectedBill === inv.hoadon_id
                              ? null
                              : inv.hoadon_id
                          )
                        }
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm flex items-center gap-2"
                      >
                        <EyeOutlined />
                        Xem chi tiết
                      </button>
                      {inv.trang_thai === "đang vận chuyển" && (
                        <button
                          onClick={() => handleConfirm(inv.hoadon_id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                        >
                          <CheckCircleOutlined />
                          Đã nhận hàng
                        </button>
                      )}
                      {inv.trang_thai === "đã giao" && (
                        <button
                          onClick={() => handleRefund(inv.hoadon_id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-2"
                        >
                          <UndoOutlined />
                          Trả hàng / Hoàn tiền
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedBill === inv.hoadon_id && (
                    <div className="mt-4 border-t pt-4">
                      <BillDetail hoadon_id={inv.hoadon_id} />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
