import { useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";

export default function StudentHeader() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("learnix_user"));
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="w-full sticky top-0 z-40" style={{ background: 'linear-gradient(90deg, var(--footer-start), var(--footer-end))' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="hidden sm:block">
            <input placeholder="Search courses..." className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white placeholder-white/70 outline-none w-80 focus:ring-2 focus:ring-white/50 transition" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center text-sm">
              {firstLetter}
            </div>
            <div className="text-white text-sm">
              <div className="font-semibold">{user?.name || 'Student'}</div>
              <div className="text-white/80 text-xs">{user?.email || 'student'}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:opacity-95 transition flex items-center gap-2"
          >
            <IoLogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
