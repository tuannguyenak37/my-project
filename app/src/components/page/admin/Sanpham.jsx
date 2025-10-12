import React, { useState, useEffect } from "react";
import Nagiveadmin from "./nagiveadmin";
import { useForm } from "react-hook-form";
import axios from "../../../utils/API/kho.js";
import APIADDSP from "../../../utils/API/sanpham.js";
import { toast } from "react-hot-toast";

export default function Sanpham() {
  const [isAddSP, setIsAddSP] = useState(false);
  const [kho, setKho] = useState([]);
  const [urlSanpham, setUrlSanpham] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sanphamList, setSanphamList] = useState([]);
  const [editingSP, setEditingSP] = useState(null);
  const [giaBanInput, setGiaBanInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    const fetchKho = async () => {
      try {
        const res = await axios.xemthongtinkho();
        setKho(res.data.data);
      } catch (err) {
        console.log("Lỗi:", err.response?.data || err.message);
      }
    };
    fetchKho();
    fetchSanpham();
  }, []);

  const fetchSanpham = async () => {
    try {
      const res = await APIADDSP.laySP();
      setSanphamList(res.data.data);
    } catch (err) {
      console.log("Lỗi load SP:", err.response?.data || err.message);
    }
  };

  const handleGiaBanChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    setGiaBanInput(new Intl.NumberFormat("vi-VN").format(value));
    setValue("gia_ban", Number(value));
  };

  const handelAddSP = async (data) => {
    setLoading(true);
    const formData = new FormData();
    if (urlSanpham) formData.append("url_sanpham", urlSanpham);
    formData.append("ten_sanpham", data.ten_sanpham);
    formData.append("gia_ban", data.gia_ban);
    formData.append("mo_ta", data.mo_ta || "");
    formData.append("so_luong_ton", data.so_luong_ton);
    formData.append("kho_id", data.kho_id);
    formData.append("loai_sanpham", data.loai_sanpham);
    formData.append("nha_cung_cap", data.nha_cung_cap);
    console.log("data thêm sp", formData);
    try {
      if (editingSP) {
        await APIADDSP.suaSP(editingSP.sanpham_id, formData);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await APIADDSP.addSP(formData);
        toast.success("Thêm sản phẩm thành công!");
      }
      reset();
      setIsAddSP(false);
      setEditingSP(null);
      setGiaBanInput("");
      fetchSanpham();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi server!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSP = (sp) => {
    setEditingSP(sp);
    setIsAddSP(true);
    setValue("ten_sanpham", sp.ten_sanpham);
    setValue("gia_ban", sp.gia_ban);
    setValue("mo_ta", sp.mo_ta);
    setValue("so_luong_ton", sp.so_luong_ton);
    setValue("kho_id", sp.kho_id);
    setValue("loai_sanpham", sp.loai_sanpham);
    setValue("nha_cung_cap", sp.nha_cung_cap);
    setGiaBanInput(new Intl.NumberFormat("vi-VN").format(sp.gia_ban));
    setUrlSanpham(null);
  };

  const handleDeleteSP = async (id) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await APIADDSP.xoaSP(id);
        toast.success("Xóa sản phẩm thành công!");
        fetchSanpham();
      } catch (err) {
        toast.error(err.response?.data?.message || "Lỗi xóa SP");
      }
    }
  };

  const formatTien = (number) => {
    if (!number && number !== 0) return "";
    return number.toLocaleString("vi-VN") + "₫";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Nagiveadmin />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách sản phẩm
          </h1>
          <button
            onClick={() => {
              setIsAddSP(true);
              setEditingSP(null);
              reset();
              setUrlSanpham(null);
              setGiaBanInput("");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md transition duration-300"
          >
            Thêm sản phẩm
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sanphamList.map((sp) => (
            <div
              key={sp.sanpham_id}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition flex flex-col justify-between"
            >
              <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500 overflow-hidden">
                {sp.url_sanpham ? (
                  <img
                    src={sp.url_sanpham}
                    alt={sp.ten_sanpham}
                    className="object-cover h-full w-full rounded"
                  />
                ) : (
                  "Ảnh sản phẩm"
                )}
              </div>
              <h3 className="font-semibold text-lg">{sp.ten_sanpham}</h3>
              <p className="text-gray-500">{sp.mo_ta}</p>
              <p className="text-blue-600 font-bold mt-2">
                {formatTien(sp.gia_ban)}
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEditSP(sp)}
                  className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg transition"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteSP(sp.sanpham_id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal hiện đại */}
      {isAddSP && (
        <div className="fixed inset-0 flex justify-center items-center overflow-y-auto pt-20 z-50 pointer-events-none">
          <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 pointer-events-auto animate-slideDown">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {editingSP ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>

            <form onSubmit={handleSubmit(handelAddSP)} className="space-y-4">
              <input
                {...register("ten_sanpham", { required: true })}
                type="text"
                placeholder="Tên sản phẩm"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.ten_sanpham && (
                <p className="text-red-500 text-sm">Tên sản phẩm bắt buộc</p>
              )}

              <input
                type="text"
                value={giaBanInput}
                onChange={handleGiaBanChange}
                placeholder="Giá bán"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.gia_ban && (
                <p className="text-red-500 text-sm">Giá hợp lệ bắt buộc</p>
              )}

              <textarea
                {...register("mo_ta")}
                placeholder="Mô tả"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              ></textarea>

              <input
                {...register("so_luong_ton", { required: true, min: 0 })}
                type="number"
                placeholder="Số lượng tồn"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.so_luong_ton && (
                <p className="text-red-500 text-sm">Số lượng hợp lệ bắt buộc</p>
              )}

              <select
                {...register("loai_sanpham", { required: true })}
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Chọn loại sản phẩm</option>
                <option value="dien_thoai">Điện thoại</option>
                <option value="may_tinh">Máy tính</option>
                <option value="phu_kien">Phụ kiện</option>
                <option value="thoi_trang">Thời trang</option>
              </select>
              {errors.loai_sanpham && (
                <p className="text-red-500 text-sm">
                  Vui lòng chọn loại sản phẩm
                </p>
              )}

              <input
                {...register("nha_cung_cap", { required: true })}
                type="text"
                placeholder="Nhà cung cấp"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.nha_cung_cap && (
                <p className="text-red-500 text-sm">Nhà cung cấp bắt buộc</p>
              )}

              <input
                type="file"
                onChange={(e) => setUrlSanpham(e.target.files[0])}
                className="w-full border border-gray-200 p-2 rounded-xl"
              />

              <select
                {...register("kho_id", { required: true })}
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Chọn kho</option>
                {kho.map((item) => (
                  <option key={item.kho_id} value={item.kho_id}>
                    {item.ten_kho} - {item.dia_chi}
                  </option>
                ))}
              </select>
              {errors.kho_id && (
                <p className="text-red-500 text-sm">Vui lòng chọn kho</p>
              )}

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
                  onClick={() => {
                    setIsAddSP(false);
                    setEditingSP(null);
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-white ${
                    loading
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS animation */}
      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
