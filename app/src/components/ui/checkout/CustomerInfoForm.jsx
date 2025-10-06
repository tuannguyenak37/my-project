import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const CustomerInfoForm = ({ provinces, districts, wards, setValueParent }) => {
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("addresses");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detailAddress: "",
    },
  });

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  const handleEdit = (index) => {
    const addr = addresses[index];
    Object.keys(addr).forEach((key) => setValue(key, addr[key]));
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelect = (index) => {
    const addr = addresses[index];
    Object.keys(addr).forEach((key) => setValueParent(key, addr[key]));
  };

  const onSubmitAddress = (data) => {
    if (editingIndex !== null) {
      const newAddresses = [...addresses];
      newAddresses[editingIndex] = data;
      setAddresses(newAddresses);
    } else {
      setAddresses((prev) => [...prev, data]);
    }
    setShowForm(false);
    setEditingIndex(null);
    reset();
  };

  return (
    <div className="bg-white rounded-sm shadow-sm mb-4 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Địa chỉ giao hàng
      </h2>

      {/* Nút thêm địa chỉ */}
      {!showForm && (
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center mb-4"
          onClick={() => setShowForm(true)}
        >
          <PlusOutlined className="mr-2" /> Thêm địa chỉ
        </button>
      )}

      {/* Danh sách địa chỉ */}
      {addresses.map((addr, index) => (
        <div
          key={index}
          className="border p-4 rounded mb-2 flex justify-between items-center"
        >
          <div className="cursor-pointer" onClick={() => handleSelect(index)}>
            <p className="font-semibold">
              {addr.fullName} - {addr.phone}
            </p>
            <p>
              {addr.detailAddress}, {addr.ward}, {addr.district},{" "}
              {addr.province}
            </p>
          </div>
          <div className="flex gap-2">
            <CheckCircleOutlined
              className="text-green-500 cursor-pointer"
              onClick={() => handleSelect(index)}
            />
            <EditOutlined
              className="text-blue-500 cursor-pointer"
              onClick={() => handleEdit(index)}
            />
            <DeleteOutlined
              className="text-red-500 cursor-pointer"
              onClick={() => handleDelete(index)}
            />
          </div>
        </div>
      ))}

      {/* Form thêm/sửa */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmitAddress)} className="mt-4">
          {/* Họ tên + SĐT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                {...register("fullName", { required: "Họ và tên là bắt buộc" })}
                className="border border-gray-300 rounded-sm px-3 py-2 w-full"
                placeholder="Nhập họ và tên"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="tel"
                {...register("phone", {
                  required: "Số điện thoại là bắt buộc",
                  pattern: {
                    value: /^[0-9]{9,11}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                })}
                className="border border-gray-300 rounded-sm px-3 py-2 w-full"
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Tỉnh/Quận/Xã */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <select
                {...register("province", {
                  required: "Vui lòng chọn tỉnh/thành",
                })}
                className="border px-3 py-2 w-full"
              >
                <option value="">-- Chọn tỉnh/thành --</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.province.message}
                </p>
              )}
            </div>
            <div>
              <select
                {...register("district", {
                  required: "Vui lòng chọn quận/huyện",
                })}
                className="border px-3 py-2 w-full"
              >
                <option value="">-- Chọn quận/huyện --</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.district.message}
                </p>
              )}
            </div>
            <div>
              <select
                {...register("ward", { required: "Vui lòng chọn phường/xã" })}
                className="border px-3 py-2 w-full"
              >
                <option value="">-- Chọn phường/xã --</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>
              {errors.ward && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ward.message}
                </p>
              )}
            </div>
          </div>

          {/* Địa chỉ chi tiết */}
          <div className="mb-4">
            <textarea
              rows="2"
              {...register("detailAddress", {
                required: "Vui lòng nhập địa chỉ chi tiết",
              })}
              className="border border-gray-300 rounded-sm px-3 py-2 w-full"
              placeholder="Số nhà, tên đường, tòa nhà..."
            />
            {errors.detailAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.detailAddress.message}
              </p>
            )}
          </div>

          {/* Nút lưu / hủy */}
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {editingIndex !== null ? "Cập nhật" : "Thêm"}
            </button>
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => {
                reset();
                setShowForm(false);
                setEditingIndex(null);
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CustomerInfoForm;
