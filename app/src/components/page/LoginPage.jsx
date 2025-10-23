import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import APIUser from "../../utils/API/Login.js";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/User_data.js";

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔹 Login form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 🔹 Register form
  const {
    register: register_createUser,
    handleSubmit: handleSubmit_CreateUser,
    watch,
    formState: { errors: errors_CreateUser },
  } = useForm();

  // 🔹 Submit login
  const handleSubmit_Login = async (data) => {
    setErrorMessage("");
    try {
      setLoading(true);
      const response = await APIUser.loginApi(data);
      if (response.data.status) {
        const user = response.data.data.user;
        const accessToken = response.data.data.access_Token;
        dispatch(loginSuccess({ user, accessToken }));
        localStorage.setItem("token", accessToken);
        navigate("/");
      } else {
        setErrorMessage(response.data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Mật khẩu hoặc tài khoản bị sai";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Submit register
  const handleSubmit_Register = async (data) => {
    setErrorMessage("");
    try {
      setLoading(true);
      await APIUser.Create_User(data);
      setIsLogin(true);
    } catch (error) {
      const message = error.response?.data?.message || "Đã có lỗi xảy ra";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reusable Input Field
  const InputField = ({
    label,
    registerFunc,
    name,
    type = "text",
    rules,
    error,
  }) => (
    <motion.div
      className="relative w-full min-w-[200px]"
      key={name}
      initial={{ opacity: 0, y: 10 }}
      animate={
        error
          ? { x: [0, -5, 5, -5, 5, 0], opacity: 1, y: 0 }
          : { x: 0, opacity: 1, y: 0 }
      }
      transition={{ duration: 0.4 }}
    >
      <input
        type={type}
        placeholder=" "
        {...registerFunc(name, rules)}
        className={`peer h-11 w-full rounded-lg border px-3 py-3 text-sm text-gray-700 outline-none transition-all bg-transparent
          ${error ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-cyan-500"}`}
      />
      <label className="absolute left-3 -top-2.5 bg-white px-1 text-[11px] text-gray-500 transition-all peer-focus:text-cyan-500">
        {label}
      </label>
      {error && (
        <motion.span
          key={error.message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-600 text-sm mt-1 block min-h-[1.25rem]"
        >
          {error.message}
        </motion.span>
      )}
    </motion.div>
  );

  // 🔹 Animated banner
  const Banner = () => (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
      className="my-6 text-center"
    >
      <motion.h1
        className="text-4xl font-extrabold text-cyan-700 mb-2"
        animate={{
          scale: [1, 1.05, 1, 1.05, 1],
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        Welcome to Maliketh
      </motion.h1>
      <motion.p
        className="text-cyan-600 text-sm font-light"
        animate={{ y: [0, -5, 0], opacity: [1, 0.8, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      ></motion.p>
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-100 to-cyan-200 p-4">
      <Banner />
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.form
            key="login"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onSubmit={handleSubmit(handleSubmit_Login)}
            className="relative flex w-96 flex-col rounded-2xl bg-white text-gray-700 shadow-lg shadow-cyan-300/50 border border-gray-100"
          >
            <div className="mx-4 -mt-6 mb-4 grid h-28 place-items-center rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-white shadow-lg">
              <motion.h3
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-3xl font-semibold"
              >
                Đăng nhập
              </motion.h3>
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
                label="Mật khẩu"
                type="password"
                registerFunc={register}
                name="password"
                rules={{
                  required: "Vui lòng nhập mật khẩu",
                }}
                error={errors.password}
              />
            </div>

            {errorMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center mb-2"
              >
                {errorMessage}
              </motion.p>
            )}

            <div className="p-6 pt-0">
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 py-3 px-6 text-sm font-bold uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-cyan-400/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </motion.button>
              <p className="mt-6 flex justify-center text-sm font-light text-gray-600">
                Chưa có tài khoản?
                <button
                  className="font-bold text-cyan-600 hover:underline ml-1"
                  onClick={() => {
                    setErrorMessage("");
                    setIsLogin(false);
                  }}
                  type="button"
                >
                  Đăng ký
                </button>
              </p>
            </div>
          </motion.form>
        ) : (
          <motion.form
            key="register"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onSubmit={handleSubmit_CreateUser(handleSubmit_Register)}
            className="relative flex w-96 flex-col rounded-2xl bg-white text-gray-700 shadow-lg shadow-cyan-300/50 border border-gray-100"
          >
            <div className="mx-4 -mt-6 mb-4 grid h-28 place-items-center rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-white shadow-lg">
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

            {errorMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center mb-2"
              >
                {errorMessage}
              </motion.p>
            )}

            <div className="p-6 pt-0">
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 py-3 px-6 text-sm font-bold uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-cyan-400/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </motion.button>

              <p className="mt-6 flex justify-center text-sm font-light text-gray-600">
                Đã có tài khoản?
                <button
                  className="font-bold text-cyan-600 hover:underline ml-1"
                  onClick={() => {
                    setErrorMessage("");
                    setIsLogin(true);
                  }}
                  type="button"
                >
                  Đăng nhập
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
