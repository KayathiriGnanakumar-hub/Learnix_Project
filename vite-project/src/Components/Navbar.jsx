import { Link, useLocation, useNavigate } from "react-router-dom";
import { PiStudentBold } from "react-icons/pi";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToHome = () => {
    if (location.pathname !== "/") navigate("/");
    else document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
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
          <img src="/logo.png" alt="Learnix" className="h-9" />
          <span className="text-xl font-bold text-indigo-600">Learnix</span>
        </div>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6">
          <button onClick={goToHome} className={navLink}>Home</button>
          <Link to="/courses" className={navLink}>Courses</Link>
          <Link to="/contact" className={navLink}>Contact</Link>
          <Link to="/register" className={navLink}>Register</Link>

          <div className="p-2 rounded-full hover:bg-indigo-50 transition cursor-pointer">
            <PiStudentBold size={22} className="text-indigo-600" />
          </div>
        </div>

      </div>
    </nav>
  );
}
