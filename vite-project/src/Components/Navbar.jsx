import { Link, useLocation, useNavigate } from "react-router-dom";
import { PiStudentBold } from "react-icons/pi";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToHome = () => {
    if (location.pathname !== "/") navigate("/");
    else document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
  };

  const navBtn =
    "px-4 py-2 rounded-lg border-2 border-violet-600 \
     bg-violet-50 text-violet-700 font-semibold \
     hover:bg-violet-600 hover:text-white transition";

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-violet-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <div onClick={goToHome} className="flex items-center gap-3 cursor-pointer">
          <img src="/logo.png" alt="Learnix" className="h-10" />
          <span className="text-2xl font-bold text-violet-700">
            Learnix
          </span>
        </div>

        {/* NAV */}
        <div className="flex items-center gap-4">
          <button onClick={goToHome} className={navBtn}>Home</button>
          <Link to="/courses" className={navBtn}>Courses</Link>
          <Link to="/contact" className={navBtn}>Contact</Link>
          <Link to="/register" className={navBtn}>Register</Link>

          {/* E-LEARNING ICON */}
          <div
            className="px-4 py-2 rounded-lg border-2 border-violet-600
            bg-violet-50 hover:bg-violet-600 transition cursor-pointer"
            title="Learning Portal"
          >
            <PiStudentBold
              size={24}
              className="text-violet-700 hover:text-white"
            />
          </div>
        </div>

      </div>
    </nav>
  );
}

