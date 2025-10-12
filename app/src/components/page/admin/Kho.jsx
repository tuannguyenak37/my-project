import React, { useEffect, useState } from "react";
import KhoAPI from "../../../utils/API/kho.js";
import NagiveAdmin from "./nagiveadmin";
import axios from "../../../utils/API/sanpham.js";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function Kho() {
  const [sanpham, setSanpham] = useState([]);
  const [isloading, setIsloading] = useState(false);

  const [is_addkho, setIsAddKho] = useState(false); // bật modal nhập kho
  const [is_chonkho, setIsChonKho] = useState(false); // đã chọn kho chưa
  const [select_kho, setSelectKho] = useState(""); // id kho đã chọn
  const [thongtinkho, setThongTinKho] = useState([]); // danh sách kho
  const [soluongNhap, setSoluongNhap] = useState({}); // { sanpham_id: so_luong }
  const [nha_cung_cap, setnha_cung_cap] = useState("");
  const [isnewkho, setisnewkho] = useState(false);
  // state lọc sản phẩm
  const [search, setSearch] = useState("");
  const [khoList, setKhoList] = useState([]);
  const [selectedKho, setSelectedKho] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { register, handleSubmit, reset } = useForm();
  // thêm kho mới
  const mutationNewKho = useMutation({
    mutationFn: (data) => KhoAPI.newkho(data),
    onSuccess: () => {
      console.log("✅ thành công");
      setisnewkho(false);
      toast.success("Thêm kho mới thành công ✅");
    },
    onError: (error) => {
      console.error("❌ Lỗi ", error);
      toast.error("Lỗi thêm kho, vui lòng thử lại sau");
    },
  });
  // Lấy mutate và isLoading trực tiếp
  const { mutate: newkho, isLoading: isloadingkho } = mutationNewKho;
  const onSubmit = (data) => {
    console.log("Dữ liệu form:", data);
    newkho(data); // mutation chạy -> isloadingkho tự true
  };

  // Load dữ liệu sản phẩm
  useEffect(() => {
    const fetchSanPham = async () => {
      try {
        const response = await axios.xemkho();
        setSanpham(response.data.data);
        setKhoList(
          Array.from(new Set(response.data.data.map((item) => item.ten_kho)))
        );
        setIsloading(true);
      } catch (error) {
        console.error("❌ Lỗi load sản phẩm:", error);
      }
    };
    fetchSanPham();
  }, []);

  // Xem danh sách kho
  const { mutate: xemkho, isPending: isPendingXem } = useMutation({
    mutationFn: () => KhoAPI.xemthongtinkho(),
    onSuccess: (res) => {
      setThongTinKho(res.data.data);
    },
    onError: (error) => {
      console.error("❌ Lỗi khi xem kho:", error);
    },
  });

  const handleOpenNhapKho = () => {
    setIsAddKho(true);
    xemkho();
  };

  const handleChonKho = (item) => {
    setSelectKho(item.kho_id);
    setIsChonKho(true);
  };
  const handlenewkho = (e) => {
    setisnewkho(true);
  };
  // Lọc dữ liệu sản phẩm
  const filteredSP = sanpham.filter((item) => {
    const matchName = search
      ? item.ten_sanpham.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchKho = selectedKho ? item.ten_kho === selectedKho : true;
    const matchPrice =
      (!minPrice || parseFloat(item.gia_ban) >= parseFloat(minPrice)) &&
      (!maxPrice || parseFloat(item.gia_ban) <= parseFloat(maxPrice));
    return matchName && matchKho && matchPrice;
  });

  // Nhập kho mutation
  const { mutate: nhapKho, isLoading: isPending } = useMutation({
    mutationFn: (datakho) => KhoAPI.nhapkho(datakho),
    onSuccess: () => {
      console.log("✅ Nhập kho thành công");
      setIsChonKho(false);
      setIsAddKho(false);
      setSoluongNhap({});
    },
    onError: (error) => {
      console.error("❌ Lỗi khi nhập kho:", error);
    },
  });

  // Submit nhập kho
  const handleNhapKho = (e) => {
    e.preventDefault();

    const listSanPham = sanpham
      .map((sp) => ({
        sanpham_id: sp.sanpham_id,
        ten_sanpham: sp.ten_sanpham,
        gia_ban: sp.gia_ban,
        so_luong: parseInt(soluongNhap[sp.sanpham_id] || 0, 10),
      }))
      .filter((r) => r.so_luong > 0);

    const datakho = { listSanPham, select_kho, nha_cung_cap };
    console.log(">>> Nhập kho:", datakho);
    nhapKho(datakho);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <NagiveAdmin />
      {/* Nút nhập kho */}
      <div className="fixed bottom-4 right-4 z-50 gap-5">
        <button
          onClick={handleOpenNhapKho}
          className="cursor-pointer ring-2 rounded-2xl shadow-2xl border uppercase bg-white px-4 py-2 
          active:translate-x-0.5 active:translate-y-0.5 
          hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] transition"
        >
          Nhập kho
        </button>
        <button
          onClick={(e) => handlenewkho(e)}
          className="cursor-pointer ring-2 rounded-2xl shadow-2xl border uppercase bg-white px-4 py-2 mx-4
          active:translate-x-0.5 active:translate-y-0.5 
          hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] transition"
        >
          Thêm kho chứa
        </button>
      </div>
      // thêm kho mới
      {isnewkho && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-40 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Thêm kho mới
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-600 font-medium">
                  Tên kho
                </label>
                <input
                  {...register("ten_kho", { required: true })}
                  type="text"
                  placeholder="Nhập tên kho"
                  className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-600 font-medium">
                  Địa chỉ kho
                </label>
                <input
                  {...register("dia_chi", { required: true })}
                  type="text"
                  placeholder="Nhập địa chỉ kho"
                  className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div className="flex justify-end mt-4 gap-3">
                <button
                  type="button"
                  onClick={() => setisnewkho(false)}
                  className="px-6 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                  disabled={isloadingkho}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-xl text-white font-semibold transition flex justify-center items-center ${
                    isloadingkho
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={isloadingkho}
                >
                  {isloadingkho ? (
                    <div className="custom-loader"></div>
                  ) : (
                    "Thêm kho"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal nhập kho */}
      {is_addkho && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-40 px-2">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {!is_chonkho ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isPendingXem ? (
                  <p className="text-center text-gray-500">
                    ⏳ Đang tải dữ liệu kho...
                  </p>
                ) : (
                  thongtinkho.map((item) => (
                    <div
                      key={item.kho_id}
                      className="gap-2 shadow-md border-2 rounded-lg p-4 
                      transition-transform duration-300 hover:scale-105 cursor-pointer"
                      onClick={() => handleChonKho(item)}
                    >
                      <p>
                        <b>Tên kho:</b> {item.ten_kho}
                      </p>
                      <p>
                        <b>Địa chỉ:</b> {item.dia_chi}
                      </p>
                      <p>
                        <b>Nhà cung cấp:</b> {item.nha_cung_cap}
                      </p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-black text-xl md:text-2xl font-bold text-center mb-4">
                  Phiếu nhập kho
                </h2>
                <form onSubmit={handleNhapKho} className="flex flex-col gap-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm md:text-base">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border p-2">ID sản phẩm</th>
                          <th className="border p-2">Tên sản phẩm</th>
                          <th className="border p-2">Giá bán</th>
                          <th className="border p-2">Số lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sanpham.map((item) => (
                          <tr key={item.sanpham_id}>
                            <td className="border p-2 text-center">
                              {item.sanpham_id}
                            </td>
                            <td className="border p-2">{item.ten_sanpham}</td>
                            <td className="border p-2">{item.gia_ban} VND</td>
                            <td className="border p-2">
                              <input
                                type="number"
                                placeholder="0"
                                value={soluongNhap[item.sanpham_id] || ""}
                                onChange={(e) =>
                                  setSoluongNhap((prev) => ({
                                    ...prev,
                                    [item.sanpham_id]: e.target.value,
                                  }))
                                }
                                className="w-full text-center border rounded-md px-1 py-1"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <input
                      type="text"
                      className="border p-2 rounded"
                      placeholder="Nhà cung cấp"
                      name="nha_cung_cap"
                      value={nha_cung_cap}
                      onChange={(e) => setnha_cung_cap(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-4 justify-center mt-4 flex-wrap">
                    <button
                      type="submit"
                      disabled={isPending}
                      className={`px-4 py-2 rounded-lg text-white transition-colors
                      ${isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                    >
                      {isPending ? "Đang lưu..." : "Lưu kho"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChonKho(false);
                        setIsAddKho(false);
                        setSoluongNhap({});
                      }}
                      className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Danh sách sản phẩm */}
      <div className="flex-1 p-4">
        <h2 className="text-xl font-bold mb-4 text-center">
          Danh sách sản phẩm
        </h2>

        {/* Thanh lọc */}
        <div className="flex flex-wrap items-center gap-3 mb-4 bg-gray-100 p-3 rounded">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded flex-1"
          />
          <select
            value={selectedKho}
            onChange={(e) => setSelectedKho(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">-- Tất cả kho --</option>
            {khoList.map((kho, idx) => (
              <option key={idx} value={kho}>
                {kho}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Giá từ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="p-2 border rounded w-28"
          />
          <input
            type="number"
            placeholder="Đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="p-2 border rounded w-28"
          />
          <button
            onClick={() => {
              setSearch("");
              setSelectedKho("");
              setMinPrice("");
              setMaxPrice("");
            }}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Reset
          </button>
        </div>

        {isloading ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm md:text-base">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Tên sản phẩm</th>
                  <th className="border p-2">Giá bán</th>
                  <th className="border p-2">Số lượng</th>
                  <th className="border p-2">Tên kho</th>
                  <th className="border p-2">Nhà cung cấp</th>
                </tr>
              </thead>
              <tbody>
                {filteredSP.map((item) => (
                  <tr key={item.sanpham_id}>
                    <td className="border p-2">{item.ten_sanpham}</td>
                    <td className="border p-2">{item.gia_ban} VND</td>
                    <td className="border p-2">{item.so_luong_ton}</td>
                    <td className="border p-2">{item.ten_kho}</td>
                    <td className="border p-2">{item.nha_cung_cap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500">⏳ Đang tải...</div>
        )}
      </div>
    </div>
  );
}
