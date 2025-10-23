import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleSelect,
} from "../../redux/slices/cart.js";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart1 = useSelector((state) => state.cart.items);

  const [selectedItems, setSelectedItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

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

  const toggleSelectItem = (id, checked) => {
    setSelectedItems((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)
    );
  };

  useEffect(() => {
    const selected = cart1.filter((item) =>
      selectedItems.includes(item.sanpham_id)
    );

    const subtotalVal = selected.reduce(
      (sum, item) => sum + Number(item.gia_ban) * item.so_luong,
      0
    );
    const uniqueShops = [...new Set(selected.map((item) => item.shop_id))];
    const shippingVal = uniqueShops.length * 30000;
    const totalVal = subtotalVal + shippingVal;

    setSubtotal(subtotalVal);
    setShipping(shippingVal);
    setTotal(totalVal);
  }, [cart1, selectedItems]);

  const handleUpdateQuantity = (id, change) => {
    const item = cart1.find((p) => p.sanpham_id === id);
    if (!item) return;
    const newQty = Math.max(1, item.so_luong + change);
    dispatch(updateQuantity({ sanpham_id: id, so_luong: newQty }));
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const removeShop = (shopId) => {
    cart1
      .filter((item) => item.shop_id === shopId)
      .forEach((item) => dispatch(removeFromCart(item.sanpham_id)));

    setSelectedItems((prev) =>
      prev.filter((id) => {
        const item = cart1.find((x) => x.sanpham_id === id);
        return item?.shop_id !== shopId;
      })
    );
  };

  const handleCheckout = () => {
    const selectedProducts = cart1.filter((item) =>
      selectedItems.includes(item.sanpham_id)
    );
    if (selectedProducts.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }
    sessionStorage.setItem(
      "productsToCheckout",
      JSON.stringify(selectedProducts)
    );
    navigate("/checkout");
    console.log("Thanh toán với:", selectedProducts);
  };

  const groupedItems = groupByShop(cart1);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="text-3xl font-bold text-gray-900"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Giỏ hàng
          </motion.h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Tiếp tục mua sắm
          </Link>
        </div>

        <div className="space-y-6">
          {Object.keys(groupedItems).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 py-12"
            >
              Giỏ hàng của bạn đang trống
            </motion.div>
          ) : (
            Object.keys(groupedItems).map((shopId) => {
              const shop = groupedItems[shopId];
              return (
                <motion.div
                  key={shopId}
                  className="bg-white rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-orange-500 text-white p-4 rounded-t-xl flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{shop.ten_shop}</h2>
                    <motion.button
                      onClick={() => removeShop(shopId)}
                      className="text-sm hover:bg-orange-600 px-3 py-1 rounded-lg transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Xóa tất cả
                    </motion.button>
                  </div>
                  <div className="p-4 space-y-4">
                    {shop.items.map((item) => (
                      <motion.div
                        key={item.sanpham_id}
                        className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.sanpham_id)}
                            onChange={(e) =>
                              toggleSelectItem(
                                item.sanpham_id,
                                e.target.checked
                              )
                            }
                            className="h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <motion.img
                            src={item.url_sanpham}
                            alt={item.ten_sanpham}
                            className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                            whileHover={{ scale: 1.05 }}
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                              {item.ten_sanpham}
                            </h3>
                            <p className="text-orange-600 font-medium">
                              {formatCurrency(item.gia_ban)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() =>
                                handleUpdateQuantity(item.sanpham_id, -1)
                              }
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              -
                            </motion.button>
                            <span className="text-gray-800 font-medium w-8 text-center">
                              {item.so_luong}
                            </span>
                            <motion.button
                              onClick={() =>
                                handleUpdateQuantity(item.sanpham_id, 1)
                              }
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              +
                            </motion.button>
                          </div>
                          <motion.button
                            onClick={() => removeItem(item.sanpham_id)}
                            className="text-red-600 hover:text-red-700 font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Xóa
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        <motion.div
          className="sticky bottom-0 bg-white p-6 rounded-xl shadow-lg mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Tổng tiền hàng:</span>
              <span className="text-gray-800 font-semibold">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Phí vận chuyển:</span>
              <span className="text-gray-800 font-semibold">
                {formatCurrency(shipping)}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <span className="text-gray-600 font-medium">
                Tổng thanh toán:
              </span>
              <span className="text-orange-600 text-xl font-bold">
                {formatCurrency(total)}
              </span>
            </div>
            <motion.button
              onClick={handleCheckout}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={selectedItems.length === 0}
            >
              Thanh toán
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
