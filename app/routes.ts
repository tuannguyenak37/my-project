import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // "/"  -> load Home.tsx
  route("login", "../app/src/components/page/LoginPage.jsx"), // "/login" -> load LoginPage.jsx
] satisfies RouteConfig;
