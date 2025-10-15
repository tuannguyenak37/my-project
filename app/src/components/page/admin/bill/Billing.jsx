import React, { useEffect, useState, useMemo } from "react";
import NagiveAdmin from "../nagiveadmin";
import apibill from "../../../../utils/API/bill/bill.js";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

const statusLabels = {
  "chờ xử lý": "Chờ xác nhận",
  "đang xử lý": "Đang xử lý",
  "đang vận chuyển": "Đang vận chuyển",
  "đã giao": "Đã giao",
  "đã hủy": "Đã hủy",
  "trả hàng/hoàn tiền": "Trả hàng/Hoàn tiền",
};

const statusColors = {
  "chờ xử lý": "bg-yellow-100 text-yellow-800",
  "đang xử lý": "bg-blue-100 text-blue-800",
  "đang vận chuyển": "bg-orange-100 text-orange-800",
  "đã giao": "bg-green-100 text-green-800",
  "đã hủy": "bg-red-100 text-red-800",
  "trả hàng/hoàn tiền": "bg-purple-100 text-purple-800",
};

// Flow admin được phép thay đổi
const statusFlowAdmin = ["chờ xử lý", "đang xử lý", "đang vận chuyển"];

// Quy trình trạng thái hợp lệ
const statusFlow = ["chờ xử lý", "đang xử lý", "đang vận chuyển", "đã giao"];

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("tất cả");
  const [search, setSearch] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await apibill.getallbillshop();
      setBills(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  const updatebill = useMutation({
    mutationFn: ({ hoadon_id, trang_thai }) =>
      apibill.updatebill({ hoadon_id, trang_thai }),

    onSuccess: (data, variables) => {
      // variables = { hoadon_id, trang_thai: newStatus }
      toast.success("Cập nhật trạng thái thành công");
      setBills((prevBills) =>
        prevBills.map((b) =>
          b.hoadon_id === variables.hoadon_id
            ? { ...b, trang_thai: variables.trang_thai }
            : b
        )
      );
      setUpdatingId(null);
    },
    onError: () => toast.error("Có lỗi xảy ra, vui lòng thử lại sau!"),
  });

  useEffect(() => {
    fetchBills();
  }, []);

  const handleStatusChange = (hoadon_id, currentStatus, trang_thai) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    const newIndex = statusFlow.indexOf(trang_thai);
    if (newIndex <= currentIndex) return;
    console.log("data dự định ", currentStatus, trang_thai);
    setUpdatingId(hoadon_id);
    updatebill.mutate(
      { hoadon_id, trang_thai },
      { onSettled: () => setUpdatingId(null) }
    );
  };

  const filteredBills = useMemo(() => {
    return bills
      .filter((b) =>
        filterStatus === "tất cả" ? true : b.trang_thai === filterStatus
      )
      .filter(
        (b) =>
          b.hoadon_id.toLowerCase().includes(search.toLowerCase()) ||
          b.khachhang_id.toLowerCase().includes(search.toLowerCase())
      );
  }, [bills, filterStatus, search]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <NagiveAdmin />

      <div className="flex-1 p-4 md:p-6 overflow-x-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-red-800">
          Quản lý hóa đơn
        </h1>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterStatus("tất cả")}
              className={`px-3 py-1 rounded-full border ${
                filterStatus === "tất cả"
                  ? "bg-red-700 text-white border-red-700"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              Tất cả
            </button>
            {Object.keys(statusLabels).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-full border ${
                  filterStatus === status
                    ? "bg-red-700 text-white border-red-700"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Tìm theo hóa đơn hoặc khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-1 w-full sm:w-64"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center text-gray-600">Đang tải hóa đơn...</div>
        ) : filteredBills.length === 0 ? (
          <div className="text-center text-gray-600">Không có hóa đơn</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2 text-left">Hóa đơn ID</th>
                  <th className="border px-2 py-2 text-left">Khách hàng</th>
                  <th className="border px-2 py-2 text-left">Ngày lập</th>
                  <th className="border px-2 py-2 text-left">Tổng tiền</th>
                  <th className="border px-2 py-2 text-left">Thanh toán</th>
                  <th className="border px-2 py-2 text-left">Trạng thái</th>
                  <th className="border px-2 py-2 text-left">Ghi chú</th>
                  <th className="border px-2 py-2 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <tr key={bill.hoadon_id} className="hover:bg-gray-50">
                    <td className="border px-2 py-2">{bill.hoadon_id}</td>
                    <td className="border px-2 py-2">{bill.khachhang_id}</td>
                    <td className="border px-2 py-2">
                      {new Date(bill.ngay_lap).toLocaleString()}
                    </td>
                    <td className="border px-2 py-2">
                      {bill.tong_tien.toLocaleString()} đ
                    </td>
                    <td className="border px-2 py-2">
                      {bill.hinh_thuc_thanh_toan}
                    </td>
                    <td className="border px-2 py-2">
                      <select
                        disabled={
                          updatingId === bill.hoadon_id ||
                          !statusFlowAdmin.includes(bill.trang_thai) ||
                          bill.trang_thai === "đã giao"
                        }
                        value={bill.trang_thai}
                        onChange={(e) =>
                          handleStatusChange(
                            bill.hoadon_id,
                            bill.trang_thai,
                            e.target.value
                          )
                        }
                        className={`px-2 py-1 rounded-full text-sm font-semibold cursor-pointer ${statusColors[bill.trang_thai]}`}
                      >
                        {/* Luôn show trạng thái hiện tại */}
                        <option value={bill.trang_thai} disabled>
                          {statusLabels[bill.trang_thai]}
                        </option>

                        {/* Chỉ show trạng thái tiếp theo hợp lệ */}
                        {statusFlowAdmin
                          .filter(
                            (status) =>
                              statusFlowAdmin.indexOf(status) >
                              statusFlowAdmin.indexOf(bill.trang_thai)
                          )
                          .map((status) => (
                            <option key={status} value={status}>
                              {statusLabels[status]}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="border px-2 py-2">{bill.ghi_chu || "-"}</td>
                    <td className="border px-2 py-2">
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal chi tiết hóa đơn */}
        {selectedBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedBill(null)}
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">Chi tiết hóa đơn</h2>
              <p>
                <strong>Hóa đơn ID:</strong> {selectedBill.hoadon_id}
              </p>
              <p>
                <strong>Khách hàng:</strong> {selectedBill.khachhang_id}
              </p>
              <p>
                <strong>Ngày lập:</strong>{" "}
                {new Date(selectedBill.ngay_lap).toLocaleString()}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {selectedBill.tong_tien.toLocaleString()} đ
              </p>
              <p>
                <strong>Thanh toán:</strong> {selectedBill.hinh_thuc_thanh_toan}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-sm font-semibold ${statusColors[selectedBill.trang_thai]}`}
                >
                  {statusLabels[selectedBill.trang_thai]}
                </span>
              </p>
              {selectedBill.ghi_chu && (
                <p>
                  <strong>Ghi chú:</strong> {selectedBill.ghi_chu}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
