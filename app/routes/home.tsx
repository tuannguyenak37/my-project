import type { Route } from "./+types/home";
import { Provider } from "react-redux";
import HomePage from "./../src/components/page/HomePage.jsx";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <HomePage />;
}
