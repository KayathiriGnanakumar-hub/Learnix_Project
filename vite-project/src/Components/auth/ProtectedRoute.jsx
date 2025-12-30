import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ adminOnly = false, children }) {
  const token = localStorage.getItem("learnix_token");
  const user = JSON.parse(localStorage.getItem("learnix_user"));
  const location = useLocation();

  // ❌ Not logged in → force login
  if (!token || !user) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  // ❌ Admin route but user is not admin
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/students" replace />;
  }

  // ✅ Allow internal protected navigation
  return children ? children : <Outlet />;
}
