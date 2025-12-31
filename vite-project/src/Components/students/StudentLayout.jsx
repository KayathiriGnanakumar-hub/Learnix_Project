import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-purple-50">
      <StudentHeader />

      <div className="flex">
        <StudentSidebar />

        <main className="flex-1 p-6">
          <div className="bg-white rounded-2xl border border-purple-200
          shadow-sm p-6 min-h-[calc(100vh-90px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
