import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import APIUser from "../../utils/API/Login.js";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/User_data.js"; // ✅ named import

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // phải ở trong function component
  const dispatch = useDispatch(); // 🔹 khai báo dispatch ở đây

  // Login form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  // Register form
  const {
    register: register_createUser,
    handleSubmit: handleSubmit_CreateUser,
    watch,
    formState: { errors: errors_CreateUser },
  } = useForm({ mode: "onChange" });

  // Hàm submit login
  const handleSubmit_Login = async (data) => {
    try {
      setLoading(true);

      const res = await APIUser.loginApi(data);
      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.access_Token,
        })
      );

      // lưu token vào localStorage
      localStorage.setItem("token", res.data.data.access_Token);

      console.log("Logged in user:", res);
      navigate("/"); // điều hướng sau login

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Hàm submit register
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit_Register = async (data) => {
    try {
      setLoading(true);
      console.log("Register data:", data);
      await APIUser.Create_User(data);
      setLoading(false);

      setIsLogin(true); // quay lại login
    } catch (error) {
      const message = error.response?.data?.message || "Đã có lỗi xảy ra";
      setErrorMessage(message);
      setLoading(false);
    }
  };

  // Reusable input component
  const InputField = ({
    label,
    registerFunc,
    name,
    type = "text",
    rules,
    error,
  }) => (
    <div className="relative w-full min-w-[200px]">
      <input
        placeholder=" "
        type={type}
        {...registerFunc(name, rules)}
        className="peer h-11 w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 text-sm text-gray-700 outline-none transition-all
        placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200
        focus:border-2 focus:border-cyan-500 focus:border-t-transparent disabled:border-0 disabled:bg-gray-100"
      />
      <label className="absolute left-0 -top-1.5 text-[11px] text-blue-gray-400 peer-focus:text-cyan-500 transition-colors">
        {label}
      </label>
      <span className="text-red-600 text-sm mt-1 block min-h-[1.25rem] whitespace-normal break-words">
        {error?.message}
      </span>
    </div>
  );

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <AnimatePresence mode="wait">
        {isLogin ? (
          // Login Form
          <motion.form
            key="login"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onSubmit={handleSubmit(handleSubmit_Login)}
            className="relative flex w-96 flex-col rounded-xl bg-white text-gray-700 shadow-md"
          >
            <div className="relative mx-4 -mt-6 mb-4 grid h-28 place-items-center overflow-hidden rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-white shadow-lg shadow-cyan-500/40">
              <h3 className="text-3xl font-semibold">Sign In</h3>
            </div>

            <div className="flex flex-col gap-4 p-6">
              <InputField
                label="Tài khoản"
                registerFunc={register}
                name="user_name"
                rules={{
                  required: "Tài khoản là bắt buộc",
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: "Không dấu, chỉ chữ và số",
                  },
                }}
                error={errors.user_name}
              />
              <InputField
                label="Password"
                type="password"
                registerFunc={register}
                name="password"
                rules={{
                  required: "Vui lòng nhập mật khẩu",
                  minLength: { value: 8, message: "Ít nhất 8 ký tự" },
                }}
                error={errors.password}
              />
            </div>

            <div className="p-6 pt-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 py-3 px-6 text-xs font-bold uppercase text-white shadow-md shadow-cyan-500/20 transition-all hover:shadow-lg hover:shadow-cyan-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Sign In"}
              </button>
              <p className="mt-6 flex justify-center text-sm font-light text-gray-600">
                Don't have an account?
                <button
                  className="font-bold text-cyan-500 hover:underline ml-1"
                  onClick={() => setIsLogin(false)}
                  type="button"
                >
                  Create account
                </button>
              </p>
            </div>
          </motion.form>
        ) : (
          // Register Form
          <motion.form
            key="register"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onSubmit={handleSubmit_CreateUser(handleSubmit_Register)}
            className="relative flex w-96 flex-col rounded-xl bg-white text-gray-700 shadow-md mt-[10rem]"
          >
            <div className="relative mx-4 -mt-6 mb-4 grid h-28 place-items-center overflow-hidden rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-white shadow-lg shadow-cyan-500/40">
              <h3 className="text-3xl font-semibold">Đăng ký</h3>
            </div>

            <div className="flex flex-col gap-4 p-6">
              <InputField
                label="Họ"
                registerFunc={register_createUser}
                name="first_name"
                rules={{ required: "Họ là bắt buộc" }}
                error={errors_CreateUser.first_name}
              />
              <InputField
                label="Tên"
                registerFunc={register_createUser}
                name="last_name"
                rules={{ required: "Tên là bắt buộc" }}
                error={errors_CreateUser.last_name}
              />
              <InputField
                label="Email"
                type="email"
                registerFunc={register_createUser}
                name="email"
                rules={{
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ",
                  },
                }}
                error={errors_CreateUser.email}
              />
              <InputField
                label="Số điện thoại"
                type="tel"
                registerFunc={register_createUser}
                name="phone"
                rules={{
                  required: "Số điện thoại là bắt buộc",
                  pattern: {
                    value: /^[0-9]{9,11}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                }}
                error={errors_CreateUser.phone}
              />
              <InputField
                label="Tài khoản"
                registerFunc={register_createUser}
                name="user_name"
                rules={{
                  required: "Tài khoản là bắt buộc",
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: "Không dấu, chỉ chữ và số",
                  },
                }}
                error={errors_CreateUser.user_name}
              />
              <InputField
                label="Mật khẩu"
                type="password"
                registerFunc={register_createUser}
                name="password"
                rules={{
                  required: "Vui lòng nhập mật khẩu",
                  minLength: { value: 8, message: "Ít nhất 8 ký tự" },
                }}
                error={errors_CreateUser.password}
              />
              <InputField
                label="Xác nhận mật khẩu"
                type="password"
                registerFunc={register_createUser}
                name="confirm_password"
                rules={{
                  required: "Vui lòng xác nhận mật khẩu",
                  validate: (value) =>
                    value === watch("password") || "Mật khẩu không trùng khớp",
                }}
                error={errors_CreateUser.confirm_password}
              />
              <InputField
                label="Ngày sinh"
                type="date"
                registerFunc={register_createUser}
                name="date_of_birth"
                rules={{ required: "Ngày sinh là bắt buộc" }}
                error={errors_CreateUser.date_of_birth}
              />
            </div>
            <span>{errorMessage}</span>

            <div className="p-6 pt-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 py-3 px-6 text-xs font-bold uppercase text-white shadow-md shadow-cyan-500/20 transition-all hover:shadow-lg hover:shadow-cyan-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>

              <p className="mt-6 flex justify-center text-sm font-light text-gray-600">
                Already have an account?
                <button
                  className="font-bold text-cyan-500 hover:underline ml-1"
                  onClick={() => setIsLogin(true)}
                  type="button"
                >
                  Đăng ký
                </button>
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Form;
