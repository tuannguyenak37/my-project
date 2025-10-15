import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleSelect,
} from "../../redux/slices/cart.js";
import chekoutAPI from "../../utils/API/checkout";
import CustomerInfoForm from "../ui/checkout/CustomerInfoForm.jsx";
import ProductList from "../ui/checkout/ProductList.jsx";
import OrderSummary from "../ui/checkout/OrderSummary.jsx";
import PaymentMethod from "../ui/checkout/PaymentMethod.jsx";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const savedProducts = sessionStorage.getItem("productsToCheckout");
  const productsToCheckout = useMemo(
    () => (savedProducts ? JSON.parse(savedProducts) : []),
    [savedProducts]
  );
  //  lấy redux
  const dispatch = useDispatch();
  const cart = useSelector((sate) => sate.cart.items);
  const handelremovecart = (id) => {
    dispatch(removeFromCart(id));
  };
  // ✅ Thêm formState.errors
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shopNotes: {},
    },
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [summary, setSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0,
  });
  const [perShopTotals, setPerShopTotals] = useState([]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // ✅ Gom nhóm sản phẩm theo shop
  const groupedItems = useMemo(() => {
    const grouped = {};
    productsToCheckout.forEach((item) => {
      const shopId = item.shop_id || "unknown";
      if (!grouped[shopId])
        grouped[shopId] = {
          ten_shop: item.ten_shop || "Shop không xác định",
          items: [],
        };
      grouped[shopId].items.push(item);
    });
    return grouped;
  }, [productsToCheckout]);

  // ✅ Tính tổng tiền
  useEffect(() => {
    if (!Object.keys(groupedItems).length) return;

    const perShop = Object.entries(groupedItems).map(([shopId, shop]) => {
      const subtotal = shop.items.reduce(
        (s, it) => s + Number(it.gia_ban || 0) * Number(it.so_luong || 0),
        0
      );
      const shipping = subtotal > 0 ? 30000 : 0;
      return {
        shopId,
        ten_shop: shop.ten_shop,
        subtotal,
        shipping,
        total: subtotal + shipping,
      };
    });

    const subtotal = perShop.reduce((s, p) => s + p.subtotal, 0);
    const shipping = perShop.reduce((s, p) => s + p.shipping, 0);
    const total = perShop.reduce((s, p) => s + p.total, 0);

    if (JSON.stringify(perShopTotals) !== JSON.stringify(perShop))
      setPerShopTotals(perShop);
    const newSummary = { subtotal, shipping, total };
    if (JSON.stringify(summary) !== JSON.stringify(newSummary))
      setSummary(newSummary);
  }, [groupedItems]);

  const { mutate: checkout, isPending } = useMutation({
    mutationFn: (data) => chekoutAPI.chekout_pay(data),
    onSuccess: () => {
      (toast.success("✅ Đặt hàng thành công! cảm ơn bạn đã mua hàng"),
        navigate("/"));
    },

    onError: (error) => {
      toast.error("❌ Có lỗi xảy ra khi đặt hàng!");
      console.error("❌ Lỗi :", error);
    },
  });

  // ✅ Kiểm tra dữ liệu thiếu trước khi gửi
  const onSubmit = (data) => {
    if (!selectedAddress) {
      toast.error("❌ Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    if (!data.paymentMethod) {
      toast.error("❌ Vui lòng chọn phương thức thanh toán!");
      return;
    }

    if (productsToCheckout.length === 0) {
      toast.error("❌ Giỏ hàng trống, không thể đặt hàng!");
      return;
    }

    console.log("💳 Phương thức thanh toán:", data.paymentMethod);
    const shopNotes = watch("shopNotes") || {};

    const list_sanpham = perShopTotals.flatMap((p) => {
      const items = groupedItems[p.shopId]?.items || [];
      const ghiChuShop = shopNotes[p.shopId] || "";
      return items.map((item) => ({
        sanpham_id: item.sanpham_id,
        so_luong: item.so_luong,
        shop_id: p.shopId,
        ghi_chu: ghiChuShop,
      }));
    });

    const orderData = {
      khachhang_id: selectedAddress.khachhang_id,
      hinh_thuc_thanh_toan: data.paymentMethod,
      list_sanpham,
    };

    checkout(orderData);
    console.log("🧾 Dữ liệu đơn hàng gửi lên API:", orderData);

    // Duyệt qua từng sản phẩm trong shop đó
    for (const sp of orderData.list_sanpham) {
      handelremovecart(sp.sanpham_id); // gọi hàm xóa từng sản phẩm
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-4 bg-orange-500 p-4 rounded-sm">
        <h1 className="text-2xl font-bold text-white">Đặt Hàng</h1>
        <a href="/cart" className="text-white hover:underline text-sm">
          Quay lại giỏ hàng
        </a>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <CustomerInfoForm setValueParent={setSelectedAddress} />
            <ProductList
              groupedItems={groupedItems}
              formatCurrency={formatCurrency}
              register={register}
            />
            {/* ✅ Truyền errors vào PaymentMethod */}
            <PaymentMethod register={register} errors={errors} />
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              summary={summary}
              formatCurrency={formatCurrency}
              perShopTotals={perShopTotals}
              isPending={isPending}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
