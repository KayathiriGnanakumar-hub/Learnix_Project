import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ adminOnly = false, children }) {
  const token = localStorage.getItem("learnix_token");
  const user = JSON.parse(localStorage.getItem("learnix_user"));
  const location = useLocation();

  // ❌ Not logged in → go to login with redirect
  if (!token || !user) {
    return (
      <Navigate
        to={`/login?redirect=${location.pathname}`}
        replace
      />
    );
  }

  // ❌ Admin route accessed by student
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/students" replace />;
  }

  return children ? children : <Outlet />;
}
