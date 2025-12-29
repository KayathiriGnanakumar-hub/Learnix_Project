import { NavLink } from "react-router-dom";

const base =
  "block px-4 py-3 rounded-xl text-sm font-medium transition border-2";

const active =
  "bg-white text-indigo-600 border-white shadow";

const inactive =
  "text-white border-indigo-300 hover:bg-indigo-500 hover:shadow";

export default function StudentSidebar() {
  return (
    <aside
      className="w-64"
      style={{
        minHeight: "calc(100vh - 100px)",
        background: "linear-gradient(180deg, #5B21B6, #4F46E5)",
      }}
    >
      <nav className="p-5 space-y-4">

        <NavLink
          to="/students"
          end
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/students/courses"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          My Courses
        </NavLink>

        <NavLink
          to="/students/progress"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Progress
        </NavLink>

        <NavLink
          to="/students/certificates"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Certificates
        </NavLink>

        <NavLink
          to="/students/internships"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Internships
        </NavLink>

      </nav>
    </aside>
  );
}
