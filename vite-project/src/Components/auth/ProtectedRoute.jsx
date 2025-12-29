import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly }) {
  const isLoggedIn =
    localStorage.getItem("learnix_logged_in") === "true";

  const user = JSON.parse(
    localStorage.getItem("learnix_user")
  );

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/students" replace />;
  }

  return children;
}
