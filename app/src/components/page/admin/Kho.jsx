import React, { useEffect, useState } from "react";
import KhoAPI from "../../../utils/API/kho.js";
import NagiveAdmin from "./nagiveadmin";
import axios from "../../../utils/API/sanpham.js";
import { useMutation } from "@tanstack/react-query";

export default function Kho() {
  const [sanpham, setSanpham] = useState([]);
  const [isloading, setIsloading] = useState(false);

  const [is_addkho, setis_addKho] = useState(false); // bật modal nhập kho
  const [is_chonkho, set_ischonkho] = useState(false); // đã chọn kho chưa
  const [select_kho, setSelect_kho] = useState(""); // id kho đã chọn
  const [thongtinkho, set_thongtinkho] = useState([]); // danh sách kho

  // state cho lọc sản phẩm
  const [search, setSearch] = useState("");
  const [khoList, setKhoList] = useState([]);
  const [selectedKho, setSelectedKho] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // load dữ liệu sản phẩm
  useEffect(() => {
    const xemkho = async () => {
      try {
        const response = await axios.xemkho();
        setSanpham(response.data.data);
        setKhoList(
          Array.from(new Set(response.data.data.map((item) => item.ten_kho)))
        );
        setIsloading(true);
      } catch (error) {
        console.log(error);
      }
    };

    xemkho();
  }, []);

  // xem danh sách kho
  const { mutate: xemkho, isPending: isPending_xem } = useMutation({
    mutationFn: () => KhoAPI.xemthongtinkho(),
    onSuccess: (res) => {
      console.log("Dữ liệu xem kho:", res.data);
      set_thongtinkho(res.data.data);
    },
    onError: (error) => {
      console.error("❌ Lỗi khi xem kho:", error);
    },
  });

  const handel_isnhapkho = () => {
    setis_addKho(true);
    xemkho(); // gọi API lấy danh sách kho
  };

  const handel_chonKho = (items) => {
    setSelect_kho(items.kho_id);
    set_ischonkho(true);
  };

  // lọc dữ liệu sản phẩm
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

  // nhập kho mutation
  const { mutate: nhapKho, isPending } = useMutation({
    mutationFn: (datakho) => KhoAPI.nhapkho(datakho),
    onSuccess: () => {
      console.log("✅ Nhập kho thành công");
      set_ischonkho(false);
      setis_addKho(false);
    },
    onError: (error) => {
      console.error("❌ Lỗi khi nhập kho:", error);
    },
  });

  // submit nhập kho
  const handle_nhap_kho = (e) => {
    e.preventDefault();

    const listSanPham = sanpham
      .map((sp, idx) => {
        const input = e.target.elements["soluongnhap"][idx];
        return {
          sanpham_id: sp.sanpham_id,
          ten_sanpham: sp.ten_sanpham,
          gia_ban: sp.gia_ban,
          so_luong: parseInt(input.value || 0, 10),
        };
      })
      .filter((r) => r.so_luong > 0);

    const datakho = { listSanPham, select_kho };
    console.log(">>> Nhập kho:", datakho);
    nhapKho(datakho);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <NagiveAdmin />

      {/* Nút nhập kho */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handel_isnhapkho}
          className="cursor-pointer ring-2 rounded-2xl shadow-2xl border uppercase bg-white px-4 py-2 
          active:translate-x-0.5 active:translate-y-0.5 
          hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] transition"
        >
          Nhập kho
        </button>
      </div>

      {/* Modal nhập kho */}
      {is_addkho && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-40 px-2">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {!is_chonkho ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isPending_xem ? (
                  <p className="text-center text-gray-500">
                    ⏳ Đang tải dữ liệu kho...
                  </p>
                ) : (
                  thongtinkho.map((items) => (
                    <div
                      key={items.kho_id}
                      className="gap-2 shadow-md border-2 rounded-lg p-4 
                      transition-transform duration-300 hover:scale-105 cursor-pointer"
                      onClick={() => handel_chonKho(items)}
                    >
                      <p>
                        <b>Tên kho:</b> {items.ten_kho}
                      </p>
                      <p>
                        <b>Địa chỉ:</b> {items.dia_chi}
                      </p>
                      <p>
                        <b>Nhà cung cấp:</b> {items.nha_cung_cap}
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
                <form
                  onSubmit={handle_nhap_kho}
                  className="flex flex-col gap-4"
                >
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
                                name="soluongnhap"
                                className="w-full text-center border rounded-md px-1 py-1"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className={`px-4 py-2 rounded-lg text-white transition-colors 
                    w-full md:w-40 self-center
                    ${
                      isPending
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {isPending ? "Đang lưu..." : "Lưu kho"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      set_ischonkho(false); // quay lại chọn kho
                      setis_addKho(false); // đóng luôn giao diện nhập kho nếu muốn
                    }}
                    className="px-4 py-2 rounded-lg text-white transition-colors w-full md:w-40 self-center bg-red-500 hover:bg-red-600"
                  >
                    Hủy
                  </button>
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
            {khoList.map((kho, index) => (
              <option key={index} value={kho}>
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
                </tr>
              </thead>
              <tbody>
                {filteredSP.map((item) => (
                  <tr key={item.sanpham_id}>
                    <td className="border p-2">{item.ten_sanpham}</td>
                    <td className="border p-2">{item.gia_ban} VND</td>
                    <td className="border p-2">{item.so_luong_ton}</td>
                    <td className="border p-2">{item.ten_kho}</td>
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
