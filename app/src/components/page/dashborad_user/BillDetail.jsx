import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import billAPI from "../../../utils/API/bill/bill";
import toast from "react-hot-toast";
import FeedBack from "./FeedBack";

export default function BillDetail({ hoadon_id }) {
  const [billData, setBillData] = useState(null);

  const { mutate: getBillDetail, isPending } = useMutation({
    mutationFn: (id) => billAPI.getBillDetail(id),
    onSuccess: (res) => {
      if (res.data?.status === "success") {
        setBillData(res.data.data);
      } else toast.error("Không tìm thấy chi tiết hóa đơn");
    },
    onError: () => toast.error("Lỗi khi tải chi tiết hóa đơn"),
  });

  useEffect(() => {
    if (hoadon_id) getBillDetail(hoadon_id);
  }, [hoadon_id]);

  const formatVND = (v) =>
    v?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 ₫";

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

  if (isPending)
    return (
      <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>
    );

  if (!billData)
    return (
      <p className="p-6 text-center text-gray-500">
        Không có dữ liệu hóa đơn để hiển thị.
      </p>
    );

  const { hoadon, sanpham } = billData;
  const { khachhang, dia_chi } = hoadon;

  return (
    <div className="bg-gray-100 min-h-screen py-8 font-['Roboto']">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Chi Tiết Đơn Hàng
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Mã đơn: {hoadon.hoadon_id}
          </p>
        </header>

        {/* Tổng quan đơn hàng */}
        <section className="bg-white rounded-lg shadow-md mb-8 p-6">
          <h2 className="text-2xl font-semibold text-[#9f1818] mb-4">
            Tổng Quan Đơn Hàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                <strong>Ngày lập:</strong> {formatDate(hoadon.ngay_lap)}
              </p>
              <p className="text-gray-600">
                <strong>Trạng thái:</strong>{" "}
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                  {hoadon.trang_thai}
                </span>
              </p>
              <p className="text-gray-600">
                <strong>Phương thức thanh toán:</strong>{" "}
                {hoadon.hinh_thuc_thanh_toan.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <strong>Tổng tiền:</strong>{" "}
                <span className="font-bold text-[#9f1818]">
                  {formatVND(hoadon.tong_tien)}
                </span>
              </p>
              <p className="text-gray-600">
                <strong>Giảm giá:</strong> {formatVND(hoadon.giam_gia_tong_hd)}
              </p>
              <p className="text-gray-600">
                <strong>Ghi chú:</strong> {hoadon.ghi_chu || "Không có"}
              </p>
            </div>
          </div>
        </section>

        {/* Thông tin khách hàng */}
        <section className="bg-white rounded-lg shadow-md mb-8 p-6">
          <h2 className="text-2xl font-semibold text-[#9f1818] mb-4">
            Thông Tin Khách Hàng
          </h2>
          <p className="text-gray-600">
            <strong>Tên:</strong> {khachhang.ten_khachhang}
          </p>
          <p className="text-gray-600">
            <strong>Số điện thoại:</strong> {khachhang.so_dien_thoai}
          </p>
        </section>

        {/* Địa chỉ giao hàng */}
        <section className="bg-white rounded-lg shadow-md mb-8 p-6">
          <h2 className="text-2xl font-semibold text-[#9f1818] mb-4">
            Địa Chỉ Giao Hàng
          </h2>
          <p className="text-gray-600">
            <strong>Địa chỉ:</strong> {dia_chi.dia_chi}
          </p>
          <p className="text-gray-600">
            <strong>Mô tả địa chỉ:</strong>{" "}
            {dia_chi.mo_ta_dia_chi || "Không có"}
          </p>
          <p className="text-gray-600">
            <strong>Xã/Phường:</strong> {dia_chi.ward}
          </p>
          <p className="text-gray-600">
            <strong>Quận/Huyện:</strong> {dia_chi.district}
          </p>
          <p className="text-gray-600">
            <strong>Tỉnh/Thành phố:</strong> {dia_chi.province}
          </p>
        </section>

        {/* Danh sách sản phẩm */}
        <section className="bg-white rounded-lg shadow-md mb-8 p-6">
          <h2 className="text-2xl font-semibold text-[#9f1818] mb-4">
            Sản Phẩm
          </h2>
          <div className="space-y-6">
            {sanpham.map((sp) => (
              <div
                key={sp.cthd_id}
                className="flex items-start gap-4 border-b border-gray-200 pb-4"
              >
                <img
                  src={sp.url_sanpham}
                  alt={sp.ten_sanpham}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">
                    {sp.ten_sanpham}
                  </h3>
                  <p className="text-gray-600 text-sm">Mô tả: {sp.mo_ta}</p>
                  <p className="text-gray-600 text-sm">Loại: {sp.loai}</p>
                  <div className="flex justify-between mt-2">
                    <p className="text-gray-600">Số lượng: {sp.so_luong}</p>
                    <p className="text-gray-600">
                      Giá: {formatVND(sp.gia_ban)}
                    </p>
                    <p className="font-bold text-[#9f1818]">
                      Thành tiền: {formatVND(sp.thanh_tien)}
                    </p>
                  </div>
                </div>
                {/* // đánh gia */}
                <div>
                  {/* <FeedBack sanpham_id={sp.sanpham_id} hoadon_id={hoadon_id} /> */}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4 flex justify-end">
            <div className="text-right">
              <p className="text-gray-600">
                Tổng cộng sản phẩm: {formatVND(hoadon.tong_tien)}
              </p>
              <p className="text-gray-600">
                Giảm giá: {formatVND(hoadon.giam_gia_tong_hd)}
              </p>
              <p className="text-xl font-bold text-[#9f1818]">
                Tổng thanh toán: {formatVND(hoadon.tong_tien)}
              </p>
            </div>
          </div>
        </section>

        {/* Nút hành động */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-[#9f1818] text-white rounded-lg hover:bg-[#7f1414] transition-colors duration-200"
          >
            In Hóa Đơn
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-[#9f1818] text-[#9f1818] rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Quay Lại
          </button>
        </div>
      </div>
    </div>
  );
}
