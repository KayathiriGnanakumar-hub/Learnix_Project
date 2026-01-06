import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";

export default function StudentLayout() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--site-bg)' }}>
      <StudentSidebar />

      <main className="flex-1 flex flex-col">
        <StudentHeader />
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
