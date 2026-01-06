import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoLogOut, IoPersonCircle, IoHome, IoBook, IoSchool } from "react-icons/io5";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const goToHome = () => {
    if (location.pathname !== "/") navigate("/");
    else document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate("/");
  };

  const navLink =
    "relative text-gray-700 font-medium transition \
     after:absolute after:left-0 after:-bottom-1 after:h-[2px] \
     after:w-0 after:bg-indigo-600 after:transition-all \
     hover:text-indigo-600 hover:after:w-full";

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <div onClick={goToHome} className="flex items-center gap-3 cursor-pointer">
          <img src="/logo.png" alt="Learnix" className="h-10" onError={(e)=>{e.target.style.display='none'}} />
          <span className="text-xl font-bold text-indigo-600">Learnix</span>
        </div>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6">
          <button onClick={goToHome} className={navLink}>Home</button>
          <Link to="/courses" className={navLink}>Courses</Link>
          <Link to="/contact" className={navLink}>Contact</Link>

          {!isAuthenticated ? (
            <Link to="/register" className={navLink}>Register</Link>
          ) : null}

          {/* PROFILE DROPDOWN (Only shown when logged in) */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition"
              >
                <IoPersonCircle size={24} className="text-indigo-600" />
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  {user.firstName || "User"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  {/* Dashboard Link */}
                  <Link
                    to="/students"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-indigo-50 transition"
                  >
                    <IoHome size={18} />
                    <span>Dashboard</span>
                  </Link>

                  {/* My Courses Link */}
                  <Link
                    to="/students/my-courses"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-indigo-50 transition"
                  >
                    <IoBook size={18} />
                    <span>My Courses</span>
                  </Link>

                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-indigo-50 transition"
                  >
                    <IoPersonCircle size={18} />
                    <span>Profile</span>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition border-t border-gray-100 mt-2"
                  >
                    <IoLogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Login icon when not logged in
            <Link
              to="/login"
              className="p-2 rounded-full hover:bg-indigo-50 transition cursor-pointer"
            >
              <IoSchool size={22} className="text-indigo-600" />
            </Link>
          )}
        </div>

      </div>

      {/* Close dropdown when clicking outside */}
      {showProfileMenu && (
        <div
          onClick={() => setShowProfileMenu(false)}
          className="fixed inset-0 z-40"
        />
      )}
    </nav>
  );
}
