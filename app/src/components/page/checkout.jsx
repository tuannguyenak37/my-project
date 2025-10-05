import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detailAddress: "",
      note: "",
      paymentMethod: "cod",
    },
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0,
  });

  const province = watch("province");
  const district = watch("district");

  // Format tiền tệ
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // Lấy danh sách tỉnh/thành khi load
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Lấy quận/huyện khi chọn tỉnh
  useEffect(() => {
    if (!province) return;
    axios
      .get(`https://provinces.open-api.vn/api/p/${province}?depth=2`)
      .then((res) => setDistricts(res.data.districts || []));
    setValue("district", "");
    setValue("ward", "");
    setWards([]);
  }, [province]);

  // Lấy phường/xã khi chọn huyện
  useEffect(() => {
    if (!district) return;
    axios
      .get(`https://provinces.open-api.vn/api/d/${district}?depth=2`)
      .then((res) => setWards(res.data.wards || []));
    setValue("ward", "");
  }, [district]);

  // Nhóm sản phẩm theo shop
  const groupByShop = (items) => {
    const grouped = {};
    items.forEach((item) => {
      const shopId = item.shop_id || "unknown";
      if (!grouped[shopId]) {
        grouped[shopId] = {
          ten_shop: item.ten_shop || "Shop không xác định",
          items: [],
        };
      }
      grouped[shopId].items.push(item);
    });
    return grouped;
  };

  // Cập nhật tổng tiền
  useEffect(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.gia_ban * item.so_luong,
      0
    );
    const uniqueShops = [...new Set(cartItems.map((i) => i.shop_id))];
    const shipping = uniqueShops.length * 30000;
    const total = subtotal + shipping;
    setSummary({ subtotal, shipping, total });
  }, [cartItems]);

  // Xử lý đặt hàng
  const onSubmit = (data) => {
    if (!data.fullName || !data.phone || !data.detailAddress) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    const orderData = {
      ...data,
      items: cartItems,
      total: summary.total,
    };

    console.log("Dữ liệu đơn hàng:", orderData);
    alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");
  };

  const groupedItems = groupByShop(cartItems);

  return (
    <div className="container mx-auto p-4 max-w-5xl bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-orange-500 p-4 rounded-sm">
        <h1 className="text-2xl font-bold text-white">Thanh Toán</h1>
        <a href="/cart" className="text-white hover:underline text-sm">
          Quay lại giỏ hàng
        </a>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form giao hàng + phương thức thanh toán */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-sm shadow-sm mb-4 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Địa chỉ giao hàng
              </h2>

              {/* Họ tên + SĐT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    {...register("fullName")}
                    className="border border-gray-300 rounded-sm px-3 py-2 w-full"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="border border-gray-300 rounded-sm px-3 py-2 w-full"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              {/* Chọn Tỉnh/Quận/Xã */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tỉnh/Thành *
                  </label>
                  <select
                    {...register("province")}
                    className="border px-3 py-2 w-full"
                  >
                    <option value="">-- Chọn tỉnh/thành --</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Quận/Huyện *
                  </label>
                  <select
                    {...register("district")}
                    className="border
                     px-3 py-2 w-full"
                  >
                    <option value="">-- Chọn quận/huyện --</option>
                    {districts.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Phường/Xã *
                  </label>
                  <select
                    {...register("ward")}
                    className="border px-3 py-2 w-full"
                  >
                    <option value="">-- Chọn phường/xã --</option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Địa chỉ chi tiết */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Địa chỉ chi tiết *
                </label>
                <textarea
                  rows="2"
                  {...register("detailAddress")}
                  className="border border-gray-300 rounded-sm px-3 py-2 w-full"
                  placeholder="Số nhà, tên đường, tòa nhà..."
                />
              </div>

              {/* Ghi chú */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Ghi chú
                </label>
                <textarea
                  rows="2"
                  {...register("note")}
                  className="border border-gray-300 rounded-sm px-3 py-2 w-full"
                  placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                />
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="bg-white rounded-sm shadow-sm mb-4 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Sản phẩm
              </h2>
              {Object.keys(groupedItems).map((shopId) => {
                const shop = groupedItems[shopId];
                return (
                  <div key={shopId} className="border-t pt-4">
                    <div className="mb-2 font-semibold">{shop.ten_shop}</div>
                    {shop.items.map((item) => (
                      <div
                        key={item.sanpham_id}
                        className="flex items-center mb-4"
                      >
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
                  </div>
                );
              })}
            </div>

            {/* Thanh toán */}
            <div className="bg-white rounded-sm shadow-sm mb-4 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                {[
                  { id: "cod", label: "Thanh toán khi nhận hàng (COD)" },
                  { id: "bank", label: "Chuyển khoản ngân hàng" },
                  { id: "card", label: "Thẻ tín dụng/ghi nợ" },
                ].map((method) => (
                  <div key={method.id} className="flex items-center">
                    <input
                      type="radio"
                      id={method.id}
                      value={method.id}
                      {...register("paymentMethod")}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor={method.id}>{method.label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tóm tắt */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Tóm tắt đơn hàng
              </h2>
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
                <span className="text-orange-500">
                  {formatCurrency(summary.total)}
                </span>
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 w-full rounded-sm transition duration-300"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
