import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import chekoutAPI from "../../utils/API/checkout";
import CustomerInfoForm from "../ui/checkout/CustomerInfoForm.jsx";
import ProductList from "../ui/checkout/ProductList.jsx";
import PaymentMethod from "../ui/checkout/PaymentMethod.jsx";
import OrderSummary from "../ui/checkout/OrderSummary.jsx";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items || []);
  const productsToCheckout = JSON.parse(
    sessionStorage.getItem("productsToCheckout") || "[]"
  );

  const { register, handleSubmit, watch, setValue, getValues, formState } =
    useForm({
      defaultValues: {
        fullName: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        detailAddress: "",
        note: "",
        paymentMethod: "cod",
        shopNotes: {},
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
  const [perShopTotals, setPerShopTotals] = useState([]);

  const province = watch("province");
  const district = watch("district");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // Fetch provinces
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch districts
  useEffect(() => {
    if (!province) return;

    axios
      .get(`https://provinces.open-api.vn/api/p/${province}?depth=2`)
      .then((res) => {
        setDistricts(res.data.districts || []);
        setWards([]);
        setValue("district", "");
        setValue("ward", "");
      })
      .catch(() => setDistricts([]));
  }, [province, setValue]);

  // Fetch wards
  useEffect(() => {
    if (!district) return;

    axios
      .get(`https://provinces.open-api.vn/api/d/${district}?depth=2`)
      .then((res) => {
        setWards(res.data.wards || []);
        setValue("ward", "");
      })
      .catch(() => setWards([]));
  }, [district, setValue]);

  // Group products by shop
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

  // Calculate totals
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
    const newSummary = { subtotal, shipping, total };

    if (JSON.stringify(perShopTotals) !== JSON.stringify(perShop))
      setPerShopTotals(perShop);
    if (JSON.stringify(summary) !== JSON.stringify(newSummary))
      setSummary(newSummary);
  }, [groupedItems]);

  const { mutate: checkout, isPending } = useMutation({
    mutationFn: (data) => chekoutAPI.chekout_pay(data),
    onSuccess: () => toast.success("✅ Thanh toán thành công!"),
    onError: (error) => {
      toast.error("❌ Có lỗi xảy ra khi thanh toán!");
      console.error("❌ Lỗi :", error);
    },
  });

  const onSubmit = (values) => {
    const shopsPayload = perShopTotals.map((p) => ({
      shop_id: p.shopId,
      ten_shop: p.ten_shop,
      items: groupedItems[p.shopId]?.items || [],
      note: (values.shopNotes && values.shopNotes[p.shopId]) || "",
      subtotal: p.subtotal,
      shipping: p.shipping,
      total: p.total,
    }));

    const orderData = {
      customer: {
        fullName: values.fullName,
        phone: values.phone,
        province: values.province,
        district: values.district,
        ward: values.ward,
        detailAddress: values.detailAddress,
      },
      paymentMethod: values.paymentMethod,
      shops: shopsPayload,
      total: summary.total,
    };

    checkout(orderData);
    console.log("🧾 Dữ liệu đơn hàng gửi lên API:", orderData);
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-4 bg-orange-500 p-4 rounded-sm">
        <h1 className="text-2xl font-bold text-white">Thanh Toán</h1>
        <a href="/cart" className="text-white hover:underline text-sm">
          Quay lại giỏ hàng
        </a>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <CustomerInfoForm
              register={register}
              setValue={setValue}
              provinces={provinces}
              districts={districts}
              wards={wards}
              formState={formState}
            />
            <ProductList
              groupedItems={groupedItems}
              formatCurrency={formatCurrency}
              register={register}
            />
            <PaymentMethod register={register} />
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
