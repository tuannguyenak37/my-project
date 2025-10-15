import React from "react";
import Avatar from "../../../../../public/avatar.jpg";
import { EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
export default function navigate() {
  const user = useSelector((state) => state.user.user);
  console.log(">>>user", user);
  return (
    <div className="mt-16 bg-gray-100">
      <div className="grid grid-cols-2 grid-rows-2 gap-4 rounded-2xl border-b mt-5">
        <div className="row-span-2">
          <div>
            {" "}
            <img
              src={user?.avatar_url || Avatar}
              alt=""
              className="rounded-full w-xl "
            />
          </div>
        </div>
        <div>
          <span>{user?.last_name}</span>
        </div>
        <div className="col-start-2">
          <button>
            {" "}
            <EditOutlined /> sửa
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-5 text-center">
        <NavLink
          to="billing"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-gray-800 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`
          }
        >
          Đơn hàng
        </NavLink>

        <NavLink>thông báo</NavLink>
        <NavLink>thông báo</NavLink>
      </div>
    </div>
  );
}
