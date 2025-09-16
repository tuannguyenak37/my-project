import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // "/"  -> load routes/home.tsx
  index("routes/home.tsx"),

  // "/login" -> load routes/login.tsx
  route("login", "./src/components/page/LoginPage.jsx"),
] satisfies RouteConfig;
