import { Navigate } from "react-router-dom";

export default function RequireRole({ allowed, children }) {
  const role = localStorage.getItem("role");

  if (!allowed.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
