import { Navigate } from "react-router-dom";

export default function Home() {
  const role = localStorage.getItem("role");

  if (role === "ADMIN") return <Navigate to="/admin" replace />;
  if (role === "TREASURER") return <Navigate to="/treasurer" replace />;
  if (role === "MEMBER") return <Navigate to="/member/events" replace />;

  return <Navigate to="/login" replace />;
}
