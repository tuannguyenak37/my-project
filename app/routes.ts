import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // "/"  -> load routes/home.tsx
  index("routes/home.tsx"),

  // "/login" -> load routes/login.tsx
  route("login", "./src/components/page/LoginPage.jsx"),
  route("dashboard", "./src/components/page/Dashborad.jsx"),
  route("sanpham", "./src/components/page/admin/Sanpham.jsx"),
  route("kho", "./src/components/page/admin/Kho.jsx"),
  route("/product/:id", "./src/components/page/ProductDetail.jsx"),
] satisfies RouteConfig;
