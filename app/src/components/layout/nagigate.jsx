import React, { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import fetchUserFromCookie from "../../redux/slices/userThunk.js";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

export default function Navbar() {
  const Navigate = useNavigate();
  const logout = (e) => {
    Navigate("/login");
  };
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.length;
  console.log(">>>>>", cartCount);

  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserFromCookie()); // gọi /refresh-token
  }, []);
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="text-[2rem] font-bold text-blue-400">
          Maliket
        </a>

        {/* Search bar desktop */}
        <div className="hidden md:flex flex-1 mx-6">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full px-4 py-2 border rounded-l-md focus:outline-none"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md">
            Tìm
          </button>
        </div>

        {/* Menu desktop */}
        <div className="hidden lg:flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Danh mục
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Khuyến mãi
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Hỗ trợ
          </a>
        </div>

        {/* User + Cart + Hamburger */}
        <div className="flex items-center space-x-5 relative">
          {/* Giỏ hàng */}
          <Link to="/cart" className="relative">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Tài khoản */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1"
              >
                <User size={22} />
                <span>{user?.last_name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Hồ sơ cá nhân
                  </a>
                  <a
                    href="/dashboardUser"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Đơn hàng của tôi
                  </a>
                  {user?.shop_id && (
                    <Link
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      to="/dashboard"
                    >
                      Shop của tôi
                    </Link>
                  )}

                  <button
                    onClick={() => dispatch(logout())}
                    className="w-full text-left px-4 py-2  hover:bg-gray-100 text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="text-gray-700 hover:text-blue-600">
              Đăng nhập
            </a>
          )}

          {/* Nút menu mobile */}
          <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="lg:hidden bg-white px-4 pb-4 space-y-2">
          <a href="#" className="block text-gray-700 hover:text-blue-600">
            Danh mục
          </a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">
            Khuyến mãi
          </a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">
            Hỗ trợ
          </a>

          {/* Search bar mobile */}
          <div className="mt-3">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
