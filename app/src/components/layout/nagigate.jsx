import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import fetchUserFromCookie from "../../redux/slices/userThunk.js";
import { Link, useNavigate } from "react-router-dom";
import Shearch from "../ui/shearch/Shearch.jsx";

export default function Navbar() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // user dropdown
  const [keyword, setKeyword] = useState(""); // search input
  const [showSearchDropdown, setShowSearchDropdown] = useState(false); // search dropdown

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.length;

  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const searchRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUserFromCookie()); // gọi /refresh-token
  }, []);

  // Ẩn dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    Navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="text-[2rem] font-bold text-blue-400">
          Maliket
        </Link>

        {/* Search bar desktop */}
        <div className="hidden md:flex flex-1 mx-6 relative" ref={searchRef}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowSearchDropdown(e.target.value.trim() !== "");
            }}
            className="w-full px-4 py-2 border rounded-l-md focus:outline-none"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md">
            Tìm
          </button>

          {/* Dropdown kết quả */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 w-full bg-white border mt-1 rounded-md shadow-lg z-50 max-h-72 overflow-y-auto">
              <Shearch keyword={keyword} />
            </div>
          )}
        </div>

        {/* Menu desktop */}
        <div className="hidden lg:flex space-x-6">
          <Link to="#" className="text-gray-700 hover:text-blue-600">
            Danh mục
          </Link>
          <Link to="#" className="text-gray-700 hover:text-blue-600">
            Khuyến mãi
          </Link>
        </div>

        {/* User + Cart + Hamburger */}
        <div className="flex items-center space-x-5 relative mx-4">
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
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    to="/dashboardUser"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Đơn hàng của tôi
                  </Link>
                  {user?.shop_id && (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Shop của tôi
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Đăng nhập
            </Link>
          )}

          {/* Nút menu mobile */}
          <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="lg:hidden bg-white px-4 pb-4 space-y-2 relative">
          <Link to="#" className="block text-gray-700 hover:text-blue-600">
            Danh mục
          </Link>
          <Link to="#" className="block text-gray-700 hover:text-blue-600">
            Khuyến mãi
          </Link>

          {/* Search mobile */}
          <div className="mt-3 relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setShowSearchDropdown(e.target.value.trim() !== "");
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
            {showSearchDropdown && (
              <div className="absolute top-full left-0 w-full bg-white border mt-1 rounded-md shadow-lg z-50 max-h-72 overflow-y-auto">
                <Shearch keyword={keyword} />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
