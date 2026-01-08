import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoHome, IoBook, IoPeople, IoShield, IoLogOut, IoMail } from "react-icons/io5";

const linkBase =
  "block px-4 py-3 rounded-xl transition font-medium";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--site-bg)' }}>

      {/* SIDEBAR */}
      <aside className="w-64 text-white p-6 shadow-2xl sticky top-0 h-screen" style={{ background: 'linear-gradient(180deg, var(--footer-start), var(--footer-end))' }}>
        <div className="mb-10 border-2 border-white rounded-lg p-4 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo.png" alt="Learnix" className="h-12 w-12 rounded" onError={(e)=>{e.target.style.display='none'}} />
            <h2 className="text-2xl font-bold tracking-wide text-indigo-700">Learnix</h2>
          </div>
          <p className="text-indigo-600 text-xs font-semibold tracking-widest">ADMIN PANEL</p>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${linkBase} flex items-center gap-3 ${
                isActive
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <IoHome className="w-5 h-5" />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/courses"
            className={({ isActive }) =>
              `${linkBase} flex items-center gap-3 ${
                isActive
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <IoBook className="w-5 h-5" />
            Manage Courses
          </NavLink>

          <NavLink
            to="/admin/students"
            className={({ isActive }) =>
              `${linkBase} flex items-center gap-3 ${
                isActive
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <IoPeople className="w-5 h-5" />
            Students
          </NavLink>

          <NavLink
            to="/admin/manage"
            className={({ isActive }) =>
              `${linkBase} flex items-center gap-3 ${
                isActive
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <IoShield className="w-5 h-5" />
            Admin Access
          </NavLink>

          <NavLink
            to="/admin/internships"
            className={({ isActive }) =>
              `${linkBase} flex items-center gap-3 ${
                isActive
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <IoBook className="w-5 h-5" />
            Internship Applications
          </NavLink>

          <NavLink
            to="/admin/contact-queries"
            className={({ isActive }) =>
              `${linkBase} flex items-center gap-3 ${
                isActive
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <IoMail className="w-5 h-5" />
            Contact Queries
          </NavLink>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1">
        {/* Admin Header */}
        <header className="w-full sticky top-0 z-40" style={{ background: 'linear-gradient(90deg, var(--footer-start), var(--footer-end))' }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="hidden sm:block">
                <input placeholder="Search users, courses..." className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white placeholder-white/70 outline-none w-80 focus:ring-2 focus:ring-white/50 transition" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-white text-sm">Signed in as <strong className="ml-2">{user?.firstName || user?.name || 'Admin'}</strong></div>
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:opacity-95 transition flex items-center gap-2">
                <IoLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
