import { Outlet, NavLink } from "react-router-dom";

const linkBase =
  "block px-4 py-3 rounded-xl border border-white/40 transition font-medium";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-purple-700 to-indigo-600 text-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-10 tracking-wide">
          Admin Panel
        </h2>

        <nav className="space-y-4">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-white text-purple-700 shadow-md"
                  : "hover:bg-white/15"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/courses"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-white text-purple-700 shadow-md"
                  : "hover:bg-white/15"
              }`
            }
          >
            Manage Courses
          </NavLink>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8 bg-slate-50">
        <Outlet />
      </main>

    </div>
  );
}
