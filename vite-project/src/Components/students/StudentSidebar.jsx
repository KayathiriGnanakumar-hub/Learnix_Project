import { NavLink } from "react-router-dom";

const base =
  "block px-3 py-2 rounded-lg text-sm font-medium transition"; // 🔽 reduced padding

const active =
  "bg-white text-purple-700";

const inactive =
  "text-purple-200 hover:bg-purple-700 hover:text-white";

export default function StudentSidebar() {
  return (
    <aside
      className="w-56 border-r-2 border-white" // 🔽 width reduced (w-64 → w-56)
      style={{
        minHeight: "calc(100vh - 70px)",
        background: "linear-gradient(180deg, #4338CA, #6D28D9)",
      }}
    >
      <nav className="p-4 space-y-2"> {/* 🔽 reduced spacing (space-y-4 → space-y-2) */}
        
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
          to="/students/my-courses"
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
