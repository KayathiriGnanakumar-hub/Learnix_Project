import { useEffect, useState } from "react";
import { FaBook, FaUserGraduate, FaClipboardList } from "react-icons/fa";

export default function AdminDashboard() {
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(120);
  const [totalEnrollments, setTotalEnrollments] = useState(0);

  useEffect(() => {
    const enrolled =
      JSON.parse(localStorage.getItem("enrolled_courses")) || [];
    setTotalEnrollments(enrolled.length);
  }, []);

  const Card = ({ title, value, icon, border, textColor }) => (
    <div
      className={`bg-white rounded-2xl border-2 ${border}
      shadow-sm hover:shadow-lg transition p-6 flex items-center gap-5`}
    >
      <div className="p-4 rounded-xl bg-purple-600 text-white text-2xl">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-1">
        Admin Dashboard
      </h1>

      <p className="text-slate-500 mb-8">
        Platform statistics overview
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Total Courses"
          value={totalCourses}
          icon={<FaBook />}
          border="border-purple-300"
          textColor="text-purple-600"
        />

        <Card
          title="Total Students"
          value={totalStudents}
          icon={<FaUserGraduate />}
          border="border-green-300"
          textColor="text-green-600"
        />

        <Card
          title="Total Enrollments"
          value={totalEnrollments}
          icon={<FaClipboardList />}
          border="border-yellow-300"
          textColor="text-yellow-600"
        />
      </div>
    </div>
  );
}
