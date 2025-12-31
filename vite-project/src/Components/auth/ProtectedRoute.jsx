import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ adminOnly = false, children }) {
  const token = localStorage.getItem("learnix_token");
  const user = JSON.parse(localStorage.getItem("learnix_user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/students" replace />;
  }

  return children ? children : <Outlet />;
}
