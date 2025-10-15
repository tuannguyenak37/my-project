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

const Cart = () => {
  const navigate = useNavigate(); // ✅ chỉ được gọi trong function component

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

  // thay đổi số lượng
  const handleUpdateQuantity = (id, change) => {
    const item = cart1.find((p) => p.sanpham_id === id);
    if (!item) return;
    const newQty = Math.max(1, item.so_luong + change);
    dispatch(updateQuantity({ sanpham_id: id, so_luong: newQty }));
  };

  // xóa sản phẩm
  const removeItem = (id) => {
    dispatch(removeFromCart(id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  // xóa shop
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
    console.log(">>> sản phẩm", selectedProducts);
    if (selectedProducts.length === 0) {
      toast.error(" vui lòng chọn sản phẩm thanh toán");
      return;
    }
    // for (let i = 0; i < selectedProducts.length; i++) {
    //   dispatch(
    //     toggleSelect({
    //       sanpham_id: selectedProducts[i].sanpham_id,
    //     })
    //   );
    // }
    sessionStorage.setItem(
      "productsToCheckout",
      JSON.stringify(selectedProducts)
    );

    navigate("/checkout");
    console.log("Thanh toán với:", selectedProducts);

    navigate("/checkout");
  };

  const groupedItems = groupByShop(cart1);

  return (
    <div className="container mx-auto p-4 max-w-5xl bg-gray-100 font-sans min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Giỏ hàng</h1>
        <Link to="/" className="text-orange-600 hover:underline cursor-pointer">
          Tiếp tục mua sắm
        </Link>
      </div>

      <div id="cart-items" className="bg-white rounded-lg shadow-md mb-4">
        {Object.keys(groupedItems).map((shopId) => {
          const shop = groupedItems[shopId];
          return (
            <div key={shopId} className="mb-4 bg-white rounded-lg">
              <div className="bg-orange-500 text-white p-2 rounded-t-lg flex justify-between items-center">
                <h2 className="text-lg font-semibold">{shop.ten_shop}</h2>
                <button
                  onClick={() => removeShop(shopId)}
                  className="hover:underline"
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="p-4">
                {shop.items.map((item) => (
                  <div
                    key={item.sanpham_id}
                    className="cart-item flex items-center justify-between p-4 border-b"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.sanpham_id)}
                        onChange={(e) =>
                          toggleSelectItem(item.sanpham_id, e.target.checked)
                        }
                        className="mr-3"
                      />
                      <img
                        src={item.url_sanpham}
                        alt={item.ten_sanpham}
                        className="w-20 h-20 object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-gray-800 font-semibold">
                          {item.ten_sanpham}
                        </h3>
                        <p className="text-orange-600">
                          {formatCurrency(item.gia_ban)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.sanpham_id, -1)
                        }
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span className="mx-2">{item.so_luong}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.sanpham_id, 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.sanpham_id)}
                        className="ml-4 text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 bg-white p-4 border-t shadow-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Tổng tiền hàng:</span>
          <span className="text-gray-800 font-semibold">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span className="text-gray-800">{formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Tổng thanh toán:</span>
          <span className="text-orange-600 text-xl font-bold">
            {formatCurrency(total)}
          </span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Cart;
