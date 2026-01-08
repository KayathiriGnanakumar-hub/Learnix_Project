import { NavLink } from "react-router-dom";
import { IoHome, IoBook, IoTrendingUp, IoTrophy, IoBriefcase } from "react-icons/io5";

const base = "block px-4 py-3 rounded-xl transition font-medium";

export default function StudentSidebar() {
  return (
    <aside className="w-64 text-white p-6 shadow-2xl sticky top-0 h-screen" style={{ background: 'linear-gradient(180deg, var(--footer-start), var(--footer-end))' }}>
      <div className="mb-10 border-2 border-white rounded-lg p-4 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <img src="/logo.png" alt="Learnix" className="h-12 w-12 rounded" onError={(e)=>{e.target.style.display='none'}} />
          <h2 className="text-2xl font-bold tracking-wide text-indigo-700">Learnix</h2>
        </div>
        <p className="text-indigo-600 text-xs font-semibold tracking-widest">STUDENT PORTAL</p>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/students"
          end
          className={({ isActive }) =>
            `${base} flex items-center gap-3 ${
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
          to="/students/my-courses"
          className={({ isActive }) =>
            `${base} flex items-center gap-3 ${
              isActive
                ? "bg-white text-indigo-700 shadow-lg"
                : "text-white hover:bg-white/10"
            }`
          }
        >
          <IoBook className="w-5 h-5" />
          My Courses
        </NavLink>

        <NavLink
          to="/students/progress"
          className={({ isActive }) =>
            `${base} flex items-center gap-3 ${
              isActive
                ? "bg-white text-indigo-700 shadow-lg"
                : "text-white hover:bg-white/10"
            }`
          }
        >
          <IoTrendingUp className="w-5 h-5" />
          Progress
        </NavLink>

        <NavLink
          to="/students/certificates"
          className={({ isActive }) =>
            `${base} flex items-center gap-3 ${
              isActive
                ? "bg-white text-indigo-700 shadow-lg"
                : "text-white hover:bg-white/10"
            }`
          }
        >
          <IoTrophy className="w-5 h-5" />
          Certificates
        </NavLink>

        <NavLink
          to="/students/internships"
          className={({ isActive }) =>
            `${base} flex items-center gap-3 ${
              isActive
                ? "bg-white text-indigo-700 shadow-lg"
                : "text-white hover:bg-white/10"
            }`
          }
        >
          <IoBriefcase className="w-5 h-5" />
          Internships
        </NavLink>
      </nav>
    </aside>
  );
}
